"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ProductionOrder = {
  id: number;
  materialId: string;
  quantity: number;
  priority: number;
};

type ReorderViewProps = {
  periodId: number;
};

export default function ReorderView({ periodId }: ReorderViewProps) {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrCreateOrders = async () => {
      try {
        let response = await fetch(`/api/period/${periodId}/reorderProduction/`, {
          method: "GET",
        });

        if (response.ok) {
          const fetchedOrders: ProductionOrder[] = await response.json();
          if (fetchedOrders.length > 0) {
            setOrders(fetchedOrders);
            setLoading(false);
            return;
          }
        }

        response = await fetch(`/api/period/${periodId}/reorderProduction/`, {
          method: "POST",
        });

        if (response.ok) {
          const createdOrders: ProductionOrder[] = await response.json();
          setOrders(createdOrders);
        } else {
          throw new Error("Failed to create production orders.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateOrders();
  }, [periodId]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (active.id !== over?.id) {
      const oldIndex = orders.findIndex((order) => order.id === active.id);
      const newIndex = orders.findIndex((order) => order.id === over?.id);
  
      const reorderedOrders = arrayMove(orders, oldIndex, newIndex);
  
      const updatedOrders = reorderedOrders.map((order, index) => ({
        ...order,
        priority: index + 1,
      }));
  
      setOrders(updatedOrders);
  
      try {
        const response = await fetch(`/api/period/${periodId}/reorderProduction/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productionOrders: updatedOrders.map(({ id, priority }) => ({ id, priority })),
          }),
        });
  
        if (!response.ok) {
          console.error("Failed to update priorities on the backend.");
          setOrders(orders);
        }
      } catch (error) {
        console.error("Error updating priorities on the backend:", error);
        setOrders(orders);
      }
    }
  };
  

  const splitQuantity = async (index: number, splitAmount: number) => {
    const previousOrders = [...orders];
  
    // Update orders state
    setOrders((prevOrders) => {
      const currentOrder = prevOrders[index];
  
      if (!currentOrder || splitAmount <= 0 || splitAmount >= currentOrder.quantity) return prevOrders;
  
      const updatedOrder = {
        ...currentOrder,
        quantity: currentOrder.quantity - splitAmount,
      };
  
      const newOrder = {
        id: 0,
        materialId: currentOrder.materialId,
        quantity: splitAmount,
        priority: currentOrder.priority + 1, // Increment priority for the new order
      };
  
      // Insert the updated order and the new order into the list
      const newOrders = [...prevOrders];
      newOrders[index] = updatedOrder;
      newOrders.splice(index + 1, 0, newOrder); // Insert new order right after
  
      for (let i = index + 2; i < newOrders.length; i++) {
        newOrders[i].priority += 1;
      }

      return newOrders;
    });

    const orderSplittedFrom = orders[index];
    const { id, materialId, priority } = orderSplittedFrom;
  
    // Create new splitted production order on backend
    try {
      console.log(orderSplittedFrom);
      console.log(id)
      const response = await fetch(`/api/period/${periodId}/splitting/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId,
          quantity: splitAmount,
          priority: priority + 1,
          periodId: Number(periodId),
          originalOrderId: Number(id)
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to persist the split on the backend.");
      }
  
      const { createdId } = await response.json();
  
      // Update orders with the new order ID received from the backend
      setOrders((prevOrders) => {
        const newOrders = [...prevOrders];
        newOrders[index + 1].id = createdId; // Assign backend-provided ID to the new order
        return newOrders;
      });
  
      console.log("Updated order with new ID:", orders[index + 1]);
    } catch (error) {
      console.error("Error persisting the split on the backend.", error);
      setOrders(previousOrders); // Rollback
    }
  };
  

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  return (
    <div className="overflow-x-auto">
      {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="text-red-500">Error: {error}</p>
    ) : orders.length === 0 ? (
      <p>No production orders found.</p>
    ) : (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Production Orders</h1>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={orders.map((order) => order.id)} strategy={verticalListSortingStrategy}>
            {orders.map((order, index) => (
              <SortableItem
                key={order.id}
                order={order}
                index={index}
                splitQuantity={splitQuantity}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    )}
    </div>
  );  
}     

type SortableItemProps = {
  order: ProductionOrder;
  index: number;
  splitQuantity: (index: number, splitAmount: number) => void;
};

function SortableItem({ order, index, splitQuantity }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 mb-2 bg-gray-100 rounded-md shadow-sm flex items-center justify-between"
      {...attributes}
      {...listeners}
    >
      <div>
        <p className="font-semibold">Material: {order.materialId}</p>
        <p>Quantity: {order.quantity}</p>
        <p>Priority: {index + 1}</p>
      </div>
      <div>
        <button
          className="text-blue-500 hover:underline mr-4"
          onClick={() => {
            const splitAmount = parseInt(prompt("Enter split amount:") || "0", 10);
            if (!isNaN(splitAmount)) {
              splitQuantity(index, splitAmount);
            }
          }}
        >
          Split
        </button>
      </div>
    </div>
  );
}

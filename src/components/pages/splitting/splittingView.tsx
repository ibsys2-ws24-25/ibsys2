"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
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

type SplittingViewProps = {
  periodId: number;
};

export default function SplittingView({ periodId }: SplittingViewProps) {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrCreateOrders = async () => {
      try {
        let response = await fetch(`/api/period/${periodId}/splitting/`, {
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

        response = await fetch(`/api/period/${periodId}/splitting/`, {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = orders.findIndex((order) => order.id === active.id);
      const newIndex = orders.findIndex((order) => order.id === over?.id);
      setOrders((prevOrders) => arrayMove(prevOrders, oldIndex, newIndex));
    }
  };

  const splitQuantity = (index: number, splitAmount: number) => {
    setOrders((prevOrders) => {
      const currentOrder = prevOrders[index];
      if (!currentOrder || splitAmount <= 0 || splitAmount >= currentOrder.quantity) return prevOrders;

      const updatedOrder = {
        ...currentOrder,
        quantity: currentOrder.quantity - splitAmount,
      };
      const newOrder = {
        id: Math.max(...prevOrders.map((o) => o.id)) + 1,
        materialId: currentOrder.materialId,
        quantity: splitAmount,
        priority: 0, // New items start with no priority, updated on save
      };

      const newOrders = [...prevOrders];
      newOrders[index] = updatedOrder;
      newOrders.splice(index + 1, 0, newOrder); // Insert new order right after
      return newOrders;
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Production Orders</h1>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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

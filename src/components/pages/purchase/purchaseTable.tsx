"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from "@/components/ui/table";
import { PurchaseParts } from "@/lib/prodUtils";
import { Order, OrderDecision } from "@prisma/client";
import { useEffect, useState } from "react";
import { MaterialRequirement } from "@/app/api/period/[periodId]/material/route";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PurchaseTableProps {
    purchaseParts: PurchaseParts[];
    periodId: number;
    orders: Order[];
    orderDecisions: OrderDecision[];
    requiredMaterials: MaterialRequirement[];
}

const PurchaseTable = ({ orders, purchaseParts, periodId, orderDecisions, requiredMaterials }: PurchaseTableProps) => {
  const [isUpdatingRow, setIsUpdatingRow] = useState<{ [key: string]: boolean }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: { amount: number; mode: number } }>({});

  useEffect(() => {
    const initialValues: { [key: string]: { amount: number; mode: number } } = {};

    orderDecisions.forEach((decision) => {
      initialValues[decision.materialId] = {
        amount: decision.amount,
        mode: decision.mode,
      };
    });

    setInputValues(initialValues);
  }, [orderDecisions]);

  const handleInputChange = (materialId: string, key: 'amount' | 'mode', value: number) => {
    setInputValues((prev) => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        [key]: value,
      },
    }));
  };

  const saveRowValues = async (materialId: string) => {
    setIsUpdatingRow((prev) => ({ ...prev, [materialId]: true }));
    const rowValues = inputValues[materialId] || {};

    try {
      const response = await fetch(`/api/period/${periodId}/orderDecision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId,
          amount: rowValues.amount || 0,
          mode: rowValues.mode || 0,
          orderPeriod: Number(periodId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save values for the row.");
      }

      console.log(`Values for material ${materialId} saved successfully!`);
    } catch (error) {
      console.error(`Error saving values for material ${materialId}:`, error);
      console.log(`Error saving values for material ${materialId}. Please try again.`);
    } finally {
      setIsUpdatingRow((prev) => ({ ...prev, [materialId]: false }));
    }
  };

  return (
    <div className="">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead>Purchase Part</TableHead>
            <TableHead>Delivery Time</TableHead>
            <TableHead>Variance</TableHead>
            <TableHead>Discount quantity</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>
              <div className="flex flex-col text-center">
                <span>Gross Requirements per Production Period</span>
                  <div className="flex">
                    <span className="flex-1">{Number(periodId) + 1}</span>
                    <span className="flex-1">{Number(periodId) + 2}</span>
                    <span className="flex-1">{Number(periodId) + 3}</span>
                    <span className="flex-1">{Number(periodId) + 4}</span>
                  </div>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex flex-col w-full">
                <span>Pending Orders</span>
                <div className="flex space-x-4">
                  <span className="w-1/2">Amount</span>
                  <span className="w-1/2">Arrival</span>
                </div>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex flex-col">
                <span>Order</span>
                  <div className="flex">
                    <span className="w-3/4">Amount</span>
                    <span className="w-1/4">Type</span>
                  </div>
              </div>
            </TableHead>
            <TableHead>
            <div className="flex flex-col text-center">
                <span>End-of-Period Stock (Including Planned Deliveries)</span>
                  <div className="flex">
                    <span className="flex-1">{Number(periodId) + 1}</span>
                    <span className="flex-1">{Number(periodId) + 2}</span>
                    <span className="flex-1">{Number(periodId) + 3}</span>
                    <span className="flex-1">{Number(periodId) + 4}</span>
                  </div>
              </div>
            </TableHead>
            <TableHead>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {purchaseParts.map((material) => {
            const materialOrders = orders.filter((order) => order.materialId === material.materialId);
            const requiredMaterialsFiltered = requiredMaterials.filter((reqMaterial) => reqMaterial.materialId === material.materialId);
            requiredMaterialsFiltered.sort((a, b) => a.periodId - b.periodId);
            return (
              <TableRow key={material.materialId}>
                  <TableCell>
                      {material.materialId}
                  </TableCell>
                  <TableCell>
                      {material.deliveryTime}
                  </TableCell>
                  <TableCell>
                      {material.variance}
                  </TableCell>
                  <TableCell>
                      {material.defaultStock}
                  </TableCell>
                  <TableCell>
                      {material.warehouseStock}
                  </TableCell>
                  <TableCell>
                    {requiredMaterialsFiltered.length > 0 ? (
                      <div className="w-full flex">
                        {requiredMaterialsFiltered.map((reqMaterial) => (
                          <span className="w-1/4 text-center" key={reqMaterial.materialId}>
                            {reqMaterial.amount}
                          </span>
                        ))}
                      </div>
                    ) : (
                    <span></span> 
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="">
                      {materialOrders.length > 0 ? (
                        <div className="flex flex-col justify-center items-center w-full">
                          {materialOrders.map((order) => (
                            <div key={order.orderId} className="w-full flex items-center">
                              <span className="w-1/2 text-center">
                                {order.amount}
                              </span>
                              <span className="w-1/2 text-center">
                                {Math.round(order.orderPeriod + material.deliveryTime)} / {Math.round(order.orderPeriod + material.deliveryTime + material.variance)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span></span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <Input
                        type="number"
                        min={0}
                        step={100}
                        value={inputValues[material.materialId]?.amount || ""}
                        onChange={(e) =>
                          handleInputChange(material.materialId, "amount", parseInt(e.target.value, 10) || 0)
                        }
                        disabled={isUpdatingRow[material.materialId]}
                        className="text-center w-2/3  mr-1"
                      />
                      <div className="flex-1 text-center w-1/3">
                        <Select
                          value={inputValues[material.materialId]?.mode?.toString() || ""}
                          onValueChange={(value) =>
                            handleInputChange(material.materialId, "mode", parseInt(value, 10) || 0)
                          }
                          disabled={isUpdatingRow[material.materialId]}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">Normal</SelectItem>
                            <SelectItem value="4">Express</SelectItem>
                            <SelectItem value="3">JIT</SelectItem>
                            <SelectItem value="2">Cheap Provider</SelectItem>
                            <SelectItem value="1">Special Order</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <span className="flex-1 text-center">ToDO</span>
                      <span className="flex-1 text-center">ToDO</span>
                      <span className="flex-1 text-center">ToDO</span>
                      <span className="flex-1 text-center">ToDO</span>
                    </div>
                  </TableCell>
                  <TableCell>
                  <Button
                    onClick={() => saveRowValues(material.materialId)}
                    disabled={isUpdatingRow[material.materialId]}
                  >
                    {isUpdatingRow[material.materialId] ? "Saving..." : "Save"}
                  </Button>
                  </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default PurchaseTable;
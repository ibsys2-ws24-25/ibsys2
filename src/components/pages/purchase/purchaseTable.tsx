"use client"

import { Input } from "@/components/ui/input";
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from "@/components/ui/table";
import { PurchaseParts } from "@/lib/prodUtils";
import { Order } from "@prisma/client";

export interface PurchaseTableProps {
    purchaseParts: PurchaseParts[];
    periodId: number;
    orders: Order[];
}

const PurchaseTable = ({ orders, purchaseParts, periodId }: PurchaseTableProps) => {
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
          </TableRow>
        </TableHeader>

        <TableBody>
          {purchaseParts.map((material) => {
            const materialOrders = orders.filter((order) => order.materialId === material.materialId);

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
                  <div className="flex">
                    <span className="flex-1 text-center">ToDO</span>
                    <span className="flex-1 text-center">ToDO</span>
                    <span className="flex-1 text-center">ToDO</span>
                    <span className="flex-1 text-center">ToDO</span>
                  </div>
                  </TableCell>
                  <TableCell>
                    <div className="">
                      {materialOrders.length > 0 ? (
                        <div className="flex justify-center items-center w-full">
                          {materialOrders.map((order) => (
                            <><span className="w-1/2 text-center" key={order.id}>
                              {order.amount}
                            </span>
                            <span className="w-1/2 text-center" key={order.id}>
                              {Math.round(order.orderPeriod + material.deliveryTime)} / {Math.round(order.orderPeriod + material.deliveryTime + material.variance)}
                            </span></>
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
                        step={1}
                        className="text-center w-3/4"/>
                      <span className="flex-1 text-center w 1/4 p-3">ToDO</span>
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default PurchaseTable;
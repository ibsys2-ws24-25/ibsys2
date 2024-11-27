"use client"

import { Input } from "@/components/ui/input";
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from "@/components/ui/table";
import { PurchaseParts } from "@/lib/prodUtils";

export interface PurchaseTableProps {
    purchaseParts: PurchaseParts[];
    periodId: number;
}

const PurchaseTable = ({ purchaseParts, periodId }: PurchaseTableProps) => {
  return (
    <div className="">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead>Nr. Kaufteil</TableHead>
            <TableHead>Lieferfrist</TableHead>
            <TableHead>Abweichung</TableHead>
            <TableHead>Diskontmenge</TableHead>
            <TableHead>Lagerbestand</TableHead>
            <TableHead>
              <div className="flex flex-col text-center">
                <span>Bruttobedarf gemäß Produktionsprogramm</span>
                  <div className="flex">
                    <span className="flex-1">{Number(periodId) + 1}</span>
                    <span className="flex-1">{Number(periodId) + 2}</span>
                    <span className="flex-1">{Number(periodId) + 3}</span>
                    <span className="flex-1">{Number(periodId) + 4}</span>
                  </div>
              </div>
            </TableHead>
            <TableHead>ausstehende Bestellung</TableHead>
            <TableHead>
              <div className="flex flex-col">
                <span>Bestellung</span>
                  <div className="flex">
                    <span className="w-3/4">Menge</span>
                    <span className="w-1/4">Art</span>
                  </div>
              </div>
            </TableHead>
            <TableHead>
            <div className="flex flex-col text-center">
                <span>Bestand nach geplantem Wareneingang (Periodenende)</span>
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
            {purchaseParts.map((material) => (
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
                        ToDo
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
            ))}
            </TableBody>
      </Table>
    </div>
  );
}

export default PurchaseTable;
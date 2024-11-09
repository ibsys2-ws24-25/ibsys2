"use client"

import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from "@/components/ui/table";
import { PurchaseParts } from "@/lib/prodUtils";

export interface PurchaseTableProps {
    purchaseParts: PurchaseParts[];
}

const PurchaseTable = ({ purchaseParts}: PurchaseTableProps) => {
  return (
    <div className="">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead>Nr. Kaufteil</TableHead>
            <TableHead>Lieferfrist</TableHead>
            <TableHead>Abweichung</TableHead>
            <TableHead>P1</TableHead>
            <TableHead>P2</TableHead>
            <TableHead>P3</TableHead>
            <TableHead>Diskontmenge</TableHead>
            <TableHead>Lagerbestand</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
            {Array.isArray(purchaseParts) && purchaseParts.map((material) => (
                <TableRow key={material.materialId}>
                    <TableCell>
                        {material.materialId}
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                        {material.defaultStock}
                    </TableCell>
                    <TableCell>
                        {material.warehouseStock}
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
      </Table>
    </div>
  );
}

export default PurchaseTable;
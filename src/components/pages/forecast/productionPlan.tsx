import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductionData {
  product: string;
  amounts: number[];
}

interface ProductionTableProps {
  currentPeriod: number;
}

// Initialisieren Sie die Daten außerhalb der Komponente, um sicherzustellen, dass sie definiert sind.
const initialProductionData: ProductionData[] = [
  { product: "P1: Kinderfahrrad", amounts: [150, 250, 250, 200] },
  { product: "P2: Frauenrad", amounts: [200, 150, 150, 100] },
  { product: "P3: Männerrad", amounts: [150, 100, 100, 100] },
];

export function ProductionTable({ currentPeriod }: ProductionTableProps) {
  const [productionData, setProductionData] = useState<ProductionData[]>(initialProductionData);

  const handleInputChange = (index: number, periodOffset: number, value: string) => {
    const newData = [...productionData];
    newData[index].amounts[periodOffset] = Number(value);
    setProductionData(newData);
  };

  return (
    <Table>
      <TableCaption>Produktionsprogramm: Wie viel wollen wir wovon produzieren?</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Produkt</TableHead>
          <TableHead>Periode {currentPeriod}</TableHead>
          <TableHead>Periode {+currentPeriod + 1}</TableHead>
          <TableHead>Periode {+currentPeriod + 2}</TableHead>
          <TableHead>Periode {+currentPeriod + 3}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productionData.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data.product}</TableCell>
            {data.amounts.map((amount, periodOffset) => (
              <TableCell key={periodOffset}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleInputChange(index, periodOffset, e.target.value)}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Summe</TableCell>
          {Array.from({ length: 4 }, (_, i) => (
            <TableCell key={i}>
              {productionData.reduce((acc, cur) => acc + cur.amounts[i], 0)}
            </TableCell>
          ))}
        </TableRow>
      </TableFooter>
    </Table>
  );
}
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface DataWithAmounts {
  product: string;
  amounts: number[];
}

interface ProductionTableProps {
  currentPeriod: number;
  productionData: DataWithAmounts[];
  plannedStocks: DataWithAmounts[];
  handleProductionDataChange: (newData: DataWithAmounts[]) => void;
}

export function ProductionTable({ currentPeriod, productionData, plannedStocks, handleProductionDataChange }: ProductionTableProps) {
  const [productionValues, setProductionValues] = useState<DataWithAmounts[]>(productionData);

  useEffect(() => {
    setProductionValues(productionData);
  }, [productionData]);

  const handleInputChange = (index: number, periodOffset: number, value: string) => {
    const updatedProductionData = productionValues.map((prod, idx) => 
      idx === index 
        ? {
            ...prod,
            amounts: prod.amounts.map((amount, offset) => offset === periodOffset ? Number(value) : amount)
          }
        : prod
    );

    setProductionValues(updatedProductionData);
    handleProductionDataChange(updatedProductionData);
  };

  return (
    <div>
      <Table>
        <TableCaption>Produktionsprogramm: Wie viel wollen wir wovon produzieren?</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Produkt</TableHead>
            {Array.from({ length: 4 }, (_, i) => <TableHead key={i}>Periode {+ currentPeriod + i}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {productionValues.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.product}</TableCell>
              {data.amounts.map((amount, periodOffset) => (
                <TableCell key={periodOffset}>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => handleInputChange(index, periodOffset, e.target.value)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Tabelle für geplante Lagerbestände */}
      <Table>
        <TableCaption>Geplante Lagerbestände am Ende jeder Periode</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Produkt</TableHead>
            {Array.from({ length: 4 }, (_, i) => <TableHead key={i}>Periode {+ currentPeriod + i}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {plannedStocks.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.product}</TableCell>
              {data.amounts.map((stock, periodOffset) => (
                <TableCell
                  key={periodOffset}
                  className={stock < 0 ? "bg-red-500 text-white" : ""}
                >
                  {stock}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
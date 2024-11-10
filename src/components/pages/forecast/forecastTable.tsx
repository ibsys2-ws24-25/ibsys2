import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataWithAmounts {
  product: string;
  amounts: number[]; // [Periode N, Periode N+1, Periode N+2, Periode N+3]
}

interface ForecastTableProps {
  currentPeriod: number;
  data: DataWithAmounts[];
  updateData: (newData: DataWithAmounts[]) => void; // Übergibt geänderte Daten an HomePage
}

export function ForecastTable({ currentPeriod, data, updateData }: ForecastTableProps) {
  const handleInputChange = (index: number, periodOffset: number, value: string) => {
    const updatedForecastData = data.map((item, idx) => 
      idx === index 
        ? {
            ...item,
            amounts: item.amounts.map((amount, offset) => offset === periodOffset ? parseInt(value) || 0 : amount)
          }
        : item
    );
    updateData(updatedForecastData); // Übergibt die geänderten Daten an HomePage
  };

  return (
    <Table>
      <TableCaption>Prognose der Fahrradbestellungen nach Produkt und Periode</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Material ID</TableHead>
          {Array.from({ length: 4 }, (_, i) => (
            <TableHead key={i}>Periode {+ currentPeriod + i}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.product}</TableCell>
            {item.amounts.map((amount, periodOffset) => (
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
    </Table>
  );
}
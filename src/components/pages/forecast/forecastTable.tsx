'use client'
import React, { useEffect, useState } from 'react';
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

interface ForecastData {
  materialId: string;
  currentPeriod: string; // Menge für die aktuelle Periode
  nextPeriod1: string;   // Menge für die folgende Periode
  nextPeriod2: string;   // Menge für die übernächste Periode
  nextPeriod3: string;   // Menge für die drittnächste Periode
}

interface ForecastTableProps {
  currentPeriod: number;
}

export function ForecastTable({ currentPeriod }: ForecastTableProps) {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  useEffect(() => {
    async function fetchForecastData(currentPeriod: number) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${currentPeriod}`, {
          cache: 'no-store',
      });
      if (!response.ok) {
          throw new Error('Failed to fetch period data');
      }
      const data = await response.json();
      setForecastData(data.Forecast.map(f => ({
        materialId: f.Material.id,
        currentPeriod: f.amount.toString(),
        nextPeriod1: '',
        nextPeriod2: '',
        nextPeriod3: ''
      })));
    }
    
    fetchForecastData(currentPeriod);
  }, [currentPeriod]);

  const updateField = (index: number, field: keyof ForecastData, value: string) => {
    setForecastData(forecastData.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
  };

  return (
    <Table>
      <TableCaption>Prognose der Fahrradbestellungen nach Produkt und Periode</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Material ID</TableHead>
          <TableHead>Periode {currentPeriod}</TableHead>
          <TableHead>Periode {+currentPeriod + 1}</TableHead>
          <TableHead>Periode {+currentPeriod + 2}</TableHead>
          <TableHead>Periode {+currentPeriod + 3}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forecastData.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data.materialId}</TableCell>
            <TableCell>{data.currentPeriod}</TableCell>
            <TableCell>
              <input
                type="number"
                value={data.nextPeriod1}
                onChange={(e) => updateField(index, 'nextPeriod1', e.target.value)}
              />
            </TableCell>
            <TableCell>
              <input
                type="number"
                value={data.nextPeriod2}
                onChange={(e) => updateField(index, 'nextPeriod2', e.target.value)}
              />
            </TableCell>
            <TableCell>
              <input
                type="number"
                value={data.nextPeriod3}
                onChange={(e) => updateField(index, 'nextPeriod3', e.target.value)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

"use client"
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

const initialForecastData = [
  {
    product: "P1: Kinderfahrrad",
    period5: null, // Initialwert null, wird durch API-Aufruf gefüllt
    period6: 200,
    forecast7: 250,
    forecast8: 250
  },
  {
    product: "P2: Frauenrad",
    period5: null,
    period6: 150,
    forecast7: 150,
    forecast8: 150
  },
  {
    product: "P3: Männerrad",
    period5: null,
    period6: 100,
    forecast7: 100,
    forecast8: 150
  },
];

export function ForecastTable() {
  const [forecastData, setForecastData] = useState(initialForecastData);

  // Funktion zum Abrufen der Daten für Periode 5
  useEffect(() => {
    async function fetchPeriodData() {
      // Hier deine API Aufruf einfügen
      const response = await fetch('${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${id}');
      const data = await response.json();
      setForecastData(forecastData.map((item, index) => ({
        ...item,
        period5: data[index].period5, // Annahme: Die API gibt ein Array von Werten zurück
      })));
    }
    fetchPeriodData();
  }, []);

  return (
    <Table>
      <TableCaption>Prognose der Fahrradbestellungen nach Produkt und Periode</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Produkt</TableHead>
          <TableHead>Periode 5</TableHead>
          <TableHead>Periode 6</TableHead>
          <TableHead>Prognose 7</TableHead>
          <TableHead>Prognose 8</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forecastData.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data.product}</TableCell>
            <TableCell>{data.period5 || 'Laden...'}</TableCell>
            <TableCell><input type="number" value={data.period6} onChange={(e) => {
              const newForecastData = [...forecastData];
              newForecastData[index].period6 = +e.target.value;
              setForecastData(newForecastData);
            }} /></TableCell>
            <TableCell><input type="number" value={data.forecast7} onChange={(e) => {
              const newForecastData = [...forecastData];
              newForecastData[index].forecast7 = +e.target.value;
              setForecastData(newForecastData);
            }} /></TableCell>
            <TableCell><input type="number" value={data.forecast8} onChange={(e) => {
              const newForecastData = [...forecastData];
              newForecastData[index].forecast8 = +e.target.value;
              setForecastData(newForecastData);
            }} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Summe</TableCell>
          <TableCell>{forecastData.reduce((acc, cur) => acc + (cur.period5 || 0), 0)}</TableCell>
          <TableCell>{forecastData.reduce((acc, cur) => acc + cur.period6, 0)}</TableCell>
          <TableCell>{forecastData.reduce((acc, cur) => acc + cur.forecast7, 0)}</TableCell>
          <TableCell>{forecastData.reduce((acc, cur) => acc + cur.forecast8, 0)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const productionData = [
  {
    product: "P1: Kinderfahrrad",
    period5: 150,
    period6: 250,
    period7: 250,
    period8: 200
  },
  {
    product: "P2: Frauenrad",
    period5: 200,
    period6: 150,
    period7: 150,
    period8: 100
  },
  {
    product: "P3: Männerrad",
    period5: 150,
    period6: 100,
    period7: 100,
    period8: 100
  },
];

export function ProductionTable() {
    return (
      <Table>
        <TableCaption>Produktionsprogramm: Wie viel wollen wir wovon produzieren?</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Produkt</TableHead>
            <TableHead>Periode 5</TableHead>
            <TableHead>Periode 6</TableHead>
            <TableHead>Periode 7</TableHead>
            <TableHead>Periode 8</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productionData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.product}</TableCell>
              <TableCell>{data.period5}</TableCell>
              <TableCell>{data.period6}</TableCell>
              <TableCell>{data.period7}</TableCell>
              <TableCell>{data.period8}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Summe</TableCell>
            <TableCell>{productionData.reduce((acc, cur) => acc + cur.period5, 0)}</TableCell>
            <TableCell>{productionData.reduce((acc, cur) => acc + cur.period6, 0)}</TableCell>
            <TableCell>{productionData.reduce((acc, cur) => acc + cur.period7, 0)}</TableCell>
            <TableCell>{productionData.reduce((acc, cur) => acc + cur.period8, 0)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
}

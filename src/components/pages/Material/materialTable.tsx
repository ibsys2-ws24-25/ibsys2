"use client"

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { tableData } from "@/app/MaterialP1/p1MockData";

const MaterialTable = () => {
    return (
        <div className="overflow-x-auto">
            <Table className="w-4/5 border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead>Item No.</TableHead>
                        <TableHead>Sales Orders</TableHead>
                        <TableHead>Safety Stock</TableHead>
                        <TableHead>Warehouse Stock</TableHead>
                        <TableHead>Orders in Queue</TableHead>
                        <TableHead>Work in Progress</TableHead>
                        <TableHead>Production Orders</TableHead>
                        <TableHead>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.map((row, index) => (
                        <TableRow key={index} className="border-t">
                            <TableCell>
                                <Input type="text" defaultValue={row.itemNo} disabled className="text-center"/>
                            </TableCell>
                            <TableCell>
                                <Input type="number" defaultValue={row.salesOrders} className="text-center"/>
                            </TableCell>
                            <TableCell>
                                <Input type="number" defaultValue={row.safetyStock} className="text-center"/>
                            </TableCell>
                            <TableCell>
                                <Input type="number" defaultValue={row.warehouseStock} className="text-center"/>
                            </TableCell>
                            <TableCell>
                                <Input type="number" defaultValue={row.queueOrders} className="text-center"/>
                            </TableCell>
                            <TableCell>
                                <Input type="number" defaultValue={row.workInProgress} className="text-center"/>
                            </TableCell>
                            <TableCell>
                                <Input type="number" defaultValue={row.productionOrders} className="text-center"/>
                            </TableCell>
                            <TableCell>
                                <Input type="text" defaultValue={row.description} disabled className="text-center"/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default MaterialTable;
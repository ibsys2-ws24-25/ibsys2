"use client"

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { tableData } from "@/app/periods/[periodId]/production-planning/[productId]/p1MockData";

const MaterialTable = () => {
    return (
        <div className="overflow-x-auto">
            <Table className=" border-collapse">
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
                                {row.itemNo}
                            </TableCell>
                            <TableCell>
                                {row.salesOrders}
                            </TableCell>
                            <TableCell>
                                <Input type="number" defaultValue={row.safetyStock} className="text-center w-full"/>
                            </TableCell>
                            <TableCell>
                                {row.warehouseStock}
                            </TableCell>
                            <TableCell>
                                {row.queueOrders}
                            </TableCell>
                            <TableCell>
                                {row.workInProgress}
                            </TableCell>
                            <TableCell>
                                {row.productionOrders}
                            </TableCell>
                            <TableCell>
                                {row.description}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default MaterialTable;
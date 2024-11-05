"use client"

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ProductionPlan } from "@/lib/prodUtils";

export interface MaterialTableProps {
    productionPlan: ProductionPlan[];
    defaultStockSetting: string;
}

const MaterialTable = ({ productionPlan, defaultStockSetting }: MaterialTableProps) => {


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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productionPlan.map((material) => (
                        <TableRow key={material.materialId} className="border-t">
                            <TableCell>
                                {material.materialId}
                            </TableCell>
                            <TableCell>
                                { material.salesPlan }
                            </TableCell>
                            <TableCell>
                                <Input type="number" defaultValue={parseInt(defaultStockSetting)} className="text-center w-full"/>
                            </TableCell>
                            <TableCell>
                                {material.warehouseStock}
                            </TableCell>
                            <TableCell>
                                {material.queueOrders}
                            </TableCell>
                            <TableCell>
                                {material.workInProgress}
                            </TableCell>
                            <TableCell>
                                {"To calc"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default MaterialTable;
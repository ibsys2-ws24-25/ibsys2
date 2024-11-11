import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function WorktimeView() {

    const headers = Array.from({ length: 15 }, (_, i) => i + 1);

    return(
        <div className="overflow-x-auto">
            <Table className=" border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead>Workplaces</TableHead>
                        {headers.map((number) => (
                                <TableHead key={number}>{number}</TableHead>
                            ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Capacity Requirements (New)</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Cap. Req. (backlog prev. Period)</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Setup time (backlog prev. Period)</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Setup time (new)</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Puffer</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Setup Time * Puffer</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Total capacity requirements</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Overtime</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Shift</TableCell>
                    </TableRow>
                </TableBody>
            </Table>  
        </div>
        
    );
}
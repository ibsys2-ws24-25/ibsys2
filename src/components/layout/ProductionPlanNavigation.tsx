import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

export default function ProductionPlanNavigation() {
    return (
        <Pagination className="w-full">
            <PaginationContent className="w-full">
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full" href="#">Forecast</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full" href="#">Material P1</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full" href="#">Material P2</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full" href="#">Material P3</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full" href="#">Workplace</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full" href="#">Purchase Planning</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    );
}
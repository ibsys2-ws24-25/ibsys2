"use client"

import { useParams } from "next/navigation";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

export default function ProductionPlanNavigation() {

    const params = useParams();
    const periodId  = params.periodId;

    return (
        <Pagination className="w-full">
            <PaginationContent className="w-full">
                <PaginationItem className="rounded">
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full border" href={`/periods/${periodId}/planning/production`}>Production</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full border" href={`/periods/${periodId}/planning/production/1`}>Material P1</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full border" href={`/periods/${periodId}/planning/production/2`}>Material P2</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full border" href={`/periods/${periodId}/planning/production/3`}>Material P3</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full border" href={`/periods/${periodId}/planning/workplace`}>Workplace</PaginationLink>
                </PaginationItem>
                <PaginationItem className="w-full">
                    <PaginationLink className="w-full border" href={`/periods/${periodId}/planning/purchase`}>Purchase Planning</PaginationLink>
                </PaginationItem>
                <PaginationItem className="bg-secondary rounded">
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    );
}
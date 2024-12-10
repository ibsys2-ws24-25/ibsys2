"use client"

import { useParams, usePathname, useRouter } from "next/navigation";
import { Pagination, PaginationContent, PaginationItem, PaginationLink} from "../ui/pagination";
import { Button } from "../ui/button";

export default function ProductionPlanNavigation() {

    const params = useParams();
    const periodId  = params.periodId;

    const router = useRouter();
    const pathname = usePathname();

  const pages = [
    { href: `/periods/${periodId}/planning/forecast`, label: "Forecast" },
    { href: `/periods/${periodId}/planning/production/1`, label: "Material P1" },
    { href: `/periods/${periodId}/planning/production/2`, label: "Material P2" },
    { href: `/periods/${periodId}/planning/production/3`, label: "Material P3" },
    { href: `/periods/${periodId}/planning/worktime`, label: "Workplace" },
    { href: `/periods/${periodId}/planning/purchase`, label: "Purchase Planning" },
  ];

  const currentIndex = pages.findIndex((page) => page.href === pathname);
  const previousPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  const handleNavigate = (href: string | null) => {
    if (href) router.push(href);
  };

    return (
        <Pagination className="w-full">
            <PaginationContent className="w-full">
                <PaginationItem className="rounded">
                    <Button
                        variant="ghost"
                        disabled={!previousPage}
                        onClick={() => handleNavigate(previousPage?.href || null)}
                        >
                            {"<"}  Previous
                    </Button>
                </PaginationItem>
                <PaginationItem className={`w-full rounded ${(currentIndex === 0) ? "bg-gray-100" : ""}`}>
                    <PaginationLink className="w-full" href={`/periods/${periodId}/planning/forecast`}>Forecast</PaginationLink>
                </PaginationItem>
                <PaginationItem className={`w-full rounded ${(currentIndex === 1) ? "bg-gray-100" : ""}`}>
                    <PaginationLink className="w-full" href={`/periods/${periodId}/planning/production/1`}>Material P1</PaginationLink>
                </PaginationItem>
                <PaginationItem className={`w-full rounded ${(currentIndex === 2) ? "bg-gray-100" : ""}`}>
                    <PaginationLink className="w-full" href={`/periods/${periodId}/planning/production/2`}>Material P2</PaginationLink>
                </PaginationItem>
                <PaginationItem className={`w-full rounded ${(currentIndex === 3) ? "bg-gray-100" : ""}`}>
                    <PaginationLink className="w-full" href={`/periods/${periodId}/planning/production/3`}>Material P3</PaginationLink>
                </PaginationItem>
                <PaginationItem className={`w-full rounded ${(currentIndex === 4) ? "bg-gray-100" : ""}`}>
                    <PaginationLink className="w-full" href={`/periods/${periodId}/planning/worktime`}>Workplace</PaginationLink>
                </PaginationItem>
                <PaginationItem className={`w-full rounded ${(currentIndex === 5) ? "bg-gray-100" : ""}`}>
                    <PaginationLink className="w-full" href={`/periods/${periodId}/planning/purchase`}>Purchase Planning</PaginationLink>
                </PaginationItem>
                <PaginationItem className="rounded">
                    <Button
                        variant="ghost"
                        disabled={!nextPage}
                        onClick={() => handleNavigate(nextPage?.href || null)}
                        >
                            Next  {">"}
                    </Button>       
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    );
}
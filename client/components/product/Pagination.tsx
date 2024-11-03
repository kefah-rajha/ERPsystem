"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import { any, string } from "zod";

interface PaginationPrposType {
  pageNumber: number;
}
export default function PaginationComponent({
  pageNumber,
}: PaginationPrposType) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  let numberPageParam = Number(searchParams.get("page")) || 1;
  const { replace, push } = useRouter();

  // let itemsPerPage = 10;
  // let totalPages = pageNumber;
  // let maxPages = Math.ceil(totalPages / itemsPerPage);
  // let numberPageParamForMoreExa =
  //   numberPageParam < 10 ? numberPageParam : numberPageParam + 1;
  // console.log(numberPageParamForMoreExa, "exatly");
  // let currentPageGroup = Math.ceil(numberPageParamForMoreExa / itemsPerPage);
  // console.log(currentPageGroup);
  // let startPage = (currentPageGroup - 1) * itemsPerPage + 1;
  // let endPage = Math.min(startPage + itemsPerPage - 1, totalPages);
  // console.log(currentPageGroup, "outside");

  let handlePageChange = (pagenum: number) => {
    params.set("page", pagenum.toString());
    push(`${pathname}?${params.toString()}`);
  };
 console.log()
  return (
    <Pagination className="mt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
          {}
        </PaginationItem>
        {
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              isActive={numberPageParam === 1 ? true : false}
              className={cn(numberPageParam === 1 ? "bg-orange-300 text-background" :null )}
            >
              1
            </PaginationLink>
          </PaginationItem>
        }
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {numberPageParam - 1 !== 1 && numberPageParam - 1 > 0 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(numberPageParam - 1)}
            >
              {numberPageParam - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {numberPageParam !== 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(numberPageParam)}
              isActive={numberPageParam === numberPageParam ? true : false}
              className="bg-orange-300 text-background"
            >
              {numberPageParam}
            </PaginationLink>
          </PaginationItem>
        )}
        {numberPageParam + 1 < pageNumber && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(numberPageParam + 1)}
            >
              {numberPageParam + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {numberPageParam + 1 < pageNumber && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(numberPageParam + 2)}
            >
              {numberPageParam + 2}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {pageNumber !== numberPageParam && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(pageNumber)}>
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

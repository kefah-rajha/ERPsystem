"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationControlsProps {
  numberProducts: number ;
  pageSize: number;
  countPages:number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PaginationControls({
  numberProducts,
  countPages,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  // Calculate total pages, starting item number, and ending item number
  const totalPages = countPages;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, numberProducts);
  
  console.log(numberProducts, "currentPage");
  
  return (
    <div className="flex items-center justify-between ">
      {/* Left side: Page size selector and item count information */}
      <div className="flex items-center space-x-6">
        {/* Page size selection dropdown */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px] card-gradient text-orange-200">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 25, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Current range of items being displayed */}
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {numberProducts} entries
        </div>
      </div>
      
      {/* Right side: Page navigation controls */}
      <div className="flex items-center space-x-2">
        {/* Button to go to first page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 card-gradient text-orange-200 cursor-pointer"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        {/* Button to go to previous page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 card-gradient text-orange-200"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Current page indicator */}
        <div className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        
        {/* Button to go to next page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 card-gradient text-orange-200"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Button to go to last page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 card-gradient text-orange-200"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

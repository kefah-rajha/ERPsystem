
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


interface CollapsibleCardProps {
    children: React.ReactNode;
    numberProducts: number;
    currentPage: number;
    countPages: number;
    isExpanded:boolean;
    setIsExpanded: (expanded: boolean) => void;


}

export default function CollapsibleCard({ children, numberProducts, currentPage, countPages ,isExpanded,setIsExpanded }: CollapsibleCardProps) {
    // State to track whether the card is expanded or collapsed
   

    return (
        <div className="sticky bottom-0 w-full">
            <div className="relative">
                {/* Toggle button positioned at the left edge of the card */}
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute -left-10 top-1/2 transform -translate-y-1/2 h-8 w-8 card-gradient text-orange-200"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>

                {/* Card content container with transition for sliding effect */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded
                            ? "w-full opacity-100 max-h-24"
                            : "w-0 max-h-0 opacity-0"
                        }`}
                >
                    {children}
                </div>

                {/* Minimal information shown when card is collapsed */}
                {!isExpanded && (
                    <div className=" text-sm  ">
                     P   <span className="font-bold text-orange-500">{currentPage}</span>  
                    </div>
                )}
            </div>
        </div>
    );
}
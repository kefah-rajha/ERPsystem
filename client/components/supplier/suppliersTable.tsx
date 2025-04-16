"use client";

// Imports (Ensure all are present)
import React, { useState, useRef, useEffect, ReactNode, useContext } from "react";
import { AllSupplierResponse } from "@/dataType/dataTypeSupplier/dataTypeSupplier";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarPlus, MoreVertical, Building } from "lucide-react"; // Icons
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import toast from 'react-hot-toast'; // Using react-hot-toast
import { SupplierContext } from "@/context/supplierContext"; // Assuming this path is correct
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Tooltip imports

// --- TruncatedCell Component Definition ---
interface TruncatedCellProps {
  children: ReactNode;
  className?: string;
  tooltipClassName?: string;
}

function TruncatedCell({ children, className = "", tooltipClassName = "" }: TruncatedCellProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        const currentlyTruncated = element.scrollWidth > element.clientWidth;
        if (currentlyTruncated !== isTruncated) {
            setIsTruncated(currentlyTruncated);
        }
      }
    };

    let observer: ResizeObserver | null = null;
    const element = textRef.current;

    if (element) {
        checkTruncation();
        observer = new ResizeObserver(checkTruncation);
        observer.observe(element);
    }
    const timeoutId = setTimeout(checkTruncation, 50);

    return () => {
        if (observer && element) {
            observer.unobserve(element);
        }
        clearTimeout(timeoutId);
    };
  }, [children, className, isTruncated]);

  if (!children || typeof children !== 'string' || children === "N/A") {
    return <span className={className}>{children || "N/A"}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div
            ref={textRef}
            className={`truncate ${className}`}
          >
            {children}
          </div>
        </TooltipTrigger>
        {isTruncated && (
          <TooltipContent className={tooltipClassName}>
            <p className="max-w-xs break-words">{children}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
// --- End TruncatedCell Component ---


// --- Main SupplierTable Component ---
function SupplierTable() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const supplierContext = useContext(SupplierContext);

  // Pagination state/logic (Consider fetching counts from API/Context)
  // const numberPageParam = Number(searchParams.get("page")) || 1;
  // ... (rest of pagination logic if needed)

  // --- Delete Supplier Function ---
  const deleteSupplier = async (id: string, companyName: string) => {
    const toastId = toast.loading(`Deleting ${companyName}...`);
    try {
      const fetchDeleteData = await fetch(`/api/deleteSupplier/${id}`, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" } // Basic headers
      });

      const res = await fetchDeleteData.json();

      if (!fetchDeleteData.ok || res.success === false) {
        toast.error(`Error: ${res?.message || 'Failed to delete.'}`, { id: toastId });
      } else if (res.success === true) {
        const newSupplierList = supplierContext?.supplier?.filter((item) => item._id !== id);
        if (newSupplierList && supplierContext?.setSupplier) {
          supplierContext.setSupplier(newSupplierList);
          toast.success(`${companyName} deleted.`, { id: toastId });
        } else {
          toast.error('Deleted, but failed to update list.', { id: toastId }); // Handle context update failure
        }
      }
    } catch (error) {
        console.error("Delete Supplier Error:", error);
        toast.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`, { id: toastId });
    }
  };

  // --- Map Supplier Data to Table Rows ---
  const rowsSupplier = supplierContext?.supplier?.map((supplier: AllSupplierResponse) => (
    <TableRow key={supplier._id} className="hover:bg-muted/50 transition-colors">

      {/* === Column 1: Company Name === */}
      <TableCell className="font-medium py-2 px-3">
         <TruncatedCell>{supplier.companyName}</TruncatedCell>
      </TableCell>

      {/* === Column 2: Contact Name === */}
      <TableCell className="py-2 px-3">
         <TruncatedCell>{`${supplier.firstName || ''} ${supplier.lastName || ''}`.trim() || "N/A"}</TruncatedCell>
      </TableCell>

      {/* === Column 3: Email (Hidden below md) === */}
      {/* Visibility class MUST match corresponding TableHead */}
      <TableCell className="py-2 px-3 hidden md:table-cell">
         <TruncatedCell>{supplier.email}</TruncatedCell>
      </TableCell>

      {/* === Column 4: Phone (Hidden below md) === */}
      {/* Visibility class MUST match corresponding TableHead */}
      <TableCell className="py-2 px-3 hidden md:table-cell">
         {supplier.phone || "N/A"}
      </TableCell>

      {/* === Column 5: City (Hidden below lg) === */}
      {/* Visibility class MUST match corresponding TableHead */}
      <TableCell className="py-2 px-3 hidden lg:table-cell">
         {supplier.city ? <Badge variant="secondary" className="whitespace-nowrap">{supplier.city}</Badge> : "N/A"}
      </TableCell>

       {/* === Column 6: Created At (Hidden below lg) === */}
       {/* Visibility class MUST match corresponding TableHead */}
      <TableCell className="py-2 px-3 hidden lg:table-cell text-sm text-muted-foreground whitespace-nowrap">
        {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : "N/A"}
      </TableCell>

      {/* === Column 7: Actions === */}
      <TableCell className="text-right py-1 px-2">
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button aria-haspopup="true" size="icon" variant="ghost">
               <MoreVertical className="h-4 w-4 text-foreground/70" />
               <span className="sr-only">Toggle menu</span>
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end">
              {/* View Details Link */}
              <DropdownMenuItem asChild>
                 <Link href={`/dashboard/supplier/${supplier._id}`} className="cursor-pointer flex items-center w-full">
                     <CalendarPlus className="mr-2 h-4 w-4" /> View Details
                 </Link>
              </DropdownMenuItem>
              {/* Edit Action */}
              <DropdownMenuItem  className="cursor-pointer">
              <Link href={`/dashboard/supplier/updateSupplier/${supplier._id}`}
               className="cursor-pointer flex items-center w-full">
                     Edit
                 </Link>
                  </DropdownMenuItem>
             
            
             {/* Delete Action */}
             <AlertDialog>
               <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-100/50 dark:focus:bg-red-900/30">
                     Delete
                  </DropdownMenuItem>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>
                     Delete {supplier.companyName || supplier.firstName || 'this supplier'}?
                   </AlertDialogTitle>
                   <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete the
                     supplier and remove their data.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction onClick={() => deleteSupplier(supplier._id, supplier.companyName || supplier.firstName || 'Supplier')} className="bg-red-600 hover:bg-red-700">
                      Continue
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           </DropdownMenuContent>
         </DropdownMenu>
      </TableCell>
    </TableRow>
  ));

  // --- Component Render ---
  return (
    // Remember to include <Toaster /> in your app's layout for react-hot-toast
    <div className="  ">
      <Card className="shadow-md border border-border"> {/* Use theme border */}
        <CardHeader className="pb-4 border-b border-border"> {/* Add border to header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* === Restored Title and Description === */}
            <div className="mb-2 sm:mb-0">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Suppliers Management
              </CardTitle>
              <CardDescription className="text-md md:text-lg pt-1 text-muted-foreground">
                Manage your suppliers and their information.
              </CardDescription>
            </div>
           
          </div>
        </CardHeader>
        <CardContent className="p-0"> {/* Remove padding from content to allow table full bleed */}
          {supplierContext?.supplier && supplierContext.supplier.length > 0 ? (
            <div className="relative overflow-x-auto"> {/* Removed border/rounding here, table has it */}
              <Table className="table-fixed w-full text-sm"> {/* Apply table-fixed and w-full */}
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/50 transition-colors">
                    {/* === Column Headers with Widths and Visibility === */}
                    {/* Widths guide the layout. Ensure visibility classes match cells below */}
                    <TableHead className="w-[25%] lg:w-[20%] px-3 h-11 font-semibold">Company</TableHead>
                    <TableHead className="w-[25%] lg:w-[20%] px-3 h-11 font-semibold">Contact</TableHead>
                    <TableHead className="w-[25%] lg:w-[20%] px-3 h-11 font-semibold hidden md:table-cell">Email</TableHead>
                    <TableHead className="w-[15%] lg:w-[12%] px-3 h-11 font-semibold hidden md:table-cell">Phone</TableHead>
                    <TableHead className="w-[10%] px-3 h-11 font-semibold hidden lg:table-cell">City</TableHead>
                    <TableHead className="w-[15%] lg:w-[12%] px-3 h-11 font-semibold hidden lg:table-cell">Created</TableHead>
                    <TableHead className="w-[8%] px-2 h-11 font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                {/* Using divide-y for clean row separation */}
                <TableBody className="divide-y divide-border">
                  {rowsSupplier}
                </TableBody>
              </Table>
            </div>
          ) : (
             // --- Empty State ---
            <div className="text-center p-10"> {/* Increased padding */}
              <Building className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Suppliers Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first supplier to see them listed here.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/supplier/createSupplier" passHref>
                  <Button>Add New Supplier</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
       
      </Card>
    </div>
  );
}

export default SupplierTable;



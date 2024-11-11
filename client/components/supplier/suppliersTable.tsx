"use client";
import React, { useEffect, useState ,useContext} from "react";
import { AllSupplierResponse } from "@/dataType/dataTypeSupplier/dataTypeSupplier";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateSupplier from "@/components/supplier/updateSupplier";

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
import { CalendarPlus, AlignRight, Users2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
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
import PaginationComponent from "@/components/user/Pagination";
import CounterUsers from "@/components/user/counterUsers";
import { toast } from "@/components/ui/use-toast";
import {SupplierContext}from "@/context/supplierContext"


function TableUser() {
  const searchParams = useSearchParams();
  const { push, replace } = useRouter();
  const supplierContext=useContext(SupplierContext)

  const numberPageParam = Number(searchParams.get("page")) || 1;
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  console.log(params, pathname);

  params.set("page", numberPageParam.toString());
  replace(`${pathname}?${params.toString()}`);
  const [numberProducts, setNumberProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  // const [countItems,setCountItems]=useState<number>()
  let startNumberProductInThePage = (numberPageParam - 1) * 10 + 1;
  let endNumberProductInThePage = Math.min(
    startNumberProductInThePage + 9,
    numberProducts
  );



  const deleteSupplier=async(id:string)=>{
    const fetchDeleteData=await fetch(  `/api/deleteSupplier/${id}`,{
      method:"Delete",
    headers: {    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*"}
   }  )
   const res =await fetchDeleteData.json()
   if (res.success == false) {
    toast({
      variant: "default",
      title: "Uh oh! Something went wrong.❌",
      description: res?.message,
    });

   }
   if (res.success == true) {
    const newSupplier = supplierContext?.supplier?.filter(
      (item: AllSupplierResponse) => item._id !== id
    );
    console.log(newSupplier);
    if (newSupplier) {
      supplierContext?.setSupplier(newSupplier);
      toast({
        variant: "default",
        title: "Congratulations✅.",
        description: res?.message,
      });

    }
  }
  }
  const rowsUser = supplierContext?.supplier?.map((supplier: AllSupplierResponse) => (
    <TableRow key={supplier._id} className="cursor-pointer ">
      <TableCell className=" w-[16.6%] border border-r-2 border-b-2  border-gray-800">
        <strong>{supplier.firstName.toLowerCase()}</strong>
      </TableCell>
      <TableCell className=" w-[20%] border-r-2 border-b-2 border-gray-800 ">
        {supplier.firstName.toLowerCase()}gmail.com
      </TableCell>
      <TableCell className="hidden md:table-cell w-[16.6%] border-r-2 border-b-2 border-gray-800">
        {supplier.email.toLowerCase()}
      </TableCell>
      <TableCell className="hidden md:table-cell w-[16.6%] border-r-2 border-b-2 border-gray-800">
        {supplier.phone}
      </TableCell>
      <TableCell className="hidden md:table-cell w-[12.4%] border-r-2 border-b-2 border-gray-800">
        <Badge className="bg-foreground/5 text-foreground/60 border-r-4">{supplier?.city}</Badge>
      </TableCell>
      <TableCell className=" w-[16.6%] border-r-1 border-b-2 border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <AlignRight className="text-foreground/50" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <button
            className="ml-2 hover:text-foreground hover:bg-foreground/10 p-2 rounded-sm text-orange-300"
            onClick={() => {
              push(`/dashboard/supplier/${supplier._id}`);
            }}
          >
            <CalendarPlus />
          </button>
          <DropdownMenuContent align="end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="m-0 p-0 outline-0 w-full bg-transparent text-foreground hover:bg-foreground/20">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] h-[95vh] bg-gradient">
                <DialogHeader>
                  <DialogTitle>Update Users</DialogTitle>
                </DialogHeader>
                <UpdateSupplier id={supplier._id}/>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="m-0 p-0 outline-0 w-full bg-transparent text-foreground hover:bg-foreground/20">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure ,Delete {supplier.firstName}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product and remove your data from your servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                     <Button onClick={() => deleteSupplier(supplier._id)}>
                              Continue
                            </Button> 
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="container ">
      <Table className="border  mb-5 shadow-lg bg-gradient ">
        <TableHeader className="bg-foreground/5">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Company Name</TableHead>
            <TableHead className="hidden md:table-cell">Phone Number</TableHead>
            <TableHead className="hidden md:table-cell">Address</TableHead>

            <TableHead>
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{rowsUser}</TableBody>
      </Table>
      <PaginationComponent pageNumber={1} />
      <CounterUsers startNumberProductInThePage={startNumberProductInThePage} />
    </div>
  );
}

export default TableUser;

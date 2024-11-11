"use client";
import React, { useEffect, useState ,useContext} from "react";
import { AllusersResponse } from "@/dataType/dataTypeUser/dataTypeUser";
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
import UpdateUser from "@/components/user/updateUser";

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
import {UserContext}from "@/context/userContext"


function TableUser() {
  const searchParams = useSearchParams();
  const { push, replace } = useRouter();
  const userContext=useContext(UserContext)

  const numberPageParam = Number(searchParams.get("page")) || 1;
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  console.log(params, pathname);

  params.set("page", numberPageParam.toString());
  replace(`${pathname}?${params.toString()}`);
  const [numberProducts, setNumberProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  let startNumberProductInThePage = (numberPageParam - 1) * 10 + 1;
  let endNumberProductInThePage = Math.min(
    startNumberProductInThePage + 9,
    numberProducts
  );


 
  const deleteProduct=async(id:string)=>{
    const fetchDeleteData=await fetch(  `/api/deleteUser/${id}`,{
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
    const newProducts = userContext?.users?.filter(
      (item: AllusersResponse) => item._id !== id
    );
    console.log(newProducts);
    if (newProducts) {
      userContext?.setUsers(newProducts);
      toast({
        variant: "default",
        title: "Congratulations✅.",
        description: res?.message,
      });

    }
  }
  }
  const rowsUser = userContext?.users?.map((user: AllusersResponse) => (
    <TableRow key={user._id} className="cursor-pointer ">
      <TableCell className=" w-[16.6%] border border-r-2 border-b-2  border-gray-800">
        <strong>{user.name.toLowerCase()}</strong>
      </TableCell>
      <TableCell className=" w-[20%] border-r-2 border-b-2 border-gray-800 ">
        {user.name.toLowerCase()}gmail.com
      </TableCell>
      <TableCell className="hidden md:table-cell w-[16.6%] border-r-2 border-b-2 border-gray-800">
        {user.userName.toLowerCase()}
      </TableCell>
      <TableCell className="hidden md:table-cell w-[16.6%] border-r-2 border-b-2 border-gray-800">
        +9635956558
      </TableCell>
      <TableCell className="hidden md:table-cell w-[12.4%] border-r-2 border-b-2 border-gray-800">
        <Badge className="bg-foreground/5 text-foreground/60 border-r-4">{user?.role}</Badge>
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
              push(`/dashboard/user/${user._id}`);
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
                <UpdateUser id={user._id}/>
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
                    Are you absolutely sure ,Delete {user.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product and remove your data from your servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                     <Button onClick={() => deleteProduct(user._id)}>
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
            <TableHead className="hidden md:table-cell">Role</TableHead>

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

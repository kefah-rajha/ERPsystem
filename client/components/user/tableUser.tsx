"use client";
import React, { useEffect, useState, useContext, useRef, ReactNode } from "react";
import { AllusersResponse } from "@/dataType/dataTypeUser/dataTypeUser";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast'; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
import {  Users2, Eye, Edit, Trash } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { UserContext } from "@/context/userContext";
import { cn } from "@/lib/utils";

// Enhanced user data type that includes all three schemas
interface EnhancedUser extends AllusersResponse {
  contactID?: {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postCode?: string;
  };
  companyID?: {
    nameCompany?: string;
    email?: string;
    phone?: string;
  };
}

// Props interface for TruncatedCell component
interface TruncatedCellProps {
  children: ReactNode;
  className?: string;
}

// TruncatedCell component for handling long text with tooltip
function TruncatedCell({ children, className = "" }: TruncatedCellProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        console.log(element.scrollWidth ,"element.scrollWidth ")
        setIsTruncated(element.scrollWidth  > element.clientWidth );
      }
    };
    
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [children]);
  
  if (!children || children === "N/A") {
    return <span className={className}>{children}</span>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div 
            ref={textRef}
            className={`truncate max-w-full ${className}`}
          >
            {children}
          </div>
        </TooltipTrigger>
        {isTruncated && (
          <TooltipContent>
            <p className="max-w-xs break-words">{children}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

function TableUser() {
  const { push } = useRouter();
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  // Format date for display
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    
    try {
      const fetchDeleteData = await fetch(`/api/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*"
        }
      });
      
      const res = await fetchDeleteData.json();
      
      if (res.success === false) {
        toast.error(res?.message || "Failed to delete user");
      } else {
        const newUsers = userContext?.users?.filter(
          (item: AllusersResponse) => item._id !== id
        );
        
        if (newUsers) {
          userContext?.setUsers(newUsers);
          toast.success(res?.message || "User deleted successfully");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const rowsUser = userContext?.users?.map((user: EnhancedUser) => (
    <TableRow key={user._id} className="cursor-pointer hover:bg-foreground/5">
      <TableCell className="font-medium max-w-[150px]">
        <TruncatedCell>
          {user.name || user.userName || "N/A"}
        </TruncatedCell>
      </TableCell>
      
      <TableCell className="max-w-[200px]">
        <TruncatedCell>
          {user.contactID?.email }
        </TruncatedCell>
      </TableCell>
      
     
      
      <TableCell className="hidden md:table-cell max-w-[120px]">
        <TruncatedCell>
          {user.contactID?.phone || "N/A"}
        </TruncatedCell>
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        <Badge 
          className={cn(
            "bg-foreground/5 border",
            user.role === "Admin" && "border-blue-500 text-blue-700",
            user.role === "Customer" && "border-green-500 text-green-700",
            user.role === "Manager" && "border-purple-500 text-purple-700"
          )}
        >
          {user.role || "Customer"}
        </Badge>
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        {formatDate(user.createdAt)} 
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-1">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => push(`/dashboard/user/${user._id}`)}
            title="View user details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Link href={`/dashboard/user/updateUser/${user._id}`} passHref>
            <Button size="icon" variant="ghost" title="Edit user">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" title="Delete user">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete user: {user.name || user.userName}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  the user and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button 
                    variant="destructive" 
                    onClick={() => deleteUser(user._id)}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="container mx-auto py-6 ">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">
                User Management
              </CardTitle>
              <CardDescription className="text-lg pt-1">
                Manage your users and their account information
              </CardDescription>
            </div>
            
          </div>
        </CardHeader>
        <CardContent>
          {userContext?.users && userContext.users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rowsUser}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8">
              <Users2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new user.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/user/createUser" passHref>
                  <Button>Add New User</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TableUser;
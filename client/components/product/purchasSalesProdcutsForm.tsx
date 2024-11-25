"use client"
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type purchasSalesProdcutsFormType ={
    form:any
}

function PurchasSalesProdcutsForm({form}:purchasSalesProdcutsFormType) {
  return (
    <Card x-chunk="dashboard-07-chunk-0">
    <CardHeader>
      <CardTitle>Product Details</CardTitle>
      <CardDescription>
        Lipsum dolor sit amet, consectetur adipiscing elit
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name" className="px-2">
            Supplier Name
          </Label>
          <FormField
            control={form.control}
            name="SupplierName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter your prompt here"
                    className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                  />
                </FormControl>
                <FormDescription />
        <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="name" className="px-2">
            Supplier Code
          </Label>
          <FormField
            control={form.control}
            name="supplierCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Supplier code"
                    className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                  />
                </FormControl>
                <FormDescription />
        <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="name" className="px-2">
            Sales code
          </Label>
          <FormField
            control={form.control}
            name="salesCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter Sales code"
                    className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="name" className="px-2">
            Purchase Code
          </Label>
          <FormField
            control={form.control}
            name="purchaseCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter the Purchase code"
                    className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default PurchasSalesProdcutsForm
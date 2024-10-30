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
type InventoryDetailsProduct ={
    form :any
}
function InventoryDetailsProduct({form}:InventoryDetailsProduct) {
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
            Track Inventory
          </Label>
          <FormField
            control={form.control}
            name="trackInventory"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    
                  >
                    <SelectTrigger
                      id="status"
                      aria-label="Select status"
                      className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                    >
                      <SelectValue placeholder= " Select Track Inventory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">
                        false
                      </SelectItem>
                      <SelectItem value="true">
                        true
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="name" className="px-2">
            Allow out of stock
          </Label>
          <FormField
            control={form.control}
            name="allowOutOfStock"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    
                  >
                    <SelectTrigger
                      id="status"
                      aria-label="Select status"
                      className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                    >
                      <SelectValue placeholder="Select Allow Out Of Stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">
                        false
                      </SelectItem>
                      <SelectItem value="true">
                        true
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default InventoryDetailsProduct
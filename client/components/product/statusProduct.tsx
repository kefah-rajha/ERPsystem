"use client";
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
import { Button } from "@/components/ui/button";
import { categoriesResopnseData } from "@/dataType/dataTypeCategory/dataTypeCategory";
type statusProductType={
    form:any

}

function StatusProduct({form}:statusProductType) {
  return (
    <Card x-chunk="dashboard-07-chunk-3">
                             <CardHeader>
                               <CardTitle>Product Status</CardTitle>
                         </CardHeader>
                             <CardContent>
                               <div className="grid gap-6">
                                 <div className="grid gap-3">
                                 
                                  <FormField
                                    control={form.control}
                                    name="Status"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Select onValueChange={field.onChange}>
                                            <SelectTrigger
                                              id="status"
                                              aria-label="Select status"
                                              className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                            >
                                              <SelectValue
                                                placeholder="Select status"
                                                className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="draft">
                                                Draft
                                              </SelectItem>
                                              <SelectItem value="published">
                                                Active
                                              </SelectItem>
                                              <SelectItem value="archived">
                                                Archived
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

export default StatusProduct
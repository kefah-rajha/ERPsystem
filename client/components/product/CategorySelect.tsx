"use client"
import React from 'react'
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
  import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type CategorySelectType = {
    form:any
}

function CategorySelect({form}:CategorySelectType) {
  return (
    <Card x-chunk="dashboard-07-chunk-2">
    <CardHeader>
      <CardTitle>Product Category</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="grid gap-3">
          <Label htmlFor="category" className="px-2">Category</Label>
          <FormField
            control={form.control}
            name="Category"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      id="status"
                      aria-label="Select status"
                      className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronic">
                        Electronic
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

export default CategorySelect
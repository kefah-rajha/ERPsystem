"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import CategorySelect from "@/components/product/CategorySelect";
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PurchasSalesProdcutsForm from "@/components/product/purchasSalesProdcutsForm";
import InventoryDetailsProduct from "@/components/product/inventoryDetailsProduct";
import StatusProduct from "@/components/product/statusProduct";
import { useRouter } from "next/navigation"
import { Description } from "@radix-ui/react-toast";
import PhotosProduct from "@/components/product/PhotosProduct";
const createProductFormSchema = z.object({
  name: z.string(),
  SKU: z.string(),
  brandName: z.string().optional(),
  productTag: z.string().optional(),
  price: z.string({ required_error: "error here" }).min(1, { message: "test" }),
  Discount: z.string().default("0"),
  SupplierName: z.string(),
  salesCode: z.string(),
  purchaseCode: z.string(),
  supplierCode: z.string(),
  stock: z.string(),
  trackInventory: z.enum(["false", "true"]),
  allowOutOfStock: z.enum(["false", "true"]),
  Description: z.string(),
  vat: z.string().min(0, {
    message: "VAT must be a positive number.",
  }),
   Status: z.enum(["archive", "published", "draft"]),
});
type productFormValues = z.infer<typeof createProductFormSchema>;
// eslint-disable-next-line react-hooks/rules-of-hooks
export default function CreateProducts() {
  type ImageData = string | ArrayBuffer | [];
  const [inputImages, setInputImages] = useState<ImageData[]>([]);
  const [dataProductCategories, setDataProductCategories] = useState([]);
  const [nameSKU, setNameSKU] = useState<string>("");
  const [dataMainCategory, setDataMainCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter()


  const form = useForm<productFormValues>({
    resolver: zodResolver(createProductFormSchema),
  });

  

  async function onSubmit(data: productFormValues) {
    setIsSubmitting(true);

    // Create a loading toast that we can dismiss later
    const loadingToastId = toast.loading('Creating product...');

    try {
      const IDsAllCategories: any[] = [];
      if (dataProductCategories.length > 0) {
        dataProductCategories.map((subCategory: any) => {
          IDsAllCategories.push(subCategory.id);
        });
      }
      IDsAllCategories.unshift(dataMainCategory);

      const allData = {
        ...data,
        photos: inputImages,
        categories: dataMainCategory,
        subCategories: IDsAllCategories
      };

      const FetchData = await fetch("/api/products/createProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(allData),
      });

      const res = await FetchData.json();

      if (!FetchData.ok) {
        throw new Error(res.message || "Failed to create product");
      }

      // Dismiss the loading toast and show success toast
      toast.dismiss(loadingToastId);
      toast.success('Product created successfully!', {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      });

      // Reset form after successful submission
      form.reset();
      setInputImages([]);
      setDataProductCategories([]);
      setDataMainCategory("");

    } catch (error) {
      console.error("Error creating product:", error);

      // Dismiss the loading toast and show error toast
      toast.dismiss(loadingToastId);
      toast.error(error instanceof Error ? error.message : "Failed to create product. Please try again.", {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#EF4444',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const changeDataProductCategories = (data: any) => {
    setDataProductCategories(data);
  };

  const changeDataProductCategory = (data: string) => {
    setDataMainCategory(data);
  };

  return (
    <div className="heighWithOutBar overflow-auto bg-gradient">
      {/* Add Toaster component for displaying toasts */}
      <Toaster
        position="top-right" // Or your preferred position
        reverseOrder={false} // Or your preferred order
        gutter={8} // Spacing
        toastOptions={{
          // Default options for all types
          className: 'card-gradient', // You can add common classes here
          duration: 5000, // Default duration
          style: {
            background: '#363636', // Default background (optional, if you want a base)
            color: '#fff',      // Default text color
          },


        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
          <div className="flex  w-full flex-col bg-background container">
            <div className="flex flex-col sm:gap-4 sm:py-4 p-0 w-full">
              <main className="grid    w-full  sm:py-0 md:gap-8">
                <div className="mx-auto grid max-w-full w-full flex-1 auto-rows-max gap-4">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7"
                      onClick={() => router.push("/dashboard/Products")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-[3rem] font-semibold tracking-tight sm:grow-0">
                      Create Product
                    </h1>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                      In stock
                    </Badge>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">

                      <Button size="sm" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Product"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-[#444746] text-2xl">
                    Create New Product For Save In Database
                  </p>
                  <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
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
                                Name
                              </Label>
                              <FormField
                                control={form.control}
                                name="name"
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
                                SKU
                              </Label>
                              <FormField
                                control={form.control}
                                name="SKU"
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
                                Stock
                              </Label>
                              <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
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
                                Price
                              </Label>
                              <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter the price"
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
                                TAX Percentage(%)
                              </Label>
                              <FormField
                                control={form.control}
                                name="vat"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter the Discount"
                                        className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="name" className="px-2">
                                Brand name
                              </Label>
                              <FormField
                                control={form.control}
                                name="brandName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter the Brand name"
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
                                Product Tag
                              </Label>
                              <FormField
                                control={form.control}
                                name="productTag"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter the Product tag"
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
                                Discount Percentage(%)
                              </Label>
                              <FormField
                                control={form.control}
                                name="Discount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter the Discount"
                                        className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid gap-3 ">
                              <Label htmlFor="description" className="px-2">
                                Description
                              </Label>
                              <FormField
                                control={form.control}
                                name="Description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        placeholder="Enter  Description here"
                                        className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                        rows={4}
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
                      <PurchasSalesProdcutsForm form={form} />
                      <InventoryDetailsProduct form={form} />

                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                      <StatusProduct form={form} />
                      <PhotosProduct />
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </form>
      </Form>
      <div className="container mb-4">
        <CategorySelect
          changeDataProductCategories={
            changeDataProductCategories
          }
          changeDataProductCategory={changeDataProductCategory}
        />
      </div>
    </div>
  );
}
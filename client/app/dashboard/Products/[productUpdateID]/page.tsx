"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import CategorySelectUpdate from "@/components/product/CategorySelectUpdate";
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
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PurchasSalesProdcutsForm from "@/components/product/purchasSalesProdcutsForm";
import InventoryDetailsProduct from "@/components/product/inventoryDetailsProduct";
import StatusProduct from "@/components/product/statusProduct";
import { useRouter } from "next/navigation";
import { Description } from "@radix-ui/react-toast";
import PhotosProduct from "@/components/product/PhotosProduct";

const createProductFormSchema = z.object({
  name: z.string(),
  SKU: z.string(),
  brandName: z.string().optional(),
  productTag: z.string().optional(),
  price: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "price cannot be less than 0.",
  }),
  Discount: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Discount cannot be less than 0.",
  }),
  SupplierName: z.string(),
  salesCode: z.string(),
  purchaseCode: z.string(),
  supplierCode: z.string(),
  stock: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Stock cannot be less than 0.",
  }),

  trackInventory: z.enum(["false", "true"]),
  allowOutOfStock: z.enum(["false", "true"]),
  Description: z.string(),
  vat: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "TAX cannot be less than 0.",
  }),
  Status: z.enum(["archive", "published", "draft"]),
});

type productFormValues = z.infer<typeof createProductFormSchema>;

export default function EditProducts() {
  type ImageData = string | ArrayBuffer | [];
  const [inputImages, setInputImages] = useState<ImageData[]>([]);
  const [dataProductCategories, setDataProductCategories] = useState([]);
  const [nameSKU, setNameSKU] = useState<string>("");
  const [dataMainCategory, setDataMainCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname?.split("/").pop();
  
  const [product, setProduct] = useState({
    name: "",
    SKU: "",
    brandName: "",
    productTag: "",
    price: "",
    Discount: "",
    SupplierName: "",
    salesCode: "",
    purchaseCode: "",
    supplierCode: "",
    allowOutOfStock: false,
    trackInventory: true,
    Description: "",
    stock: "",
    vat: "",
    Status: "published"
  });

  const form = useForm<productFormValues>({
    resolver: zodResolver(createProductFormSchema),
    
  });

  // Fetch product data
  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    
    fetch(`/api/products/getProduct/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData.product
            , "product data loaded");
          const productData = jsonData.product;
        
          // Update product state
          setProduct(productData);
          
          // Reset form with properly formatted values
          form.reset({
            name: productData.name || "",
            SKU: productData.SKU || "",
            brandName: productData.brandName || "",
            productTag: productData.productTag || "",
            price: String(productData.price || ""),
            Discount: String(productData.Discount || ""),
            SupplierName: productData.SupplierName || "",
            salesCode: productData.salesCode || "",
            purchaseCode: productData.purchaseCode || "",
            supplierCode: productData.supplierCode || "",
            allowOutOfStock: productData.allowOutOfStock === true ? "true" : "false",
            trackInventory: productData.trackInventory === false ? "false" : "true",
            Description: productData.Description || "",
            stock: String(productData.stock || "0"),
            vat: String(productData.vat || "0"),
            Status: productData.Status || "published"
          });
          console.log(jsonData.product.categories,"jsonData.product.categories")
          
          // If there are categories, set them
          if (jsonData.product.categories) {
            const mainCategory ={
              id:jsonData.product.categories._id,
              name:jsonData.product.categories.name
            }

            setDataMainCategory(mainCategory.id);
          }
          
          // If there are subcategories, set them
          if (jsonData.product.subCategories && jsonData.product.subCategories.length > 0) {
            const subCategoriesResponseUpdate:any[] =[]

            jsonData.product.subCategories.map((subCategory: any) => {
              subCategoriesResponseUpdate.push({id:subCategory._id,name:subCategory.name});
              
            })
            setDataProductCategories(subCategoriesResponseUpdate as any);

          }
          
          // If there are images, set them
          if (jsonData.product.photos && jsonData.product.photos.length > 0) {

            setInputImages(jsonData.product.photos);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product data");
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });
      
    return () => {
      ignore = true;
    };
  }, [id]);

  async function onSubmit(data: productFormValues) {
    setIsSubmitting(true);
    
    // Create a loading toast that we can dismiss later
    const loadingToastId = toast.loading('Updating product...');

    try {
      const IDsAllCategories: any[] = [];
      if (dataProductCategories.length > 0) {
        dataProductCategories.map((subCategory: any) => {
          IDsAllCategories.push(subCategory.id);
        });
      }
      
      if (dataMainCategory) {
        IDsAllCategories.unshift(dataMainCategory);
      }

      const allData = {
        ...data,
        photos: inputImages,
        categories: dataMainCategory,
        subCategories: IDsAllCategories
      };

      const FetchData = await fetch(`/api/products/updateProduct/${id}`, {
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
        throw new Error(res.message || "Failed to update product");
      }

      // Dismiss the loading toast and show success toast
      toast.dismiss(loadingToastId);
      toast.success('Product updated successfully!', {
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

    
    } catch (error) {
      console.error("Error updating product:", error);

      // Dismiss the loading toast and show error toast
      toast.dismiss(loadingToastId);
      toast.error(error instanceof Error ? error.message : "Failed to update product. Please try again.", {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-xl">Loading product data...</div>
      </div>
    );
  }

  return (
    <div className="heighWithOutBar overflow-auto bg-gradient">
      {/* Add Toaster component for displaying toasts */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: 'card-gradient',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
          <div className="flex w-full flex-col bg-background container">
            <div className="flex flex-col sm:gap-4 sm:py-4 p-0 w-full">
              <main className="grid w-full sm:py-0 md:gap-8">
                <div className="mx-auto grid max-w-full w-full flex-1 auto-rows-max gap-4">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => router.push("/dashboard/Products")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-[3rem] font-semibold tracking-tight sm:grow-0">
                      Update Product
                    </h1>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                      In stock
                    </Badge>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push("/dashboard/Products")}
                      >
                        Discard
                      </Button>
                      <Button size="sm" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Product"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-[#444746] text-2xl">
                    Update Product Information
                  </p>
                  <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>Product Details</CardTitle>
                          <CardDescription>
                            Update your product information
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
                                        placeholder="Enter product name"
                                        className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="SKU" className="px-2">
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
                                        placeholder="Enter SKU"
                                        className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid gap-3">
                              <Label htmlFor="stock" className="px-2">
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
                                        placeholder="Enter stock quantity"
                                        className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid gap-3">
                              <Label htmlFor="price" className="px-2">
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
                                        placeholder="Enter price"
                                        className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="vat" className="px-2">
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
                                        placeholder="Enter VAT percentage"
                                        className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="brandName" className="px-2">
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
                                        placeholder="Enter brand name"
                                        className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid gap-3">
                              <Label htmlFor="productTag" className="px-2">
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
                                        placeholder="Enter product tag"
                                        className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid gap-3">
                              <Label htmlFor="Discount" className="px-2">
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
                                        placeholder="Enter discount"
                                        className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="Description" className="px-2">
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
                                        placeholder="Enter description"
                                        className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                        rows={4}
                                      />
                                    </FormControl>
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
                      <PhotosProduct AllImage={setInputImages} />
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </form>
      </Form>
      <div className="container mb-4">
        <CategorySelectUpdate
        dataMainCategory={dataMainCategory}
          changeDataProductCategories={changeDataProductCategories}
          changeDataProductCategory={changeDataProductCategory}
          dataProductCategories={dataProductCategories}
        />
      </div>
    </div>
  );
}
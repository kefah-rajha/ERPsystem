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

const UNASSIGNED_UI_VALUE = "UNASSIGNED_SELECTION";
interface Warehouse {
  id: string;
  name: string;

}
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
  warehouse: z.string().min(1, { message: "Invalid warehouse ID." }),


  trackInventory: z.enum(["false", "true"]),
  allowOutOfStock: z.enum(["false", "true"]),
  Description: z.string(),
  vat: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "TAX cannot be less than 0.",
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
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [warehouseError, setWarehouseError] = useState<string | null>(null);

  const router = useRouter()

  console.log(inputImages, "inputImagesMainComponent")
  const form = useForm<productFormValues>({
    resolver: zodResolver(createProductFormSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = form;
  console.log(errors, "errors")


  const formDefaultValues: any = {
    name: '',
    SKU: '',
    brandName: '', // Optional strings can default to empty
    productTag: '',  // Optional strings can default to empty
    price: '',       // Empty string for numerical inputs initially
    Discount: '0',   // Use the Zod default value
    SupplierName: '',
    salesCode: '',
    purchaseCode: '',
    supplierCode: '',
    stock: '',       
    trackInventory: 'false',
    allowOutOfStock: 'false',
    Description: '',
    vat: '',         
    Status: 'published',
  };
  const clearForm = () => {
    // Reset the form using the SAME default values object
    form.reset(
      formDefaultValues,
      {
        // Keep these options to fully reset the form's state
        keepValues: false,
        keepDirtyValues: false,
        keepErrors: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      }
    );
    // console.log('Form cleared');
  };




  // useEffect to fetch warehouses
  useEffect(() => {
    let ignore = false;
    setLoadingWarehouses(true);
    setWarehouseError(null);

    fetch('/api/warehouse/getAllWarehouses')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch warehouses: ${res.status}`);
        }
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {

          const fetchedWarehouses = jsonData?.data; // Get the array

          if (Array.isArray(fetchedWarehouses)) {
            const simplifiedWarehouses: Warehouse[] = fetchedWarehouses.map(warehouse => ({
              id: warehouse._id, // Map _id to id
              name: warehouse.name, // Keep the name
              // Exclude other properties like features
            }));


            console.log(simplifiedWarehouses, "simplified warehouses fetched");
            setWarehouses(simplifiedWarehouses);
          } else {
            console.error("API did not return an array for warehouses:", jsonData);
            setWarehouseError("Unexpected data format from warehouse API");
            // Use react-hot-toast
            toast.error("Failed to load warehouse list due to data format");
          }

        }
      })
      .catch((err) => {
        console.error("Warehouse fetch error:", err);
        if (!ignore) {
          setWarehouseError("Failed to load warehouse list");
          // Use react-hot-toast
          toast.error("Failed to load warehouse list");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoadingWarehouses(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []); 






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
        subCategories: IDsAllCategories.filter(ct => ct !== dataMainCategory)
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
    console.log(data, "changeDataProductCategories")
    setDataProductCategories(data);
  };

  const changeDataProductCategory = (data: string) => {
    console.log(data, "changeDataProductCategory")
    setDataMainCategory(data);
  };

  return (
    <div className="heighWithOutBar overflow-auto bg-gradient">
      <Toaster
        position="top-right" 
        reverseOrder={false} 
        gutter={8} // Spacing
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
          <div className="flex  w-full flex-col bg-background container">
            <div className="flex flex-col sm:gap-4 sm:py-4 p-0 w-full">
              <main className="grid    w-full  sm:py-0 md:gap-8">
                <div className="mx-auto grid max-w-full w-full flex-1 auto-rows-max gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center  gap-4">
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
                    </div>
                    <div>
                      <div>
                        <div >
                          <Button size="sm" type="button" className="bg-red-400 text-white hover:bg-red-600 mr-2" disabled={isSubmitting}
                            onClick={clearForm} >

                            Reset Inputs
                          </Button>

                          <Button size="sm" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Product"}
                          </Button>

                        </div>

                      </div>

                    </div>

                  </div>
                  <p className="text-lg text-white/20 ml-2"> Create And Build New Product</p>
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

                            <FormField
                              control={form.control}
                              name="warehouse"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Warehouse</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={loadingWarehouses || warehouseError !== null}
                                  >
                                    <FormControl className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]">
                                      <SelectTrigger>
                                        <SelectValue placeholder={loadingWarehouses ? "Loading warehouses..." : warehouseError ? "Error loading warehouses" : "Select a warehouse (Optional)"} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem key="no-warehouse-option" value={"No warehouse selected"}>
                                        <span className="text-muted-foreground">No warehouse selected</span>
                                      </SelectItem>

                                      {loadingWarehouses && (
                                        <SelectItem value="loading" disabled>Loading warehouses...</SelectItem>
                                      )}
                                      {warehouseError && (
                                        <SelectItem value="error" disabled>Error loading: {warehouseError}</SelectItem>
                                      )}


                                      {!loadingWarehouses && warehouseError === null && (
                                        warehouses.map((warehouse) => (
                                          <SelectItem key={warehouse.id} value={warehouse.id}> 
                                            {warehouse.name}
                                          </SelectItem>
                                        ))
                                      )}

                                      {!loadingWarehouses && warehouseError === null && warehouses.length === 0 && (
                                        <div className="px-2 py-1 text-sm text-gray-500">No warehouses found</div>
                                      )}

                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
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
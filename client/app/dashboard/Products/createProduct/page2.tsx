// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";
// import CategorySelect from "@/components/product/CategorySelect";

// import { Badge } from "@/components/ui/badge";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from "@/components/ui/use-toast";

// import { Description } from "@radix-ui/react-toast";
// const createProductFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, {
//       message: "Name must be at least 2 characters.",
//     })
//     .max(30, {
//       message: "Name must not be longer than 30 characters.",
//     }),
//   SKU: z.string(),
//   brandName: z.string().optional(),
//   productTag: z.string().optional(),
//   price: z.string({ required_error: "error here" }).min(1, { message: "test" }),
//   Discount: z.string().default("0"),
//   SupplierName: z.string(),
//   salesCode: z.string(),
//   purchaseCode: z.string(),
//   supplierCode: z.string(),
//   trackInventory: z.enum(["false", "true"]),
//   allowOutOfStock: z.enum(["false", "true"]),
//   Category: z.string(),
//   Description: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
//   Status: z.enum(["archive", "published", "draft"]),
// });
// type productFormValues = z.infer<typeof createProductFormSchema>;
// // eslint-disable-next-line react-hooks/rules-of-hooks

// export default function Editproducts() {
//   type ImageData = string | ArrayBuffer | [];
//   const [inputImages, setInputImages] = useState<ImageData[]>([]);
//   const [nameSKU, setNameSKU] = useState<string>("");
//   const mainPhoto = useRef<HTMLImageElement>(null);
//   const firstMiniPhoto = useRef<HTMLImageElement>(null);
//   const secondMiniPhoto = useRef<HTMLImageElement>(null);
//   const th3MiniPhoto = useRef<HTMLImageElement>(null);
//   const [dataProductCategories, setDataProductCategories] = useState([]);
//   console.log(dataProductCategories, "dataProductCategories");

//   const form = useForm<productFormValues>({
//     resolver: zodResolver(createProductFormSchema),
//   });
//   async function onSubmit(data: productFormValues) {
//     console.log(data, "data");
//     console.log(inputImages);
//     const allData = { ...data, photos: inputImages };
//     console.log(allData, "alldata");
//     const FetchData = await fetch("/api/products/createProduct", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Methods": "*",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify(allData),
//     });
//     const res = await FetchData.json();

//     console.log(res);
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   }
//   const changeDataProductCategories = (data: any) => {
//     setDataProductCategories(data);
//   };
//   return (
//     <div className="heighWithOutBar overflow-auto bg-gradient">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
//           <div className="flex  w-full flex-col bg-background container">
//             <div className="flex flex-col sm:gap-4 sm:py-4 p-0 w-full">
//               <main className="grid    w-full  sm:py-0 md:gap-8">
//                 <div className="mx-auto grid max-w-full w-full flex-1 auto-rows-max gap-4">
//                   <div className="flex items-center gap-4">
//                     <Button variant="outline" size="icon" className="h-7 w-7">
//                       <ChevronLeft className="h-4 w-4" />
//                       <span className="sr-only">Back</span>
//                     </Button>
//                     <h1 className="flex-1 shrink-0 whitespace-nowrap text-[3rem] font-semibold tracking-tight sm:grow-0">
//                       Create Product
//                     </h1>
//                     <Badge variant="outline" className="ml-auto sm:ml-0">
//                       In stock
//                     </Badge>
//                     <div className="hidden items-center gap-2 md:ml-auto md:flex">
//                       <Button variant="outline" size="sm">
//                         Discard
//                       </Button>
//                       <Button size="sm">Save Product</Button>
//                     </div>
//                   </div>
//                   <p className="text-[#444746] text-2xl">
//                     Create New Product For Save In Database
//                   </p>
//                   <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
//                     <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
//                       <Card x-chunk="dashboard-07-chunk-0">
//                         <CardHeader>
//                           <CardTitle>Product Details</CardTitle>
//                           <CardDescription>
//                             Lipsum dolor sit amet, consectetur adipiscing elit
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid gap-6">
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Name
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="name"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="text"
//                                         onChange={(e) =>
//                                           setNameSKU(e.target.value)
//                                         }
//                                         placeholder="Enter your prompt here"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 SKU
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="SKU"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="text"
//                                         value={`${nameSKU}-${new Date().getDate()}-`}
//                                         placeholder="Enter your prompt here"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Price
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="price"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="number"
//                                         placeholder="Enter the price"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                     <FormDescription />
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Brand name
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="brandName"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="text"
//                                         placeholder="Enter the Brand name"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                     <FormDescription />
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Product Tag
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="productTag"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="text"
//                                         placeholder="Enter the Product tag"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                     <FormDescription />
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Discount Percentage(%)
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="Discount"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="number"
//                                         placeholder="Enter the Discount"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="grid gap-3 ">
//                               <Label htmlFor="description" className="px-2">
//                                 Description
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="Description"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Textarea
//                                         {...field}
//                                         placeholder="Enter  Description here"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                         rows={4}
//                                       />
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       <Card x-chunk="dashboard-07-chunk-0">
//                         <CardHeader>
//                           <CardTitle>Product Details</CardTitle>
//                           <CardDescription>
//                             Lipsum dolor sit amet, consectetur adipiscing elit
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid gap-6">
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Supplier Name
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="SupplierName"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="text"
//                                         placeholder="Enter your prompt here"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Supplier Code
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="supplierCode"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="text"
//                                         placeholder="Enter Supplier code"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Sales code
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="salesCode"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="number"
//                                         placeholder="Enter Sales code"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                     <FormDescription />
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Purchase Code
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="purchaseCode"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         type="text"
//                                         placeholder="Enter the Purchase code"
//                                         className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                       />
//                                     </FormControl>
//                                     <FormDescription />
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                       <Card x-chunk="dashboard-07-chunk-0">
//                         <CardHeader>
//                           <CardTitle>Product Details</CardTitle>
//                           <CardDescription>
//                             Lipsum dolor sit amet, consectetur adipiscing elit
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid gap-6">
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Track Inventory
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="trackInventory"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Select
//                                         onValueChange={field.onChange}
//                                         value="true"
//                                       >
//                                         <SelectTrigger
//                                           id="status"
//                                           aria-label="Select status"
//                                           className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                         >
//                                           <SelectValue placeholder="Track Inventory" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectItem value="false">
//                                             false
//                                           </SelectItem>
//                                           <SelectItem value="true">
//                                             true
//                                           </SelectItem>
//                                         </SelectContent>
//                                       </Select>
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                             <div className="grid gap-3">
//                               <Label htmlFor="name" className="px-2">
//                                 Allow out of stock
//                               </Label>
//                               <FormField
//                                 control={form.control}
//                                 name="allowOutOfStock"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormControl>
//                                       <Select
//                                         onValueChange={field.onChange}
//                                         value="false"
//                                       >
//                                         <SelectTrigger
//                                           id="status"
//                                           aria-label="Select status"
//                                           className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                         >
//                                           <SelectValue placeholder="Allow Out Of Stock" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectItem value="false">
//                                             false
//                                           </SelectItem>
//                                           <SelectItem value="true">
//                                             true
//                                           </SelectItem>
//                                         </SelectContent>
//                                       </Select>
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                       <Card x-chunk="dashboard-07-chunk-1">
//                         <CardHeader>
//                           <CardTitle>Stock</CardTitle>
//                           <CardDescription>
//                             Lipsum dolor sit amet, consectetur adipiscing elit
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                           <Table>
//                             <TableHeader>
//                               <TableRow>
//                                 <TableHead className="w-[100px]">SKU</TableHead>
//                                 <TableHead>Stock</TableHead>
//                                 <TableHead>Price</TableHead>
//                                 <TableHead className="w-[100px]">
//                                   Size
//                                 </TableHead>
//                               </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                               <TableRow>
//                                 <TableCell className="font-semibold">
//                                   GGPC-001
//                                 </TableCell>
//                                 <TableCell>
//                                   <Label htmlFor="stock-1" className="sr-only">
//                                     Stock
//                                   </Label>
//                                   <Input
//                                     id="stock-1"
//                                     type="number"
//                                     defaultValue="100"
//                                     className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                   />
//                                 </TableCell>
//                                 <TableCell>
//                                   <Label htmlFor="price-1" className="sr-only">
//                                     Price
//                                   </Label>
//                                   <Input
//                                     id="price-1"
//                                     type="number"
//                                     defaultValue="99.99"
//                                   />
//                                 </TableCell>
//                                 <TableCell>
//                                   <ToggleGroup
//                                     type="single"
//                                     defaultValue="s"
//                                     variant="outline"
//                                   >
//                                     <ToggleGroupItem value="s">
//                                       S
//                                     </ToggleGroupItem>
//                                     <ToggleGroupItem value="m">
//                                       M
//                                     </ToggleGroupItem>
//                                     <ToggleGroupItem value="l">
//                                       L
//                                     </ToggleGroupItem>
//                                   </ToggleGroup>
//                                 </TableCell>
//                               </TableRow>
//                               <TableRow>
//                                 <TableCell className="font-semibold">
//                                   GGPC-002
//                                 </TableCell>
//                                 <TableCell>
//                                   <Label htmlFor="stock-2" className="sr-only">
//                                     Stock
//                                   </Label>
//                                   <Input
//                                     id="stock-2"
//                                     type="number"
//                                     defaultValue="143"
//                                   />
//                                 </TableCell>
//                                 <TableCell>
//                                   <Label htmlFor="price-2" className="sr-only">
//                                     Price
//                                   </Label>
//                                   <Input
//                                     id="price-2"
//                                     type="number"
//                                     defaultValue="99.99"
//                                   />
//                                 </TableCell>
//                                 <TableCell>
//                                   <ToggleGroup
//                                     type="single"
//                                     defaultValue="m"
//                                     variant="outline"
//                                   >
//                                     <ToggleGroupItem value="s">
//                                       S
//                                     </ToggleGroupItem>
//                                     <ToggleGroupItem value="m">
//                                       M
//                                     </ToggleGroupItem>
//                                     <ToggleGroupItem value="l">
//                                       L
//                                     </ToggleGroupItem>
//                                   </ToggleGroup>
//                                 </TableCell>
//                               </TableRow>
//                               <TableRow>
//                                 <TableCell className="font-semibold">
//                                   GGPC-003
//                                 </TableCell>
//                                 <TableCell>
//                                   <Label htmlFor="stock-3" className="sr-only">
//                                     Stock
//                                   </Label>
//                                   <Input
//                                     id="stock-3"
//                                     type="number"
//                                     defaultValue="32"
//                                   />
//                                 </TableCell>
//                                 <TableCell>
//                                   <Label htmlFor="price-3" className="sr-only">
//                                     Stock
//                                   </Label>
//                                   <Input
//                                     id="price-3"
//                                     type="number"
//                                     defaultValue="99.99"
//                                   />
//                                 </TableCell>
//                                 <TableCell>
//                                   <ToggleGroup
//                                     type="single"
//                                     defaultValue="s"
//                                     variant="outline"
//                                   >
//                                     <ToggleGroupItem value="s">
//                                       S
//                                     </ToggleGroupItem>
//                                     <ToggleGroupItem value="m">
//                                       M
//                                     </ToggleGroupItem>
//                                     <ToggleGroupItem value="l">
//                                       L
//                                     </ToggleGroupItem>
//                                   </ToggleGroup>
//                                 </TableCell>
//                               </TableRow>
//                             </TableBody>
//                           </Table>
//                         </CardContent>
//                         <CardFooter className="justify-center border-t p-4">
//                           <Button size="sm" variant="ghost" className="gap-1">
//                             <PlusCircle className="h-3.5 w-3.5" />
//                             Add Variant
//                           </Button>
//                         </CardFooter>
//                       </Card>
//                       <CategorySelect
//                         form={form}
//                         changeDataProductCategories={
//                           changeDataProductCategories
//                         }
//                       />
//                     </div>
//                     <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
//                       <Card x-chunk="dashboard-07-chunk-3">
//                         <CardHeader>
//                           <CardTitle>Product Status</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid gap-6">
//                             <div className="grid gap-3">
//                               <Label htmlFor="status">Status</Label>
//                               <FormField
//                                 control={form.control}
//                                 name="Status"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Type</FormLabel>
//                                     <FormControl>
//                                       <Select onValueChange={field.onChange}>
//                                         <SelectTrigger
//                                           id="status"
//                                           aria-label="Select status"
//                                           className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                         >
//                                           <SelectValue
//                                             placeholder="Select status"
//                                             className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
//                                           />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                           <SelectItem value="draft">
//                                             Draft
//                                           </SelectItem>
//                                           <SelectItem value="published">
//                                             Active
//                                           </SelectItem>
//                                           <SelectItem value="archived">
//                                             Archived
//                                           </SelectItem>
//                                         </SelectContent>
//                                       </Select>
//                                     </FormControl>
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                       <Card
//                         className="overflow-hidden "
//                         x-chunk="dashboard-07-chunk-4"
//                       >
//                         <CardHeader>
//                           <CardTitle>Product Images</CardTitle>
//                           <CardDescription>
//                             Lipsum dolor sit amet, consectetur adipiscing elit
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid gap-2">
//                             <div className="w-full border relative  cursor-pointer h-72 rounded-sm">
//                               <PlusCircle className="h-10 w-6 m-3 text-foreground z-50" />
//                               <input
//                                 type="file"
//                                 // value={input}
//                                 onChange={(
//                                   event: React.ChangeEvent<HTMLInputElement>
//                                 ) => {
//                                   const photo = event?.target?.files
//                                     ? event?.target?.files[0]
//                                     : null;
//                                   if (photo !== null) {
//                                     const reader = new FileReader();
//                                     reader.readAsDataURL(photo);
//                                     reader.onloadend = () => {
//                                       setInputImages((prevImages) => {
//                                         if (
//                                           typeof reader.result === "string" ||
//                                           reader.result instanceof ArrayBuffer
//                                         ) {
//                                           return [...prevImages, reader.result]; // Only add if valid type
//                                         } else {
//                                           // Handle potential errors or ignore null results (optional)
//                                           return prevImages; // Or return prevImages to avoid unnecessary updates
//                                         }
//                                       });
//                                       console.log(typeof reader.result);
//                                       if (typeof reader.result == "string") {
//                                         mainPhoto?.current?.setAttribute(
//                                           "src",
//                                           reader.result
//                                         );
//                                       }
//                                       mainPhoto?.current?.classList.add(
//                                         "block"
//                                       );
//                                       mainPhoto?.current?.classList.remove(
//                                         "hidden"
//                                       );
//                                     };
//                                   }
//                                 }}
//                                 style={{ display: "none" }}
//                                 id="firstphotoSelect"
//                               />
//                               {/* eslint-disable-next-line @next/next/no-img-element */}
//                               <img
//                                 ref={mainPhoto}
//                                 alt="main product photo"
//                                 src=""
//                                 className="w-full h-full hidden absolute top-0 rounded-sm "
//                               />
//                               <label
//                                 htmlFor="firstphotoSelect"
//                                 className="absolute w-full h-full top-0 z-index bg-background/20 inputCustom cursor-pointer hover:bg-foreground/10 hover:text-foreground text-foreground/20 transition-colors  rounded-sm font-bold flex justify-center items-center"
//                               >
//                                 {" "}
//                                 Chose main photo
//                               </label>
//                             </div>
//                             {/* <Image
//                             alt="Product image"
//                             className="aspect-square w-full rounded-md object-cover"
//                             height="300"
//                             src="/placeholder.svg"
//                             width="300"
//                           /> */}
//                             <div className="grid grid-cols-3 gap-2">
//                               <div className="flex  relative aspect-square w-full items-center justify-center rounded-md border border-dashed">
//                                 <Upload className="h-4 w-4 text-muted-foreground" />
//                                 <input
//                                   type="file"
//                                   // value={input}
//                                   onChange={(
//                                     event: React.ChangeEvent<HTMLInputElement>
//                                   ) => {
//                                     const photo = event?.target?.files
//                                       ? event?.target?.files[0]
//                                       : null;
//                                     if (photo !== null) {
//                                       const reader = new FileReader();
//                                       reader.readAsDataURL(photo);
//                                       reader.onloadend = () => {
//                                         setInputImages((prevImages) => {
//                                           if (
//                                             typeof reader.result === "string" ||
//                                             reader.result instanceof ArrayBuffer
//                                           ) {
//                                             return [
//                                               ...prevImages,
//                                               reader.result,
//                                             ]; // Only add if valid type
//                                           } else {
//                                             // Handle potential errors or ignore null results (optional)
//                                             return prevImages; // Or return prevImages to avoid unnecessary updates
//                                           }
//                                         });
//                                         console.log(typeof reader.result);
//                                         if (typeof reader.result == "string") {
//                                           firstMiniPhoto?.current?.setAttribute(
//                                             "src",
//                                             reader.result
//                                           );
//                                           firstMiniPhoto?.current?.classList.add(
//                                             "block"
//                                           );
//                                           firstMiniPhoto?.current?.classList.remove(
//                                             "hidden"
//                                           );
//                                         }
//                                       };
//                                     }
//                                   }}
//                                   style={{ display: "none" }}
//                                   id="photoSelect"
//                                 />
//                                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                                 <img
//                                   ref={firstMiniPhoto}
//                                   alt="main product photo"
//                                   src=""
//                                   className="w-full h-full hidden absolute top-50 rounded-sm "
//                                 />
//                                 <label
//                                   htmlFor="photoSelect"
//                                   className="absolute w-full h-full top-0 z-index bg-background/20 cursor-pointer hover:bg-foreground/10 hover:text-foreground text-foreground/20 transition-colors  rounded-sm font-bold flex justify-center items-center"
//                                 ></label>
//                               </div>
//                               <div className="flex  relative aspect-square w-full items-center justify-center rounded-md border border-dashed">
//                                 <Upload className="h-4 w-4 text-muted-foreground" />
//                                 <input
//                                   type="file"
//                                   // value={input}
//                                   onChange={(
//                                     event: React.ChangeEvent<HTMLInputElement>
//                                   ) => {
//                                     const photo = event?.target?.files
//                                       ? event?.target?.files[0]
//                                       : null;
//                                     if (photo !== null) {
//                                       const reader = new FileReader();
//                                       reader.readAsDataURL(photo);
//                                       reader.onloadend = () => {
//                                         setInputImages((prevImages) => {
//                                           if (
//                                             typeof reader.result === "string" ||
//                                             reader.result instanceof ArrayBuffer
//                                           ) {
//                                             return [
//                                               ...prevImages,
//                                               reader.result,
//                                             ]; // Only add if valid type
//                                           } else {
//                                             // Handle potential errors or ignore null results (optional)
//                                             return prevImages; // Or return prevImages to avoid unnecessary updates
//                                           }
//                                         });
//                                         console.log(typeof reader.result);
//                                         if (typeof reader.result == "string") {
//                                           secondMiniPhoto?.current?.setAttribute(
//                                             "src",
//                                             reader.result
//                                           );
//                                           secondMiniPhoto?.current?.classList.add(
//                                             "block"
//                                           );
//                                           secondMiniPhoto?.current?.classList.remove(
//                                             "hidden"
//                                           );
//                                         }
//                                       };
//                                     }
//                                   }}
//                                   style={{ display: "none" }}
//                                   id="secondMiniPhotoSelect"
//                                 />
//                                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                                 <img
//                                   ref={secondMiniPhoto}
//                                   alt="main product photo"
//                                   src=""
//                                   className="w-full h-full hidden absolute top-50 rounded-sm "
//                                 />
//                                 <label
//                                   htmlFor="secondMiniPhotoSelect"
//                                   className="absolute w-full h-full top-0 z-index bg-background/20 cursor-pointer hover:bg-foreground/10 hover:text-foreground text-foreground/20 transition-colors  rounded-sm font-bold flex justify-center items-center"
//                                 ></label>
//                               </div>
//                               <div className="flex  relative aspect-square w-full items-center justify-center rounded-md border border-dashed">
//                                 <Upload className="h-4 w-4 text-muted-foreground" />
//                                 <input
//                                   type="file"
//                                   // value={input}
//                                   onChange={(
//                                     event: React.ChangeEvent<HTMLInputElement>
//                                   ) => {
//                                     const photo = event?.target?.files
//                                       ? event?.target?.files[0]
//                                       : null;
//                                     if (photo !== null) {
//                                       const reader = new FileReader();
//                                       reader.readAsDataURL(photo);
//                                       reader.onloadend = () => {
//                                         setInputImages((prevImages) => {
//                                           if (
//                                             typeof reader.result === "string" ||
//                                             reader.result instanceof ArrayBuffer
//                                           ) {
//                                             return [
//                                               ...prevImages,
//                                               reader.result,
//                                             ]; // Only add if valid type
//                                           } else {
//                                             // Handle potential errors or ignore null results (optional)
//                                             return prevImages; // Or return prevImages to avoid unnecessary updates
//                                           }
//                                         });
//                                         console.log(typeof reader.result);
//                                         if (typeof reader.result == "string") {
//                                           th3MiniPhoto?.current?.setAttribute(
//                                             "src",
//                                             reader.result
//                                           );
//                                           th3MiniPhoto?.current?.classList.add(
//                                             "block"
//                                           );
//                                           th3MiniPhoto?.current?.classList.remove(
//                                             "hidden"
//                                           );
//                                         }
//                                       };
//                                     }
//                                   }}
//                                   style={{ display: "none" }}
//                                   id="th3MiniPhotoSelect"
//                                 />
//                                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                                 <img
//                                   ref={th3MiniPhoto}
//                                   alt="main product photo"
//                                   src=""
//                                   className="w-full h-full hidden absolute top-50 rounded-sm "
//                                 />
//                                 <label
//                                   htmlFor="th3MiniPhotoSelect"
//                                   className="absolute w-full h-full top-0 z-index bg-background/20 cursor-pointer hover:bg-foreground/10 hover:text-foreground text-foreground/20 transition-colors  rounded-sm font-bold flex justify-center items-center"
//                                 ></label>
//                               </div>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-center gap-2 md:hidden">
//                     <Button variant="outline" size="sm">
//                       Discard
//                     </Button>
//                     <Button size="sm" type="submit">
//                       Save Product
//                     </Button>
//                   </div>
//                 </div>
//               </main>
//             </div>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }

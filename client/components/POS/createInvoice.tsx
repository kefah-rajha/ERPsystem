"use client";
import React, { useEffect, useMemo, useState, useContext } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productToInvoice } from "@/context/productPosContext";
import { Plus, RefreshCcw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  CalendarPlus,
  AlignRight,
  SquareArrowOutUpRight,
  Users2,
} from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
const createInvoiceFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  // price: z.string({required_error:"error here"}).min(1,{message:"test"}),
  // Discount: z.string().default("0"),
  // maxQuantity: z.string(),
  // minQuantity: z.string(),
  // Description: z.string().min(2, {
  //   message: "Name must be at least 2 characters.",
  // }),
  // Status: z.enum(["archive", "published", "draft"]),
  // Category:z.enum(['Electronic']),
  // subCategory:z.enum(['TV']),
});
type invoiceFormValues = z.infer<typeof createInvoiceFormSchema>;

function CreateInvoice() {
  const [tax, setTax] = useState<number>(0);
  const [coupon, setCoupon] = useState<string>("x");
  const [discount, setDiscount] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const ProductContext = useContext(productToInvoice);
  const products = ProductContext?.products;

  type ProductAttrubite = {
    id: number;
    name: string;
    price: string;
    Discount: string;
    Quantity: number;
    subTotal: string;
    photo: string;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  console.log(products);
  const total = useMemo(() => {
    return products?.reduce((totalNum, product) => {
      return totalNum + +product.price * +product.Quantity;
    }, 0);
  }, [products]);

  useEffect(() => {
    function totalPrice() {
      if (total) {
        const discountAmount = +total * (+discount / 100);
        console.log(total);
        const discountedPrice = +total - discountAmount;
        const taxAmount = discountedPrice * (tax / 100);
        const finalPrice = discountedPrice + taxAmount;

        const priceAfterCoupon = coupon != "" ? finalPrice : finalPrice;
        const priceAfterTax = priceAfterCoupon + shipping;

        setFinalPrice(+priceAfterTax);
      }
    }
    totalPrice();
  }, [total, tax, discount, shipping, coupon]);

  const form = useForm<invoiceFormValues>({
    resolver: zodResolver(createInvoiceFormSchema),
  });
  async function onSubmit(data: invoiceFormValues) {
    console.log(data);
  }

  const rowsProducts = products?.map((product: ProductAttrubite) => (
    <TableRow key={product.id} className="cursor-pointer">
      <TableCell>
        <Badge variant="outline">{product.name}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{product.price}</TableCell>

      <TableCell className="hidden md:table-cell">
        {+product.price * +product.Quantity}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {+product.Quantity}
      </TableCell>
      <TableCell className="hidden md:table-cell">v</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <AlignRight className="text-foreground/50" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {" "}
            <Button className="m-0 p-0 outline-0 w-full bg-transparent text-foreground hover:bg-foreground/20">
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="m-0 p-0 outline-0 w-full bg-transparent text-foreground hover:bg-foreground/20">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure ,Delete {product.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product and remove your data from your servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                    {" "}
                    <Button onClick={() => console.log(product.id)}>
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
    <div className="px-4">
      <h3 className="font-black text-2xl h-12 flex items-center border-b	border-[#312F2F]">
        Create Invoice
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 mb-4">
          <div className="flex gap-2">
            <div className="flex w-6/12 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className=" bg-[#595959] border-none h-8 rounded-r-none"
                        placeholder="Number The Invoice"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="bg-[#71D89A] h-8 rounded-r-sm	w-8 flex items-center justify-center">
                <RefreshCcw width={16} height={16} />
              </div>
            </div>
            <div className="flex w-6/12 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger
                          id="status"
                          aria-label="Select status"
                          className=" bg-[#595959] border-none h-8 rounded-r-none w-full text-[#A19D9D]"
                        >
                          <SelectValue placeholder="Payment Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronic">Cash</SelectItem>
                          <SelectItem value="Electronic">Paypal</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="bg-[#71D89A] h-8 rounded-r-sm	w-8 flex items-center justify-center">
                <Plus width={16} height={16} />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="flex w-6/12 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger
                          id="status"
                          aria-label="Select status"
                          className=" bg-[#595959] border-none h-8 rounded-r-none w-full text-[#A19D9D]"
                        >
                          <SelectValue placeholder="Select Customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronic">ali mdb</SelectItem>
                          <SelectItem value="Electronic">jak lil</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="bg-[#71D89A] h-8 rounded-r-sm	w-8 flex items-center justify-center">
                <Plus width={16} height={16} />
              </div>
            </div>
            <div className="flex w-6/12 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger
                          id="status"
                          aria-label="Select Inventory"
                          className=" bg-[#595959] border-none h-8 rounded-r-none w-full text-[#A19D9D]"
                        >
                          <SelectValue placeholder="Select Inventory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronic">Electronic</SelectItem>
                          <SelectItem value="Electronic">Furniture</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="bg-[#71D89A] h-8 rounded-r-sm	w-8 flex items-center justify-center">
                <Plus width={16} height={16} />
              </div>
            </div>
          </div>
        </form>
      </Form>
      <Table className="border">
        <TableHeader className="bg-foreground/5">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden md:table-cell">SubTotal</TableHead>
            <TableHead className="hidden md:table-cell">Quantity</TableHead>
            <TableHead className="hidden md:table-cell">More</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{rowsProducts}</TableBody>
      </Table>
      <div className="mt-4 flex flex-col gap-2">
        <div className=" bg-[#464646] h-12  rounded-sm flex  px-4 items-center w-full">
          <div className="flex items-center justify-start w-[33%] h-12 gap-2 ">
            <div className="flex items-center justify-start gap-1 w-1/2">
              <p>Items:</p>
            </div>
            <h3 className="font-bold text-[#888888]  w-1/2">2</h3>
          </div>
          <div className="flex items-center justify-start w-[33%] h-12 gap-2 ">
            <div className="flex items-center justify-start gap-1 w-1/2">
              <p>Total:</p>
            </div>
            <h3 className="font-bold text-[#888888]  w-1/2">{total}</h3>
          </div>
          <div className="flex items-center justify-start w-[33%] h-12 gap-2 ">
            <div className="flex items-center justify-start gap-1 w-1/2">
              <p>Tax:</p>

              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <SquareArrowOutUpRight
                      width={16}
                      height={16}
                      className="text-foreground cursor-pointer "
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-[#383838] flex gap-1 justify-start items-center">
                    <Input
                      type="number"
                      className="h-10"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTax(+e.target.value)
                      }
                      value={tax}
                    />
                    <p className="bg-foreground h-8 rounded-sm text-black w-8 flex justify-center items-center">
                      %
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <h3 className="font-bold text-[#888888]  w-1/2">{tax}%</h3>
          </div>
        </div>
        <div className=" bg-[#464646] h-12  rounded-sm flex  px-4 items-center w-full">
          <div className="flex items-center justify-start w-[33%] h-12 gap-2 ">
            <div className="flex items-center justify-start gap-1 w-1/2">
              <p>Coupon:</p>

              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <SquareArrowOutUpRight
                      width={16}
                      height={16}
                      className="text-foreground cursor-pointer "
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-[#383838] flex gap-1 justify-start items-center">
                    <Input
                      type="string"
                      className="h-10"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCoupon(e.target.value)
                      }
                      value={coupon}
                    />
                    {/* <p className="bg-foreground h-8 rounded-sm text-black w-8 flex justify-center items-center">
                      %
                    </p> */}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <h3 className="font-bold text-[#888888] text-center w-1/2">
              {coupon}
            </h3>
          </div>
          <div className="flex items-center justify-start w-[33%] h-12 gap-2 ">
            <div className="flex items-center justify-start gap-1 w-1/2">
              <p>Discount:</p>

              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <SquareArrowOutUpRight
                      width={16}
                      height={16}
                      className="text-foreground cursor-pointer "
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-[#383838] flex gap-1 justify-start items-center">
                    <Input
                      type="number"
                      className="h-10"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDiscount(+e.target.value)
                      }
                      value={discount}
                    />
                    <p className="bg-foreground h-8 rounded-sm text-black w-8 flex justify-center items-center">
                      %
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <h3 className="font-bold text-[#888888] text-center w-1/2">
              {discount}%
            </h3>
          </div>

          <div className="flex items-center justify-start w-[33%] h-12 gap-2 ">
            <div className="flex items-center justify-start gap-1 w-1/2">
              <p>Shipping:</p>

              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <SquareArrowOutUpRight
                      width={16}
                      height={16}
                      className="text-foreground cursor-pointer "
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-[#383838] flex gap-1 justify-start items-center">
                    <Input
                      type="number"
                      className="h-10"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setShipping(+e.target.value)
                      }
                      value={shipping}
                    />
                    <p className="bg-foreground h-8 rounded-sm text-black w-8 flex justify-center items-center">
                      $
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <h3 className="font-bold text-[#888888]  text-center w-1/2">
              {shipping}$
            </h3>
          </div>
        </div>
        <div>
          <h3 className="mt-4 text-2xl ">
            Total: <strong>{finalPrice}</strong>{" "}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default CreateInvoice;

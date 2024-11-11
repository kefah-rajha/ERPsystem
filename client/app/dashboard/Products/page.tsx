"use client";
import Image from "next/image";
import Link from "next/link";
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
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import getAllProduct from "@/lib/ProductFetch/getAllProduct";

import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { deleteProductServer } from "@/lib/ProductFetch/deleteProduct";
import PaginationComponent from "@/components/product/Pagination";
import getNumberProductsServer from "@/lib/ProductFetch/getNumberProducts";
export default function Products() {
  const searchParams = useSearchParams();
  const numberPageParam = Number(searchParams.get("page")) || 1;
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  console.log(params, pathname);

  const { replace, push } = useRouter();
  params.set("page", numberPageParam.toString());
  replace(`${pathname}?${params.toString()}`);
  interface ProductAttrubite {
    _id: any;
    name: string;
    SKU: string;
    brandName: string;
    productTag: string;
    price: string;
    Discount: string;
    SupplierName:string;
    salesCode: string;
    purchaseCode: string;
    supplierCode: string;
    trackInventory: boolean;
    allowOutOfStock: boolean;
    Description:string;
  }
  const [products, setProducts] = useState<
    [ProductAttrubite] | undefined | ProductAttrubite[]
  >([]);
  const [numberProducts, setNumberProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  // const [countItems,setCountItems]=useState<number>()
  let startNumberProductInThePage = (numberPageParam - 1) * 10 + 1;
  let endNumberProductInThePage = Math.min(
    startNumberProductInThePage + 9,
    numberProducts
  );

  useEffect(() => {
    const getData = async (numberPageParam: number) => {
      console.log(numberPageParam)
      const resProducts = await getAllProduct(numberPageParam);
      console.log(resProducts);
      if (resProducts) {
        setProducts(resProducts);
      }
    };
    getData(numberPageParam);
  }, [numberPageParam]);
  useEffect(() => {
    const getNumberProducts = async () => {
      const resNumberProduct = await getNumberProductsServer();
      console.log(resNumberProduct, "resproduct");
      if (resNumberProduct?.count) {
        setNumberProducts(resNumberProduct.count);
        const totalPages = Math.ceil(resNumberProduct.count / 10);
        setCountPages(totalPages);
        console.log(totalPages);
      }
    };
    getNumberProducts();
  }, []);

  const deleteProduct = async (id: any) => {
    const res = await deleteProductServer(id);
    console.log(res.ID);
    if (res.ID) {
      const newProducts = products?.filter(
        (item: ProductAttrubite) => item._id !== res?.ID
      );
      console.log(newProducts);
      if (newProducts) {
        setProducts(newProducts);
      }
    }
  };
  const rowsProducts = products?.map((product: ProductAttrubite) => (
    <TableRow key={product._id} className="cursor-pointer">
      <TableCell className="hidden sm:table-cell">
        <div className="h-[56px] w-[56px]  relative flex items-start justify-center">
          <div className="bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[54px] h-[54px]  rounded-full border-2 border-background"></div>
          {/* <Image
            alt="Product image"
            className="aspect-square rounded-full object-cover border border-foreground  "
            height="56"
            src={product.photos[0]}
            width="56"
          /> */}
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <strong>{product.name.toUpperCase()}</strong>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{product.price}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{product.price}</TableCell>
      <TableCell className="hidden md:table-cell">25</TableCell>
      <TableCell className="hidden md:table-cell">
        2023-07-12 10:42 AM
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <AlignRight className="text-foreground/50" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <button
            className="ml-2 hover:text-foreground hover:bg-foreground/10 p-2 rounded-sm text-orange-300"
            onClick={() => {
              console.log("i am clicking")
              push(`/dashboard/Products/showProduct/${product._id}`);
            }}
          >
            <CalendarPlus />
          </button>
          <DropdownMenuContent align="end">
            <Link href={`/dashboard/Products/${product._id}`}>
              {" "}
              <Button className="m-0 p-0 outline-0 w-full bg-transparent text-foreground hover:bg-foreground/20">
                Edit
              </Button>
            </Link>

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
                    <Button onClick={() => deleteProduct(product._id)}>
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
    <div className="flex min-h-screen w-full flex-col bg-background relative">

      <div >
        
      </div>
      <div className="flex flex-col sm:gap-4 sm:py-4 container ">
        <main className="grid flex-1 items-start gap-4    sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center  pt-4">
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button
                  size="default"
                  className="h-8 gap-1  bg-background border border-background hover:border-white  transition-colors  cursor-pointer"
                >
                  <PlusCircle className="h-5 w-3.5 text-white" />
                  <span
                    className={cn(
                      "sr-only sm:not-sr-only sm:whitespace-nowrap  Justglow text-foreground"
                    )}
                  >
                    Add Product
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0" className="shadow-md">
                <CardHeader>
                  <CardTitle className={cn("font-bold text-[3rem]")}>
                    Products
                  </CardTitle>
                  <CardDescription className="text-[#444746] text-xl">
                    Manage your products and view their sales performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="border">
                    <TableHeader className="bg-foreground/5">
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell ">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Price
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Total Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created at
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{rowsProducts}</TableBody>
                  </Table>
                </CardContent>
                <PaginationComponent pageNumber={countPages} />

                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>{startNumberProductInThePage}</strong>-
                    <strong>{endNumberProductInThePage}</strong> of{" "}
                    <strong>{numberProducts}</strong> products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

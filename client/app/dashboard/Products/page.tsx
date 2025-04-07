"use client";
import Image from "next/image";
import Link from "next/link";
import { PaginationControls } from "@/components/SalesOrder/showAllSalesOrder/pagination-controls";
import CategoryList from '@/components/POSerp/CategoryList';

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
import ProductFilter from "@/components/product/productFilter"
import { Badge } from "@/components/ui/badge";
import { categoriesResopnseData } from "@/dataType/dataTypeCategory/dataTypeCategory";

import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Boxes } from 'lucide-react';

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
import { useCallback, useEffect, useMemo, useState } from "react";

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
  interface ProductAttribute {
    _id: any;
    name: string;
    SKU: string;
    brandName: string;
    stock: string;
    productTag: string;
    price: number;
    Discount: string;
    SupplierName: string;
    salesCode: string;
    purchaseCode: string;
    supplierCode: string;
    trackInventory: boolean;
    allowOutOfStock: boolean;
    Description: string;
  }
  const [products, setProducts] = useState<
    [ProductAttribute] | undefined | ProductAttribute[]
  >([]);
  const handleSetProducts = useCallback((newProducts: ProductAttribute[]) => {
    setProducts(newProducts);
  }, [setProducts]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [numberProducts, setNumberProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<categoriesResopnseData[]>([]);
  console.log(selectedCategory,"selectedCategory")
  const router=useRouter()

  // const [countItems,setCountItems]=useState<number>()
  useEffect(() => {
    let ignore = false;
    fetch("/api/category/getAllCategories")
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData, "getCategories");

          setCategories(jsonData.data);
        }
      })
      .catch((err: unknown) => {
        console.log(err);
      })
      .finally(() => {
        if (!ignore) {
          console.log("noLoding");
        }
      });
    return () => {
      ignore = true;
    };
  }, []);









  useEffect(() => {
    const getNumberProducts = async () => {
      const resNumberProduct = await getNumberProductsServer();
      console.log(resNumberProduct, "resproduct");
      if (resNumberProduct?.data) {
        setNumberProducts(resNumberProduct.data);
        console.log(resNumberProduct, "resNumberProduct.count")
        const totalPages = Math.ceil(resNumberProduct.data / pageSize);
        console.log(totalPages, pageSize, "totalPages1111");
        setCountPages(totalPages);

      }
    };
    getNumberProducts();
  }, [pageSize]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const deleteProduct = async (id: any) => {
    const res = await deleteProductServer(id);
    console.log(res.ID);
    if (res.ID) {
      const newProducts = products?.filter(
        (item: ProductAttribute) => item._id !== res?.ID
      );
      console.log(newProducts);
      if (newProducts) {
        setProducts(newProducts);
      }
    }
  };


  const rowsProducts = products?.map((product: ProductAttribute) => (
    <TableRow key={product._id} className="cursor-pointer">
      <TableCell className="hidden sm:table-cell">
        <div className="h-[56px] w-[56px] relative flex items-start justify-center">
          <div className="bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[54px] h-[54px] rounded-full border-2 border-background"></div>
          {/* Image placeholder maintained from original */}
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <strong>{product.name.toUpperCase()}</strong>
        <div className="text-xs text-muted-foreground">SKU: {product.SKU}</div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">${product.price}</Badge>
        {product.Discount && (
          <div className="text-xs text-muted-foreground mt-1">Discount: {product.Discount}%</div>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-col">
          <span className="font-bold">{product.stock}</span>
          {product.trackInventory && <Badge variant="secondary" className="mt-1 text-xs">Tracked</Badge>}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="text-sm">
          {product.brandName}
          {product.SupplierName && (
            <div className="text-xs text-muted-foreground">Supplier: {product.SupplierName}</div>
          )}
        </div>
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
              console.log("i am clicking");
              push(`/dashboard/Products/showProduct/${product._id}`);
            }}
          >
            <CalendarPlus />
          </button>
          <DropdownMenuContent align="end">
            <Link href={`/dashboard/Products/${product._id}`}>
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
                    Are you absolutely sure, Delete {product.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product and remove your data from your servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
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
    <div className="flex  w-full flex-col container heighWithOutBar overflow-auto relative">

      <div>
      </div>
      <div className="flex flex-col sm:gap-4 sm:py-4 container ">
        <main className="grid flex-1 items-start gap-4    sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center  pt-4">
              <div className="ml-auto flex items-center gap-2">



                <ProductFilter pageNumber={currentPage} pageSize={pageSize} setProducts={handleSetProducts} selectedCategory={selectedCategory}
                />


                <Button className='h-10 rounded-sm   text-foreground card-gradient  hover:text-gray-400 '
                onClick={() => router.push('/dashboard/Products/createProduct')}>
                  <Boxes className='h-4 w-4 mr-2 text-green-300 ' />
                  Create Product</Button>
              </div>
            </div>
            <Card className="mt-2 pt-4">
              <CardContent>
                <CategoryList
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </CardContent>

            </Card>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0" className="shadow-md py-4">
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
                        <TableHead>Price</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Stock
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Brand
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Action
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{rowsProducts}</TableBody>
                  </Table>
                </CardContent>


              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Card className="sticky bottom-0  ">
        <CardContent className="pt-6 pb-6 px-6">

          <PaginationControls
            numberProducts={numberProducts}
            countPages={countPages}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />

        </CardContent>
      </Card>
    </div>
  );
}

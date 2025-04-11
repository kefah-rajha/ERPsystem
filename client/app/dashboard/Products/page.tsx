"use client";
import Image from "next/image";
import Link from "next/link";
import { PaginationControls } from "@/components/SalesOrder/showAllSalesOrder/pagination-controls";
import CategoryList from '@/components/POSerp/CategoryList';
import toast, { Toaster } from 'react-hot-toast'; // Import toast library

// Import UI icons from lucide-react
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
import { categoriesResponseData } from "@/dataType/dataTypeCategory/dataTypeCategory";

import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Boxes, Layers } from 'lucide-react';

// Import UI component definitions
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
import getNumberProductsServer from "@/lib/ProductFetch/getNumberProducts";
import CollapsibleCard from "@/components/SalesOrder/showAllSalesOrder/CollapsibleCard";

export default function Products() {
  // Extract URL query parameters for pagination
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();

  // Next.js router for navigation
  const { replace, push } = useRouter();



  // Define TypeScript interface for product data structure
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

  // State management for products list
  const [products, setProducts] = useState<
    [ProductAttribute] | undefined | ProductAttribute[]
  >([]);

  // Memoized callback for setting products to prevent unnecessary re-renders
  const handleSetProducts = useCallback((newProducts: ProductAttribute[]) => {
    setProducts(newProducts);
  }, [setProducts]);

  // State for loading, error handling, and pagination
  const [loading, setLoading] = useState<boolean>(true); // Tracks data loading state
  const [error, setError] = useState<string | null>(null); // Stores error messages
  const [numberProducts, setNumberProducts] = useState<number>(0); // Total count of products
  const [countPages, setCountPages] = useState<number>(1); // Total number of pages
  const [currentPage, setCurrentPage] = useState(1); // Current active page
  const [pageSize, setPageSize] = useState(10); // Number of items per page
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Selected category filter
  const [categories, setCategories] = useState<categoriesResponseData[]>([]); // Available categories
  const [isExpanded, setIsExpanded] = useState(false);

  console.log(selectedCategory, "selectedCategory")
  const router = useRouter()



  // Fetch all product categories on component mount
  useEffect(() => {
    let ignore = false; // Flag to prevent state updates if component unmounts
    setLoading(true);

    fetch("/api/category/getAllCategories")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) { // Only update state if component is still mounted
          console.log(jsonData, "getCategories");
          setCategories(jsonData.data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        console.log(err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        // Show error toast
        toast.error(`Failed to load categories: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      });

    // Cleanup function to prevent memory leaks
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch total number of products to calculate pagination
  useEffect(() => {
    const getNumberProducts = async () => {
      try {
        setLoading(true);
        const resNumberProduct = await getNumberProductsServer();
        console.log(resNumberProduct, "resproduct");

        if (resNumberProduct?.data) {
          setNumberProducts(resNumberProduct.data); // Set total product count
          console.log(resNumberProduct, "resNumberProduct.count")

          // Calculate total pages based on product count and page size
          const totalPages = Math.ceil(resNumberProduct.data / pageSize);
          console.log(totalPages, pageSize, "totalPages1111");
          setCountPages(totalPages);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product count:", err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        // Show error toast
        toast.error(`Failed to load product count: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    getNumberProducts();
  }, [pageSize]); // Re-run when page size changes

  // Handler for page change in pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);


    // Show loading toast for better UX
    toast.loading('Loading products...', { id: 'pageChange' });

    // This will be cancelled by the useEffect in ProductFilter component
    setTimeout(() => {
      toast.dismiss('pageChange');
    }, 2000);
  };

  // Handler for changing number of products per page
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size


    toast.success(`Showing ${size} items per page`);
  };

  // Function to delete a product by ID
  const deleteProduct = async (id: any) => {
    try {
      // Show loading toast
      toast.loading('Deleting product...', { id: 'deleteProduct' });

      const res = await deleteProductServer(id);
      console.log(res.ID);

      if (res.ID) {
        // Filter out the deleted product from the products list
        const newProducts = products?.filter(
          (item: ProductAttribute) => item._id !== res?.ID
        );
        console.log(newProducts);

        if (newProducts) {
          setProducts(newProducts); // Update state with filtered products

          // Show success toast
          toast.success('Product deleted successfully', { id: 'deleteProduct' });

          // If we've deleted the last item on a page, go to previous page
          if (newProducts.length === 0 && currentPage > 1) {
            handlePageChange(currentPage - 1);
          }
        }
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      // Show error toast
      toast.error(`Error deleting product: ${err instanceof Error ? err.message : 'Unknown error'}`, { id: 'deleteProduct' });
    }
  };

  // Generate table rows for each product
  const rowsProducts = products?.map((product: ProductAttribute) => (
    <TableRow key={product._id} className="cursor-pointer">
      {/* Image column (hidden on small screens) */}
      <TableCell className="hidden sm:table-cell">
        <div className="h-[56px] w-[56px] relative flex items-start justify-center">
          <div className="bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[54px] h-[54px] rounded-full border-2 border-background"></div>
          {/* Image placeholder maintained from original */}
        </div>
      </TableCell>

      {/* Product name and SKU */}
      <TableCell className="font-medium">
        <strong>{product.name.toUpperCase()}</strong>
        <div className="text-xs text-muted-foreground">SKU: {product.SKU}</div>
      </TableCell>

      {/* Price and discount information */}
      <TableCell>
        <Badge variant="outline">${product.price}</Badge>
        {product.Discount && (
          <div className="text-xs text-muted-foreground mt-1">Discount: {product.Discount}%</div>
        )}
      </TableCell>

      {/* Stock information (hidden on mobile) */}
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-col">
          <span className="font-bold">{product.stock}</span>
          {product.trackInventory && <Badge variant="secondary" className="mt-1 text-xs">Tracked</Badge>}
        </div>
      </TableCell>

      {/* Brand and supplier info (hidden on mobile) */}
      <TableCell className="hidden md:table-cell">
        <div className="text-sm">
          {product.brandName}
          {product.SupplierName && (
            <div className="text-xs text-muted-foreground">Supplier: {product.SupplierName}</div>
          )}
        </div>
      </TableCell>

      {/* Action buttons for each product */}
      <TableCell>
        <DropdownMenu>
          {/* Dropdown trigger button */}
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <AlignRight className="text-foreground/50" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>

          {/* Quick view button */}
          <button
            className="ml-2 hover:text-foreground hover:bg-foreground/10 p-2 rounded-sm text-orange-300"
            onClick={() => {
              console.log("i am clicking");
              push(`/dashboard/Products/showProduct/${product._id}`);
            }}
          >
            <CalendarPlus />
          </button>

          {/* Dropdown menu with actions */}
          <DropdownMenuContent align="end">
            {/* Edit product link */}
            <Link href={`/dashboard/Products/${product._id}`}
              onClick={() => toast.loading('Loading edit form...', { id: 'editProduct' })}>
              <Button className="m-0 p-0 outline-0 w-full bg-transparent text-foreground hover:bg-foreground/20">
                Edit
              </Button>
            </Link>

            {/* Delete product with confirmation dialog */}
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

  // Loading skeleton for products table when data is being fetched
  const loadingSkeleton = (
    <TableRow>
      <TableCell colSpan={6} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-6 w-24 animate-pulse rounded bg-foreground/10 mb-2"></div>
          <div className="text-sm text-muted-foreground">Loading products...</div>
        </div>
      </TableCell>
    </TableRow>
  );

  // Message to display when no products are found
  const noProductsMessage = (
    <TableRow>
      <TableCell colSpan={6} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <Package2 className="h-8 w-8 text-muted-foreground mb-2" />
          <div className="text-sm text-muted-foreground">No products found</div>
          {selectedCategory && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setSelectedCategory(null)}
            >
              Clear category filter
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="flex w-full flex-col container heighWithOutBar  bg-gradient overflow-auto relative">
      {/* Toast container for notifications */}
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

      <div>
        {/* Error message banner if there's an error */}
        {error && (
          <div className="bg-red-700 border  text-white mt-2 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 h-full flex items-center">
              <Button
                variant="default"
                size="sm"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:gap-4 sm:py-4 container ">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          {/* Tabs container with "all" as default selected tab */}
          <Tabs defaultValue="all">
            <div className="flex items-center pt-4">
              <div className="ml-auto flex items-center gap-2">
                {/* Product filter component that manages product filtering */}

                <ProductFilter
                  pageNumber={currentPage}
                  pageSize={pageSize}
                  setProducts={handleSetProducts}
                  selectedCategory={selectedCategory}

                />
                <Button
                  variant="outline"
                  className=" h-10 card-gradient  hover:text-gray-400"
                  onClick={() => push("/dashboard/Products/Categories")}
                >
                  <Layers className="h-4 w-4 mr-2 text-green-300 " />
                  Create Categories
                </Button>

                {/* Create product button with icon */}
                <Button
                  className='h-10 rounded-sm text-foreground card-gradient hover:text-gray-400'
                  onClick={() => {
                    toast.loading('Loading create form...', { id: 'createProduct' });
                    router.push('/dashboard/Products/createProduct');
                  }}
                >
                  <Boxes className='h-4 w-4 mr-2 text-green-300' />
                  Create Product
                </Button>
              </div>
            </div>

            {/* Category filter section */}
            <Card className="mt-2 pt-4">
              <CardContent>
                <CategoryList
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(category) => {
                    setSelectedCategory(category);
                    if (category) {
                      toast.success(`Filtered by: ${categories.find(c => c._id === category)?.name || category}`);
                    } else {
                      toast.success('All categories shown');
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Main content tab */}
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

                {/* Products table */}
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
                    {/* Display generated product rows or loading skeleton */}
                    <TableBody>
                      {loading ? (
                        loadingSkeleton
                      ) : products && products.length > 0 ? (
                        rowsProducts
                      ) : (
                        noProductsMessage
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Pagination controls in a sticky card at the bottom */}
      <Card className={cn(!isExpanded ? "sticky bottom-0 w-fit" : "sticky bottom-0 w-full")} >
        <CardContent className="pt-6 pb-6 px-6">
          <CollapsibleCard
            numberProducts={numberProducts}
            currentPage={currentPage}
            countPages={countPages}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}

          >
            <PaginationControls
              numberProducts={numberProducts}
              countPages={countPages}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            // disabled={loading}
            />
          </CollapsibleCard>
        </CardContent>
      </Card>
    </div>
  );
}
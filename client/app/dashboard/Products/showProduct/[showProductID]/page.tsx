"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge"; 
import {
  Boxes,
  Pencil,
  ShoppingCart,
  Tag,
  Package,
  Info,
  Clipboard,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

/**
 * Product interface that matches the database schema
 */
interface categoryType {
  name:string;
  slug:string;
  parent:string;
  children:string;
  mainCategory:boolean
  
      
  }
interface Product {
  _id: string;
  name: string;
  SKU: string;
  brandName: string;
  productTag: string;
  price: number;
  Discount: string;
  stock: string;
  SupplierName: string;
  salesCode: string;
  purchaseCode: string;
  warehouse:string;
  supplierCode: string;
  trackInventory: boolean;
  allowOutOfStock: boolean;
  Description: string;
  vat: string;
  categories?: categoryType;
  subCategories: categoryType[];
  photos: string[];
  mainPhoto: string;
  __v?: number;
}

/**
 * Main component to display product details
 */
const formatPrice = (price :any) => {
  // Example implementation - adjust to your needs (currency symbol, locale)
  // Using EUR for Netherlands example, based on current location info
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price || 0);
};
export default function ShowProduct() {
  // State for product data, loading status, and errors
  const [product, setProduct] = useState<Product>({} as Product);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get product ID from URL
  const pathname = usePathname();
  const id = pathname?.split("/").pop();
console.log(product,"product")
  // Fetch product data on component mount
  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetch(`/api/products/getProduct/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status}`);
        }
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData.product, "product in Showing");
          setProduct(jsonData?.product);
          setError(null);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) {
          setError("Failed to load product details");
          toast.error("Failed to load product details");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  /**
   * Formats a number as a currency string
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  /**
   * Calculates the discounted price based on original price and discount percentage
   */
  const calculateDiscountedPrice = (price: number, discount: string) => {
    if (!discount) return price;
    const discountValue = parseFloat(discount);
    if (isNaN(discountValue)) return price;

    return price - (price * discountValue / 100);
  };

  type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | null | undefined;



    // --- Calculations ---
  const originalPrice = +product?.price || 0;
  const discountPercent = +product?.Discount || 0;
  
  const vatPercent = +product?.vat || 0;

  // Calculate the price after applying the discount
  const priceAfterDiscount = discountPercent > 0
    ? originalPrice * (1 - discountPercent / 100)
    : originalPrice;

  // Calculate the final total price by adding VAT to the discounted price
  const totalPriceIncludingVAT = priceAfterDiscount * (1 + vatPercent / 100);

  // Determine stock status and styling
  const stockCount = parseInt(product?.stock);
  const isInStock = stockCount > 0;
  const stockText = isInStock ? `${stockCount} in stock` : "Out of stock";
  let stockBadgeVariant:BadgeVariant  = 'secondary'; // Default variant
  let stockBadgeClass = ''; // Additional Tailwind classes

  if (!isInStock) {
    stockBadgeVariant  = 'destructive'; // Red for out of stock
  } else if (stockCount < 10) {
    // Yellow for low stock - using outline variant + custom Tailwind colors
    stockBadgeVariant = 'outline';
    stockBadgeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300'; // Example yellow styling
  } else {
    // Green for high stock - using outline variant + custom Tailwind colors
    stockBadgeVariant = 'outline';
    stockBadgeClass = 'bg-green-100 text-green-800 border-green-300'; // Example green styling
  }


  // Show loading state
  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    < div className="heighWithOutBar overflow-auto bg-gradient">
      {/* Edit button header */}
      <div className="container flex items-end w-full justify-end pt-4 gap-2">
        <Link href={`/dashboard/Products/${id}`}>
          <Button
            size="default"
            className="h-10 gap-1 border card-gradient hover:border-white transition-colors cursor-pointer"
          >
            <Pencil className="h-5 w-3.5 text-green-300" />
            <span className={cn("whitespace-nowrap text-foreground")}>
              Edit Product
            </span>
          </Button>
        </Link>
        <Link href={`/dashboard/Products`}>
          <Button
            size="default"
            className="h-10 gap-1 border card-gradient hover:border-white transition-colors cursor-pointer"
          >
                              <Boxes className='h-4 w-4 mr-2 text-green-300' />

            <span className={cn("whitespace-nowrap text-foreground")}>
               Products
            </span>
          </Button>
        </Link>
      </div>

      {/* Main content container */}
      <div className="grid gap-6 container py-6 relative">
        <div className="blob_light" style={{ opacity: "0.5", zIndex: "999" }}></div>

        {/* Product layout grid */}
        <div className="grid md:grid-cols-5 gap-6">
          {/* LEFT COLUMN - Product Images (2 columns) */}
          <div className="md:col-span-2">
            {/* Product Image Carousel */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Carousel className="rounded-lg overflow-hidden">
                  <CarouselContent>
                    {product?.photos && product?.photos?.length > 0 ? (
                      product?.photos.map((photo, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-square relative">
                            <Image
                              src={photo}
                              alt={`${product.name} - Image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))
                    ) : (
                      <CarouselItem>
                        <div className="aspect-square  flex items-center justify-center">
                          <Package className="h-24 w-24 text-muted-foreground/50" />
                        </div>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <ChevronLeft className="h-5 w-5" />
                  </CarouselPrevious>
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="h-5 w-5" />
                  </CarouselNext>
                </Carousel>
              </CardContent>
            </Card>

            {/* Product pricing card */}
            <div className="mt-4 space-y-4">
            <Card className="w-full max-w-sm"> {/* Example sizing */}
      <CardHeader>
      <CardTitle className="text-2xl font-bold flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Pricing
                  </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4"> {/* Use grid layout for spacing */}

        {/* --- Pricing Section --- */}
        <div className="pricing-details flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-medium text-muted-foreground">Price:</span>
          {discountPercent > 0 ? (
            <>
              {/* Final price after discount (before VAT) */}
              <span className="text-lg font-semibold">
                {formatPrice(priceAfterDiscount)}
              </span>
              {/* Original price (struck through) */}
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
              {/* Discount Badge */}
              <Badge variant="destructive" className="text-xs">
                {discountPercent}% OFF
              </Badge>
            </>
          ) : (
            <>
              {/* Regular Price */}
              <span className="text-lg font-semibold">
                {formatPrice(originalPrice)}
              </span>
            </>
          )}
        </div>

        {/* --- Total Price Section --- */}
        <div className="total-price-details flex items-baseline gap-x-2 border-t pt-2 mt-2"> {/* Added separator */}
           <span className="text-base font-semibold">Total (incl. VAT): </span>
           <span className="text-xl font-bold text-primary"> {/* Use primary color for emphasis */}
             {formatPrice(totalPriceIncludingVAT)}
           </span>
           {/* Optional: Show VAT rate if it's applied */}
           {vatPercent > 0 && (
              <span className="text-xs text-muted-foreground"> (incl. {vatPercent}% VAT)</span>
           )}
        </div>

        {/* --- Stock Information Section --- */}
        <div className="stock-info">
          {stockBadgeVariant !== null &&stockBadgeVariant !== undefined &&
           <Badge variant={stockBadgeVariant} className={stockBadgeClass}>
           {stockText}
        </Badge>
          }
          
        </div>

      </CardContent>

      {/* Optional Footer for actions */}
      {/* <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter> */}
    </Card>

              {/* Quick details card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Quick Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground font-medium">SKU:</div>
                    <div className="font-mono">{product?.SKU}</div>

                    <div className="text-muted-foreground font-medium">Brand:</div>
                    <div>{product?.brandName}</div>

                    <div className="text-muted-foreground font-medium">VAT:</div>
                    <div>{product?.vat || "N/A"}%</div>

                    <div className="text-muted-foreground font-medium">Supplier:</div>
                    <div>{product?.SupplierName}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN - Product Details (3 columns) */}
          <div className="md:col-span-3 ">
            <div className="grid gap-6">
              {/* Product title and categories */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product?.subCategories && product?.subCategories?.map((category, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {category.name}
                    </span>
                  ))}
                  {product?.productTag && (
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                      {product.productTag}
                    </span>
                  )}
                </div>
              </div>

              {/* Tabbed content */}
              <Tabs defaultValue="details">
                <TabsList className="grid grid-cols-4">
                 
                  <TabsTrigger value="details" className="flex items-center gap-1">
                    <Clipboard className="h-4 w-4" />
                    <span>Details</span>
                  </TabsTrigger>
                  <TabsTrigger value="description" className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    <span>Description</span>
                  </TabsTrigger>
                  <TabsTrigger value="inventory" className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>Inventory</span>
                  </TabsTrigger>
                  <TabsTrigger value="supplier" className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Supplier</span>
                  </TabsTrigger>
                </TabsList>
                     {/* Details Tab */}
                     <TabsContent value="details" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Clipboard className="h-5 w-5 mr-2" />
                        Product Specifications
                      </h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium w-1/3">SKU</TableCell>
                            <TableCell className="font-mono">{product?.SKU}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Brand</TableCell>
                            <TableCell>{product?.brandName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Product Tag</TableCell>
                            <TableCell>{product?.productTag}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">VAT</TableCell>
                            <TableCell>{product?.vat || "N/A"}%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Categories</TableCell>
                            <TableCell>
                              {product?.categories?.name || "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Sub Categories</TableCell>
                            <TableCell className="whitespace-normal break-words">
                              {product?.subCategories && product?.subCategories?.length > 0
                                ?  product?.subCategories && product?.subCategories?.map((category, index) => (
                                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                    {category.name}
                                  </span>
                                ))
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>


                {/* Description Tab */}
                <TabsContent value="description" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="w-full">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Info className="h-5 w-5 mr-2" />
                          Product Description
                        </h3>
                        <div className="relative w-full overflow-hidden">
                          {product?.Description ? (
                            <p className="whitespace-normal break-words overflow-wrap-anywhere text-sm md:text-base pr-4" style={{ maxWidth: '100%', overflowX: 'hidden', wordBreak: 'break-word' }}>
                              {product?.Description}
                            </p>
                          ) : (
                            <p className="text-muted-foreground italic">No description available</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

           
                {/* Inventory Tab */}
                <TabsContent value="inventory" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Inventory Management
                      </h3>
                      <Table>
                        <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Warehouse</TableCell>
                            <TableCell className="font-mono">{product?.warehouse}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium w-1/3">Stock</TableCell>
                            <TableCell>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                parseInt(product?.stock) > 10
                                  ? "bg-green-100 text-green-800"
                                  : parseInt(product?.stock) > 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              )}>
                                {product?.stock || "Not tracked"}
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Track Inventory</TableCell>
                            <TableCell>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                product?.trackInventory
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              )}>
                                {product?.trackInventory ? "Yes" : "No"}
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Allow Out Of Stock</TableCell>
                            <TableCell>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                product?.allowOutOfStock
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              )}>
                                {product?.allowOutOfStock ? "Yes" : "No"}
                              </span>
                            </TableCell>
                          </TableRow>
                          
                          <TableRow>
                            <TableCell className="font-medium">Sales Code</TableCell>
                            <TableCell className="font-mono">{product?.salesCode}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Purchase Code</TableCell>
                            <TableCell className="font-mono">{product?.purchaseCode}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Supplier Tab */}
                <TabsContent value="supplier" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Supplier Information
                      </h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium w-1/3">Supplier Name</TableCell>
                            <TableCell>{product?.SupplierName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Supplier Code</TableCell>
                            <TableCell className="font-mono">{product?.supplierCode}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Discount</TableCell>
                            <TableCell>
                              {product?.Discount ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  {product?.Discount}% OFF
                                </span>
                              ) : (
                                "No Discount"
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


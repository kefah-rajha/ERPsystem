"use client";
import Image from "next/image";

import { UsersIcon ,Pencil } from "lucide-react";
import { usePathname } from "next/navigation";




function ChevronLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { unknown } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default  function ShowProduct() {
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
        trackInventory: true,
        allowOutOfStock: false,
        Description: "",
      });
    const pathname = usePathname();
const id = pathname?.split("/").pop();
useEffect(() => {
    let ignore = false;
    console.log(id, "id in getProduct");
    fetch(`/api/products/getProduct/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData.posts, "product in SHowing");

          setProduct(jsonData.posts);
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
  }, [id]);

//   const ShowImages = product?.posts?.photos?.map((imge: string, index: any) => (
//     <CarouselItem key={index}>
//       <Image
//         src={imge}
//         alt="Product Image"
//         width={1000}
//         height={1000}
//         className="aspect-square object-cover w-full"
//       />
//     </CarouselItem>
//   ));
  const rowPropreties = Object.entries(product)
    .filter(
      ([key]) =>
        key !== "name" &&
        key !== "Description" &&
        key !== "photos" &&
        key !== "_id" &&
        key !== "__v"
    )
    .map(([key, value]) => (
      <TableRow key={key} className="p-0">
        <TableCell>
          <strong className="text-foreground/70 font-light py-4">
            {key.toUpperCase()}
          </strong>
        </TableCell>
        <TableCell className="font-light py-4 ">{value as string}</TableCell>
      </TableRow>
    ));

  return (
    <>
    <div className="container flex items-end w-full justify-end pt-4">
      <Link href={`/dashboard/Products/${id}`}>
      <Button
        size="default"
        className="h-8 gap-1 border bg-background    hover:border-white  transition-colors  cursor-pointer"
      >
        <Pencil className="h-5 w-3.5 text-green-300" /> 
        <span
          className={cn(
            "sr-only sm:not-sr-only sm:whitespace-nowrap shadow-2xl   Justglow text-foreground"
          )}
        >
          Edit Product
        </span>
      </Button>
      </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12   relative mx-auto pb-6 pt-2 container">
        <div
          className="blob_light "
          style={{ opacity: "0.5", zIndex: "999" }}
        ></div>
        <div className="grid gap-4 md:gap-10 items-start">
          <Carousel className="rounded-lg overflow-hidden shadow-md border">
            {/* <CarouselContent>{ShowImages}</CarouselContent> */}
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/50 p-2 text-muted-foreground hover:bg-background/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ChevronLeftIcon className="h-5 w-5" />
            </CarouselPrevious>
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/50 p-2 text-muted-foreground hover:bg-background/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ChevronRightIcon className="h-5 w-5" />
            </CarouselNext>
          </Carousel>
          <div className="grid gap-2">
            <h2 className="font-bold text-2xl sm:text-3xl ">
              {product?.name}
            </h2>
            <div className="flex items-center gap-2">
              <div className="text-4xl font-bold">$99</div>
              <div className="text-sm text-muted-foreground">
                {" "}
                <UsersIcon className="w-5 h-5" />
                <span>1,234 people have paid for this</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:gap-10 items-start ">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium py-6 text-foreground/75 capitalize">
                      Introducing the{" "}
                      <strong className="font-bold ">
                        {product?.name}
                      </strong>
                      , a revolutionary tool that will change the way you work.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium py-6 text-foreground/75 capitalize">
                      {product?.Description}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Product Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>{rowPropreties}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

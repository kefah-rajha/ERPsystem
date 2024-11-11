"use client";
import Image from "next/image";

import { UsersIcon ,Pencil } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AllSupplierResponse } from "@/dataType/dataTypeSupplier/dataTypeSupplier";






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
    const [data, setData] = useState<AllSupplierResponse>({
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        website: "",
        companyName: "",
        defaultTax: "",
        phone: "",
        mailingAddress: "",
        postCodeMiling: "",
        cityMiling: "",
        streetMiling: "",
        mailingCountry: "",
        address: "",
        postCode: "",
        city: "",
        street: "",
        country: "",
      });
    const pathname = usePathname();
    const { push } = useRouter();
const id = pathname?.split("/").pop();
useEffect(() => {
    let ignore = false;
    fetch(`/api/supplier/getSupplier/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData, "INFO");

          setData(jsonData.data);
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
  }, [id, push]);

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
  const rowPropreties = Object.entries(data)
    .filter(
      ([key]) =>
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
    <div className="overflow-auto bg-gradient heighWithOutBar">
    <div className="container flex items-end w-full justify-end pt-4  ">
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
            </CarouselPrevious>
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/50 p-2 text-muted-foreground hover:bg-background/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </CarouselNext>
          </Carousel>
          <div className="grid gap-2">
            <h2 className="font-bold text-2xl sm:text-3xl ">
              {data?.firstName}
            </h2>
        
          </div>
        </div>
        <div className="grid gap-4 md:gap-10 items-start ">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Product info
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
    </div>
  );
}

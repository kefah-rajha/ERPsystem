"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductTable from "@/components/puchaseOrder/product-table";
import { ProductSalesOrder } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

function AddProductButton() {
  const [fieldSearch, setFieldSearch] = useState<string>("name");
  const [searchInput, setSearchInput] = useState<string>("");
  const [products, setProducts] = useState<ProductSalesOrder[]>([]);
  const [open, setOpen] = useState(false)
    const closeDialog=(close:boolean)=>{
      setOpen(close)
    }


  const SearchHandler = async () => {
    
    console.log(searchInput);
    const data = {
      fieldSearch,
      searchInput,
    };
    console.log(data, "users");
    if(searchInput !==""){
      
      const fetchData = await fetch("/api/searchProductSalesOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      });
      const res = await fetchData.json();
      console.log(res.data, "res");
      if (res.data) {
        setProducts(res.data);
      }
    }else{
      setProducts([]);
    }

 
  };
  useEffect(() => {
    const getData = setTimeout(() => {
      SearchHandler();
    }, 2000);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="">
          Add Products
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col w-[90%] h-[90vh] card-gradient overflow-auto">
        <h3 className="">Add Products</h3>
        <div className="flex justify-start   shadow-sm rounded-sm  ">
          <Select onValueChange={setFieldSearch} value={fieldSearch}>
            <SelectTrigger className="w-1/4 h-10 rounded-r-none  card-gradient text-orange-300 px-5 rounded-l-sm outline-none border-none	 ring-0 focus:outline-none focus:border-none focus:ring-0 ">
              <SelectValue placeholder="Name" className="outline-none " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="name">Name Product</SelectItem>
                <SelectItem value="SKU">SKU</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <form className="h-10 ">
            <div className="flex">
              <div className="relative ">
                <input
                  type="search"
                  onChange={(e: any) => {
                    setSearchInput(e.target.value);
                  }}
                  value={searchInput}
                  id="search-dropdown"
                  className="block outline-none  w-full card-gradient rounded-sm  p-2.5   text-sm text-white bg-transparent rounded-e-lg  "
                  placeholder="Search ..."
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <ProductTable products={products}  closeDialog={closeDialog}/>

        <DialogFooter>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddProductButton;

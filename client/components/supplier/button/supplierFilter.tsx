"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SupplierContext } from "@/context/supplierContext";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangeState {
  startDate: string;
  endDate: string;
}

type SupplierFilterDataType = {
  pageNumber?: number;
  pageSize?: number;
}

function SupplierFilter({ pageNumber = 1, pageSize = 10 }: SupplierFilterDataType) {
  const [fieldSort, setFieldSort] = useState<string>("firstName");
  const [sort, setSort] = useState<string>("1");
  const [fields, setFields] = useState<string>("All");
  const [fieldSearch, setFieldSearch] = useState<string>("firstName");
  const [searchInput, setSearchInput] = useState<string>("");
  const supplierContext = useContext(SupplierContext);
  const [dateRange, setDateRange] = useState<DateRangeState>({
    startDate: '',
    endDate: ''
  });
  const defaultDateRange = { startDate: "", endDate: "" };

  const handleResetFilters = useCallback(() => {
    setFieldSort("firstName");
    setSort("1");
    setFields("All");
    setFieldSearch("firstName");
    setSearchInput("");
    setDateRange(defaultDateRange);
  }, []);

  const filterAndSearchHandler = async () => {
    try {
      const data = {
        fieldSort,
        sort,
        fields,
        fieldSearch,
        searchInput,
        dateRange,
        pageNumber,
        pageSize
      };
      console.log(data, "suppliers");

      const fetchData = await fetch(`/api/supplier/getSuppliers/${pageSize}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data)
      });

      const res = await fetchData.json();
      
      if (res.success === false) {
        toast.error(res?.message || "Failed to fetch suppliers");
        return;
      }
      
      if (res.data) {
        console.log(res.data, "supplier response");
        supplierContext?.setSupplier(res.data);
        toast.success("Suppliers data fetched successfully");
      } else {
        toast.error("No supplier data available");
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("An unexpected error occurred while fetching suppliers");
    }
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      filterAndSearchHandler();
    }, 2000);
    
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, pageSize, pageNumber]);

  return (
    <div className="flex justify-start gap-2">
      <div className="flex justify-start card-gradient shadow-sm rounded-sm h-10">
        <Select onValueChange={setFieldSearch} value={fieldSearch}>
          <SelectTrigger className="w-full h-10 rounded-r-none card-gradient text-orange-300 px-5 rounded-l-sm outline-none border-none ring-0 focus:outline-none focus:border-none focus:ring-0">
            <SelectValue placeholder="Name" className="outline-none" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="firstName">Name</SelectItem>
              <SelectItem value="companyName">Company Name</SelectItem>
              <SelectItem value="address">Address</SelectItem>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="phone">Phone Number</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <form className="h-10">
          <div className="flex">
            <div className="relative">
              <input
                type="search"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                value={searchInput}
                id="search-dropdown"
                className="block outline-none card-gradient rounded-sm p-2.5 text-sm text-white bg-transparent rounded-e-lg"
                placeholder="Search ..."
                required
              />
            </div>
          </div>
        </form>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-10 card-gradient hover:text-gray-400"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2 text-red-300" />
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent className="w-3/4 bg-gradient">
          <DialogHeader className="flex justify-start">
            <DialogTitle className="flex gap-2 border-b-2 border-gray-500 pb-4">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-orange-600" />
              Filter
              <Button
                variant="default"
                onClick={handleResetFilters}
                className="sm:w-auto w-4 h-4"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Filter
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-between items-center gap-2">
            <Select onValueChange={setFieldSort} value={fieldSort}>
              <SelectTrigger
                id="status"
                aria-label="A-Z order"
                className="bg-[#595959] border-none h-8 w-fit text-[#A19D9D]"
              >
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="firstName">Name</SelectItem>
                  <SelectItem value="companyName">Company Name</SelectItem>
                  <SelectItem value="address">Address</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="phone">Phone Number</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={setSort} value={sort}>
              <SelectTrigger
                id="status"
                aria-label="A-Z order"
                className="bg-[#595959] border-none h-8 w-fit text-[#A19D9D]"
              >
                <SelectValue placeholder="A-Z order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">A-TO-Z</SelectItem>
                <SelectItem value="-1">Z-TO-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-between items-center">
            <p className="h-8 w-fit pl-2 pr-4 bg-[#595959] text-[#A19D9D] flex justify-center items-center rounded-sm">
              Fields
            </p>
            <Select onValueChange={setFields} value={fields}>
              <SelectTrigger
                id="status"
                aria-label="Fields"
                className="bg-[#595959] border-none h-8 w-fit text-[#A19D9D]"
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Empty">Has empty fields</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4">
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="start-date"
                className="mb-2 text-sm font-medium"
              >
                Date From
              </label>
              <input
                id="start-date"
                type="date"
                className="w-full px-3 py-2 inputCustom rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  startDate: e.target.value
                }))}
              />
            </div>

            <div className="flex flex-col w-1/2">
              <label
                htmlFor="end-date"
                className="mb-2 text-sm font-medium"
              >
                Date To
              </label>
              <input
                id="end-date"
                type="date"
                className="w-full px-3 py-2 inputCustom rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  endDate: e.target.value
                }))}
              />
            </div>
          </div>

          <Button
            type="button"
            variant="default"
            className="h-8 w-full"
            onClick={filterAndSearchHandler}
          >
            Apply
          </Button>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupplierFilter;
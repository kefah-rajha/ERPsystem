"use  client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { SlidersHorizontal } from "lucide-react";
import { Calendar as CalendarIcon ,RotateCcw} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';

import { Slider } from '@/components/ui/slider';
import getAllProduct from "@/lib/ProductFetch/getAllProduct";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import CategorySelect from "./CategorySelect";
interface ProductAttribute {
    _id: string;
    name: string;
    SKU: string;
    brandName: string;
    productTag: string;
    price: number;
    Discount: string;
    stock: string,
    SupplierName: string;
    salesCode: string;
    purchaseCode: string;
    supplierCode: string;
    trackInventory: boolean;
    allowOutOfStock: boolean;
    Description: string;
    vat: string;
    categories: string;
    subCategories: string[];
    photos: string[]
}
type userFilterDataType = {
    pageNumber: number;
    pageSize: number;
    setProducts: (products: ProductAttribute[]) => void;
    selectedCategory:string |null;

}
interface PriceRange {
    min: number;
    max: number;
}


interface DateRangeState {
    startDate: string;
    endDate: string;
}




function UserFilter({ pageNumber, pageSize, setProducts ,selectedCategory}: userFilterDataType) {
    const [fieldSort, setFieldSort] = useState<string>("name");
    const [sort, setSort] = useState<string>("1");
    const [fields, setFields] = useState<string>("All");
    const [fieldSearch, setFieldSearch] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [inStock, setInStock] = useState<string>('');
    const [priceRange, setPriceRange] = useState<PriceRange>({
        min: 0,
        max: 1000
    });
    const [brands, setBrands] = useState<string[]>([]);
    
    const [dateRange, setDateRange] = useState<DateRangeState>({
        startDate: '',
        endDate: ''
    });
    const [selectedBrands, setSelectedBrands] = useState<string>("All")
    const defaultPriceRange = { min: 0, max: 1000 };
    const defaultDateRange = { startDate: "", endDate: "" };
    const handleResetFilters = useCallback(() => {
        setFieldSort("name");
        setSort("1");
        setFields("All");
        setFieldSearch("");
        setSearchInput("");
        setInStock('');
        setPriceRange(defaultPriceRange);
        setSelectedBrands("All");
        setDateRange(defaultDateRange);

        

    }, []); 
    // Constants with type annotations
    const MAX_PRICE: number = 5000;
    const DEFAULT_STEP: number = 10;

    // Slider change handler with type-safe parameters
    const handleSliderChange = (values: number[]) => {
        setPriceRange({
            min: values[0],
            max: values[1]
        });
    };


    // Manual input handler with type-safe parameters
    const handleManualInput = (type: 'min' | 'max', value: string) => {
        const numValue = Number(value);
        setPriceRange(prev => ({
            ...prev,
            [type]: Math.min(Math.max(0, numValue), type === 'max' ? MAX_PRICE : prev.max)
        }));
    };
    searchInput;
   
    const filterAndSearchHandler = async () => {
        console.log(searchInput)
        type dataType = {
            fieldSort: string;
            sort: string;
            fields: string;
            fieldSearch: string;
            searchInput: string;
            inStock: string;
            priceRange: PriceRange;
            dateRange: DateRangeState;
            selectedBrands: string;
            selectedCategory:string |null;
        }
        const data: dataType = {
            fieldSort,
            sort,
            fields,
            fieldSearch,
            searchInput,
            inStock,
            priceRange,
            dateRange,
            selectedBrands,
            selectedCategory
        };

        const getData = async (pageNumber: number, pageSize: number, data: dataType) => {

            const resProducts = await getAllProduct(pageNumber, pageSize, data);
            console.log(resProducts, "product");
            if (resProducts) {
                setProducts(resProducts?.products);
                setBrands(resProducts?.appliedFilters?.brand)

            }
        };
        getData(pageNumber, pageSize, data);
    }

    useEffect(() => {
        const getData = setTimeout(() => {
            filterAndSearchHandler()
        }, 2000)
        return () => clearTimeout(getData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput, pageSize, pageNumber,selectedCategory])


    return (
        <div className="flex justify-start gap-2 ">
            <div className="flex justify-start  card-gradient shadow-sm rounded-sm h-10 ">
                <Select onValueChange={setFieldSearch} value={fieldSearch}>
                    <SelectTrigger className="w-full h-10 rounded-r-none  card-gradient text-orange-300 px-5 rounded-l-sm outline-none border-none	 ring-0 focus:outline-none focus:border-none focus:ring-0 ">
                        <SelectValue placeholder="Name" className="outline-none " />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="brandName">Brand Name</SelectItem>
                            <SelectItem value="SupplierName">Supplier Name</SelectItem>
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
                                className="block outline-none   card-gradient rounded-sm  p-2.5   text-sm text-white bg-transparent rounded-e-lg  "
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
                        className=" h-10 card-gradient  hover:text-gray-400"
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2 text-red-300 " />
                        Filter
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-2/4  bg-gradient">
                    <DialogHeader className="flex justify-start ">
                        <DialogTitle className="flex gap-2 border-b-2 border-gray-500 pb-4">
                            <SlidersHorizontal className="h-4 w-4 mr-2 text-orange-600  " />
                            Filter
                            <Button
                variant="default" //
                
                onClick={handleResetFilters}
                className=" sm:w-auto w-4 h-4" 
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
                                className=" bg-[#595959] border-none h-8  w-fit text-[#A19D9D]"
                            >
                                <SelectValue placeholder="Field" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="brandName">Brand Name</SelectItem>
                                <SelectItem value="SupplierName">Supplier Name</SelectItem>
                                <SelectItem value="SKU">SKU</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setSort} value={sort}>
                            <SelectTrigger
                                id="status"
                                aria-label="A-Z order"
                                className=" bg-[#595959] border-none h-8  w-fit text-[#A19D9D]"
                            >
                                <SelectValue placeholder="A-Z order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">A-TO-Z</SelectItem>
                                <SelectItem value="-1">Z-TO-A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <h3 className=" bg-[#595959] border-none h-8  w-fit text-[#A19D9D] rounded-sm px-2 flex justify-center items-center">Brands</h3>

                        <Select

                            value={selectedBrands}
                            onValueChange={setSelectedBrands}
                        >
                            <SelectTrigger className=" bg-[#595959] border-none h-8  w-fit text-[#A19D9D]">
                                <SelectValue placeholder="Select brands" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    key="All"
                                    value="All"


                                >
                                    All
                                </SelectItem>
                                {brands.length > 0 && brands.map((brand: string) => (
                                    <SelectItem
                                        key={brand}
                                        value={brand}


                                    >
                                        {brand}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="space-y-2 mt-2">
                        <div >
                            <div className="space-y-4">
                                {/* Slider Component with TypeScript props */}
                                <Slider
                                    defaultValue={[0, 1000]}
                                    max={MAX_PRICE}
                                    step={DEFAULT_STEP}
                                    onValueChange={handleSliderChange}
                                    value={[priceRange.min, priceRange.max]}
                                />

                                {/* Price Input Fields */}
                                <div className="flex justify-between items-center space-x-4">
                                    <div className="flex-1">
                                        <Label>Min Price</Label>
                                        <Input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => handleManualInput('min', e.target.value)}
                                            min={0}
                                            max={priceRange.max}
                                            className="mt-2 inputCustom"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label>Max Price</Label>
                                        <Input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => handleManualInput('max', e.target.value)}
                                            min={priceRange.min}
                                            max={MAX_PRICE}
                                            className="mt-2 inputCustom"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Current Price Range Display */}
                            <div className="text-center text-sm text-muted-foreground mt-4">
                                Selected Range: ${priceRange.min} - ${priceRange.max}
                            </div>
                        </div>
                    </div>
                    {/* Stock status */}
                    <div className="space-y-2">
                        <Label>Stock Status</Label>
                        <Select
                            value={inStock}
                            onValueChange={setInStock}
                        >
                            <SelectTrigger className="inputCustom">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="inputCustom"
                            >
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="true">In Stock</SelectItem>
                                <SelectItem value="false">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex flex-col w-1/2">
                            <label
                                htmlFor="start-date"
                                className="mb-2 text-sm font-medium "
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
                                className="mb-2 text-sm font-medium "
                            >
                                Date To
                            </label>
                            <input
                                id="end-date"
                                type="date"
                                className="w-full px-3 py-2 inputCustom  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <DialogClose asChild>

                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}

export default UserFilter;



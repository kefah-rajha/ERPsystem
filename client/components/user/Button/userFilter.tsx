"use  client";
import React, { useContext, useEffect, useState } from "react";
import {UserContext}from "@/context/userContext"

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function UserFilter() {
  const [filter, setFilter] = useState();
  const [fieldSort, setFieldSort] = useState<string>("name");
  const [sort, setSort] = useState<string>("1");
  const [role, setRole] = useState<string>("All");
  const [fields, setFields] = useState<string>("All");
  const [fieldSearch, setFieldSearch] = useState<string>("name");
  const [searchInput, setSearchInput] = useState<string>("");
  const userContext=useContext(UserContext)


  searchInput;
  useEffect(() => {
    let ignore = false;
    fetch(`/api/userFilter`)
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData, "filter");

          setFilter(jsonData.data);
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
  const filterAndSearchHandler = async () => {
    console.log(searchInput)
    const data = {
      fieldSort,
      sort,
      role,
      fields,
      fieldSearch,
      searchInput,
    };
    console.log(data,"users")

    const fechdat= await fetch("/api/getUsers/10",{
      method:"POST",
      headers: {    "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Origin": "*",
     },
     body:JSON.stringify(data)
    
    })
    const res= await fechdat.json()
    if(res.data){
      userContext?.setUsers(res.data)
    }
    console.log(res)
  };
  useEffect(()=>{
    const getData = setTimeout(() => {
      filterAndSearchHandler()
    }, 2000)
    return () => clearTimeout(getData)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchInput])


  return (
    <div className="flex justify-start gap-2 ">
      <div className="flex justify-start  card-gradient shadow-sm rounded-sm h-10 ">
        <Select onValueChange={setFieldSearch} value={fieldSearch}>
          <SelectTrigger className="w-full h-10 rounded-r-none  card-gradient text-orange-300 px-5 rounded-l-sm outline-none border-none	 ring-0 focus:outline-none focus:border-none focus:ring-0 ">
            <SelectValue placeholder="Name" className="outline-none " />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Catogries</SelectLabel>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="nameComapny">Company Name</SelectItem>
              <SelectItem value="phone">Phone Number</SelectItem>
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
        <DialogContent className="w-1/4  bg-gradient">
          <DialogHeader>
            <DialogTitle className="flex gap-2 border-b-2 border-gray-500 pb-4">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-orange-600  " />
              Filter
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
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="CompanyName">Company Name</SelectItem>
                <SelectItem value="phone">Phone Number</SelectItem>
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
          <div className="flex gap-2 justify-between items-center">
            <p className="h-8 w-fit pl-2 pr-4 bg-[#595959] text-[#A19D9D] flex justify-start items-center rounded-sm">
              Role
            </p>
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger
                id="status"
                aria-label="Role"
                className=" bg-[#595959] border-none h-8  w-fit text-[#A19D9D]"
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="SalesStaff">Sales Staff </SelectItem>
                <SelectItem value="Deliver">Deliver </SelectItem>
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
                className=" bg-[#595959] border-none h-8  w-fit text-[#A19D9D]"
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Empty">has empty fields</SelectItem>
                
              </SelectContent>
            </Select>
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
    </div>
  );
}

export default UserFilter;



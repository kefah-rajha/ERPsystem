"use client";
import React, { useEffect, useRef, useState } from "react";
import { LayoutList, ArrowBigRightDash, Brush } from "lucide-react";
import { categoriesResopnseData } from "@/dataType/dataTypeCategory/dataTypeCategory";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { toast } from "../ui/use-toast";

interface showCategories {
  categoryData: categoriesResopnseData;
  handleDeleteCategory:(id:string)=>void,
  handleUpdateCategory:(data:categoriesResopnseData)=>void
}

function ShowCategories({ categoryData ,handleUpdateCategory,handleDeleteCategory}: showCategories) {
  const [showElement, setShowElement] = useState(false);
  const [open, setOpen] = React.useState(false);

  const parentRef = useRef(null);
  const { push } = useRouter();
  const [{ category, slug }, setFormState] = useState({
    category: categoryData.name,
    slug: categoryData.slug,
  });
  const createFormValueChangeHandler = (field: string) => {
    return (event: any) => {
      setFormState((formState) => ({
        ...formState,
        [field]: event.target.value,
      }));
    };
  };
  const sendDataToServer = async () => {
    if( category=="" || slug ==""){
        toast({
            variant: "default",
            title: "Uh oh! Something went wrong.❌.",
            description: "You cannot leave the name or slug blank. ",
          });

    }else{
    const data = {
      category,
      slug,
    };
    const fetchData = await fetch(`/api/category/UpdateCategory/${categoryData._id}`, {
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
    console.log(res,"res update")
    if(res.success == true){
        setOpen(false)
    handleUpdateCategory(res.data)

}

  };}
  const deleteCategory = async(id :string)=>{
    const fetchDeleteData=await fetch(  `/api/category/deleteCategory/${id}`,{
        method:"Delete",
      headers: {    "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Origin": "*"}
     }  )
     const res =await fetchDeleteData.json()
     if (res.success == false) {
      toast({
        variant: "default",
        title: "Uh oh! Something went wrong.❌",
        description: res?.message,
      });
  
     }
     if (res.success == true) {
        handleDeleteCategory(id)
      
    }

if(res.success == false){
    toast({
        variant: "default",
        title: "Uh oh! Something went wrong.❌",
        description: res.message,
      });

}
}
  useEffect(() => {
    const handleMouseOver = () => {
      console.log("MouseOver");
      setShowElement(true);
    };

    const handleMouseOut = () => {
      console.log("Mouseout");

      setShowElement(false);
    };

    const element =
      parentRef?.current !== null && (parentRef?.current as HTMLDivElement);

    if (parentRef.current) {
      const element = parentRef.current as HTMLDivElement;

      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      if (element) {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, []);
   
  return (
    <div
      key={categoryData._id}
      ref={parentRef}
      className="card-gradient   relative w-full rounded-sm p-4 shadow-lg cursor-pointer "
    >
      
       <AlertDialog>
              <AlertDialogTrigger asChild>
              {showElement && (
        <div className=" absolute card-gradient  text-red-400 hover:text-foreground hover:bg-red-800    shadow-lg    transition-opacity -right-6 -top-1 z-30 rounded-full  h-8 w-8 flex justify-center items-center">
          X
        </div>
      )}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure ,Delete {categoryData.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your Category and remove your data from your servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                     <Button onClick={() => deleteCategory(categoryData._id)}>
                              Continue
                            </Button> 
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
      {/* eslint-disable-next-line @next/next/no-img-element */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {showElement && (
            <div className="absolute  transition-opacity card-gradient text-foreground/60   text-green-500  right-1 -top-6 z-30 hover:text-foreground rounded-full  h-8 w-8 flex justify-center items-center">
              <Brush className="h-4 w-4" />
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gradient ">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Name"
              value={category}
              
              className="col-span-3 inputCustom "
              autoComplete="off"
              onChange={createFormValueChangeHandler("category")}
            />
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input
              id="slug"
              placeholder="slug"
              autoComplete="off"
              value={slug}
              className="col-span-3 inputCustom "
              onChange={createFormValueChangeHandler("slug")}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={category == "" || slug == ""}
              onClick={sendDataToServer}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <LayoutList className="absolute top-[50%]  translate-y-[-50%] right-4  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

        <div className="  w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:focus:bg-[#302f2f] flex items-center">
          {categoryData.name}
        </div>
      </div>
      <div className="h-14 flex items-center justify-between hover:bg-orange-50 bg-gradient w-full rounded-sm shadow-lg pl-2 mt-4 ">
        <p className="text-foreground/75">Show SubCategories</p>
        <div
          className="h-full w-3/12 card-gradient shadow-lg flex justify-center items-center group  cursor-pointer "
          onClick={() => {
            push(`/dashboard/Products/Categories/${categoryData._id}`);
          }}
        >
          <ArrowBigRightDash className="text-orange-500 group-hover:text-orange-50 " />
        </div>
      </div>
    </div>
  );
}

export default ShowCategories;

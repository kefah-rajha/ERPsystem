"use client";
import React, { useState } from "react";
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
import { LayoutList } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useParams } from 'next/navigation'


interface CreateSubCategory {
  handleAddSubCategory: (newCategory: any) => void;
  CategoryID: string
}
function CreateSubCategory({ handleAddSubCategory, CategoryID }: CreateSubCategory) {
  const [open, setOpen] = React.useState(false);
  const path = useParams()


  const [{ subcategory, slug }, setFormState] = useState({
    subcategory: "",
    slug: "",
  });
  console.log(subcategory, slug)
  const createFormValueChangeHandler = (field: string) => {
    return (event: any) => {
      setFormState((formState) => ({
        ...formState,
        [field]: event.target.value,
      }));
    };
  };
  const sendDataToServer = async () => {
    console.log(CategoryID, "CategoryID")
    const data = {
      subcategory,
      slug,
      mainCategory: false,
    }
    const fetchData = await fetch(`/api/Subcategory/createSubCategory/${CategoryID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data)

    })
    const res = await fetchData.json()
    if (res.success == true) {
      handleAddSubCategory(res.data)
      setOpen(false)

    }
    if (res.success == false) {
      toast({
        variant: "default",
        title: "Uh oh! Something went wrong.❌",
        description: res.message,
      });

    }
  }

  return (
    <div className="h-14 flex items-center container justify-end pt-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="h-9 rounded-sm   text-foreground card-gradient  hover:text-gray-400 ">
            <LayoutList className="h-4 w-4 mr-2 text-green-300 " />
            Create SubCategory
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gradient ">
          <DialogHeader>
            <DialogTitle>Create SubCategory</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Name"
              className="col-span-3 inputCustom "
              autoComplete="off"
              onChange={createFormValueChangeHandler("subcategory")}

            />
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input
              id="slug"
              placeholder="slug"
              autoComplete="off"
              className="col-span-3 inputCustom "
              onChange={createFormValueChangeHandler("slug")}

            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={subcategory == "" || slug == ""} onClick={sendDataToServer}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateSubCategory;

"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { categoriesResponseData } from "@/dataType/dataTypeCategory/dataTypeCategory";

import { cn } from "@/lib/utils";
type productCategoriesType = {
  id: string;
  name: string;
};
type CategorySelectType = {
  changeDataProductCategories: (data: productCategoriesType[]) => void;
  changeDataProductCategory: (data: string) => void;
};

function CategorySelect({
  
  changeDataProductCategories,
  changeDataProductCategory,
}: CategorySelectType) {
  const [categories, setCategories] = useState<categoriesResponseData[]>([]);
  const [subCategories, setSubCategories] = useState<categoriesResponseData[]>(
    []
  );
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState({
    id: "",
    name: "",
  });

  const [productCategories, setProductCategories] = useState<
    productCategoriesType[]
  >([]);
  const [open, setOpen] = useState(false);

  console.log(selectSubCategory);

  useEffect(() => { }, [selectCategory]);

  useEffect(() => {
    let ignore = false;
    fetch("/api/category/getCategories")
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData, "getSelectCategories");

          setCategories(jsonData.data);
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
  useEffect(() => {
    let ignore = false;
    console.log(selectCategory);
    const CategoryID =
      productCategories.length == 0 ? selectCategory : selectSubCategory.id;
    if (selectCategory !== "") {
      fetch(`/api/Subcategory/getSubCategories/${CategoryID}`)
        .then((res) => {
          return res.json();
        })
        .then((jsonData) => {
          if (!ignore) {
            console.log(jsonData, "getSubCategories");

            setSubCategories(jsonData.data);
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
    }
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategories.length, selectCategory]);
  console.log(subCategories, "subCategories");
  const DeleteSubCategoy = () => {
    if (productCategories.length > 0) {
      console.log(productCategories, "before");

      setProductCategories(productCategories.slice(0, -1));
      setSelectSubCategory(productCategories.slice(-2, -1)[0]);

      console.log(productCategories[-2], selectSubCategory);
    }
  };
  useEffect(() => {
    changeDataProductCategories(productCategories);
  }, [changeDataProductCategories, productCategories]);
  useEffect(() => {
    changeDataProductCategory(selectCategory);
  }, [changeDataProductCategory, selectCategory]);
  return (
    <Card x-chunk="dashboard-07-chunk-2" >
      <CardHeader>
        <CardTitle>Product Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6  items-center">
          <div className="grid gap-3">
          <div>
  <label htmlFor="Category">Category</label>
  <Select
    onValueChange={setSelectCategory}
    value={selectCategory}
  >
    <SelectTrigger
      id="Category"
      disabled={productCategories.length !== 0}
      className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
    >
      <SelectValue placeholder="Select Category" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((category: categoriesResponseData) => (
        <SelectItem value={category._id} key={category._id}>
          {category.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
          </div>
          <div className="h-full flex items-center flex-wrap">
            {productCategories.map((productCategory, index) => (
              <div
                key={productCategory.id}
                className="flex items-center ml-2 relative"
              >
                <p>--&gt; </p>
                <p
                  className={cn(
                    "w-fit px-2 py-2 bg-foreground/20  ml-2",
                    index === productCategories.length - 1
                      ? "rounded-l-sm rounded-bl-sm "
                      : "rounded-sm"
                  )}
                >
                  {productCategory.name}
                </p>
                <div
                  onClick={DeleteSubCategoy}
                  className={cn(
                    "h-10 card-gradient   w-5 hover:text-foreground/50 transition-colors  cursor-pointer justify-center items-center",
                    index === productCategories.length - 1
                      ? "flex rounded-r-sm rounded-br-sm"
                      : "hidden "
                  )}
                >
                  x
                </div>
              </div>
            ))}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="default"
                  variant="ghost"
                  type="submit"
                  className=" shadow-md bg-foreground/5 hover:bg-foreground/10 ml-2"
                  disabled={
                    selectCategory == ""
                      ? true
                      : false || subCategories.length == 0
                        ? true
                        : false
                  }
                >
                  Add SubCategory
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] h-[90hv] card-gradient">
                <DialogHeader>
                  <DialogTitle>SubCategory</DialogTitle>
                  <DialogDescription>Select SubCategory</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {subCategories.map((subCategory: categoriesResponseData) => (
                    <div
                      key={subCategory._id}
                      className={cn(
                        subCategory?._id == selectSubCategory?.id
                          ? "bg-orange-400"
                          : "bg-foreground/10",
                        "shadow-md w-fit px-4 py-2 rounded-sm cursor-pointer hover:bg-foreground/20"
                      )}
                      onClick={() => {
                        setSelectSubCategory({
                          id: subCategory?._id,
                          name: subCategory?.name,
                        });
                        console.log(subCategory?._id, selectSubCategory);
                      }}
                    >
                      {subCategory.name}
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setProductCategories([
                        ...productCategories,
                        selectSubCategory,
                      ]);
                      setOpen(false);
                    }}
                  >
                    Select
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CategorySelect;

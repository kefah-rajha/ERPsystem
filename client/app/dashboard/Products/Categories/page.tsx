"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import CreateCategory from "@/components/Categories/createCategory";
import { categoriesResopnseData } from "@/dataType/dataTypeCategory/dataTypeCategory";
import ShowCategories from "@/components/Categories/showCategories" 
import { toast } from "@/components/ui/use-toast";
function Page() {
  
  const [categories, setCategories] = useState<categoriesResopnseData[]>([]);
  
  const handleAddCategory = (newCategory: any) => {
    setCategories([...categories, newCategory]);
    toast({
      variant: "default",
      title: "Congratulations✅.",
      description: "create  is done",
    });

  };
  const handleDeleteCategory = (deleteCategory: any) => {
    const newCategory = categories?.filter(
      (item: categoriesResopnseData) => item._id !== deleteCategory
    );
    console.log(newCategory);
    if (newCategory) {
      setCategories(newCategory);
      toast({
        variant: "default",
        title: "Congratulations✅.",
        description: "delete is done",
      });

    }
    
  };
  const handleUpdateCategory = (UpdateCategory: any) => {
    setCategories((prevcategories) => {
      return prevcategories.map((category) => {

      if (category._id === UpdateCategory._id) {
        return { ...category, name: UpdateCategory.name ,slug:UpdateCategory.slug};
      } else {
        return category;
      }})

    });
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/category/getCategories")
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData, "getCategories");

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

 
  const catogeriesShow = categories.map((category: categoriesResopnseData) => (
   <ShowCategories categoryData={category} key={category._id} handleUpdateCategory={handleUpdateCategory} handleDeleteCategory={handleDeleteCategory}/>
  ));
  return (
    <div className=" bg-gradient heighWithOutBar overflow-auto">
      <CreateCategory handleAddCategory={handleAddCategory} />

      <div className="grid grid-cols-3 gap-6 container py-4">
        {catogeriesShow}
      </div>
    </div>
  );
}

export default Page;

"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CreateSubCategory from "@/components/Categories/subCategoryComponent/CreateSubCategory";
import { toast } from "@/components/ui/use-toast";
import { categoriesResopnseData } from "@/dataType/dataTypeCategory/dataTypeCategory";
import ShowSubCategories from"@/components/Categories/subCategoryComponent/showSubCategories"

function SubCategories() {
  const path = useParams();
  const [subcategories, setSubCategories] = useState<categoriesResopnseData[]>(
    []
  );
  const CategoryID = path.CategoriesID[path.CategoriesID.length - 1];
  console.log(CategoryID);

  useEffect(() => {
    let ignore = false;
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
    return () => {
      ignore = true;
    };
  }, [CategoryID]);
  
 

  const handleAddSubCategory = (newSubCategory: any) => {
    setSubCategories([...subcategories, newSubCategory]);
    toast({
      variant: "default",
      title: "Congratulations✅.",
      description: "create  is done",
    });
  };
  const handleDeleteSubCategory = (deleteCategory: any) => {
    const newCategory = subcategories?.filter(
      (item: categoriesResopnseData) => item._id !== deleteCategory
    );
    console.log(newCategory);
    if (newCategory) {
      setSubCategories(newCategory);
      toast({
        variant: "default",
        title: "Congratulations✅.",
        description: "delete is done",
      });

    }
    
  };
  const handleUpdateSubCategory = (UpdateCategory: any) => {
    setSubCategories((prevcategories) => {
      return prevcategories.map((category) => {

      if (category._id === UpdateCategory._id) {
        return { ...category, name: UpdateCategory.name ,slug:UpdateCategory.slug};
      } else {
        return category;
      }})

    });
  };
  const subCatogeriesShow = subcategories.map((subcategory: categoriesResopnseData) => (
    <ShowSubCategories subCategoryData={subcategory} key={subcategory._id} handleUpdateSubCategory={handleUpdateSubCategory} handleDeleteSubCategory={handleDeleteSubCategory}/>
   ));

  return (
    <div className=" bg-gradient heighWithOutBar overflow-auto">
      <CreateSubCategory
        handleAddSubCategory={handleAddSubCategory}
        CategoryID={CategoryID}
      />
      <div className="grid grid-cols-3 gap-6 container py-4">
         {subCatogeriesShow} 
      </div>
    </div>
  );
}

export default SubCategories;

import { categoriesResopnseData } from "@/dataType/dataTypeCategory/dataTypeCategory";

export function getSubcategories(categories: categoriesResopnseData[], parentId: string): categoriesResopnseData[] {
  return categories.filter(cat => cat.parent === parentId);
}

export function getCategoryLevel(categories: categoriesResopnseData[], categoryId: string): number {
  let level = 0;
  let currentCat = categories.find(c => c._id=== categoryId);
  
  while (currentCat?._id) {
    level++;
    currentCat = categories.find(c => c._id === currentCat?._id);
  }
  
  return level;
}

// export function getCategoryPath(categories: categoriesResopnseData[], categoryId: string): categoriesResopnseData[] {
//   const path: categoriesResopnseData[] = [];
//   let currentCat = categories.find(c => c.id === categoryId);
  
//   while (currentCat) {
//     path.unshift(currentCat);
//     currentCat = currentCat.parentId 
//       ? categories.find(c => c.id === currentCat.parentId)
//       : null;
//   }
  
//   return path;
// }
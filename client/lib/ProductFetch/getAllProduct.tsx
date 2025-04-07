"use client"
interface PriceRange {
  min: number;
  max: number;      }
  interface DateRangeState {
    startDate: string;
    endDate: string;
}
  type dataType = {
    fieldSort:string ;
    sort:string;
    fields:string;
    fieldSearch:string;
    searchInput:string;
    inStock:string;
    priceRange:PriceRange;
    dateRange:DateRangeState
}

 export default async function getAllProduct (pageNumber:number,pageSize:number ,data:dataType) {
  console.log(data)
    const fetchData =await fetch(`/api/products/getProducts/${pageNumber}/${pageSize}`,{
      method:"POST",
    headers: {    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*",
   },  
   body:JSON.stringify(data)

    })
    const res =await fetchData.json()
    console.log(res ,"data")
     if(res.success === true){
      return res.data
     }
  
  }
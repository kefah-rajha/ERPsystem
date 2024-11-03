"use client"



 export default async function getAllProduct (pageNumber:number) {
    const fetchData =await fetch(`/api/products/getProducts/${pageNumber}`,{
      method:"Get",
    headers: {    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*",
   },  

    })
    const res =await fetchData.json()
     if(res.allposts){
      return res.allposts
     }
  
  }
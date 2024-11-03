"use client"



 export default async function getNumberProductsServer () {
    const fetchData =await fetch("/api/products/getNumberProducts",{
      method:"Get",
    headers: {    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin": "*",
   },
   

    })
    const res =await fetchData.json()
    console.log(res , "res")
     if(res){
      return res
     }
  
  }
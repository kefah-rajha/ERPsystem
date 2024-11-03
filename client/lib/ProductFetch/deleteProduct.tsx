"use client"
export const deleteProductServer=async (id :any)=>{
    const fetchDeleteData=await fetch(  `http://localhost:3000/api/products/deleteProduct/${id}`,{
        method:"Delete",
      headers: {    "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Origin": "*",}
     }  )
     const res =await fetchDeleteData.json()
     return res
}
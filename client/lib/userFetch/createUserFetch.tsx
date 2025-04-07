"use client"

import { userProfileInfo } from "@/dataType/dataTypeProfile/dataTypeProfile"

export const  createprofileUser=async (data:userProfileInfo,url:string)=>{
    console.log(data,url)
    const fetchData= await fetch(url,{
        method:"POST",
        headers: {    "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
       },
       body:JSON.stringify(data)
      
      })
      const res= await fetchData.json()
      console.log(res)
      return res


}
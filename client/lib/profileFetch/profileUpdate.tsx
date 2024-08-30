"use client"


import React from 'react'
import {userProfileInfo} from "@/dataType/dataTypeProfile/dataTypeProfile"

export const  UpdateProfile=async (data:userProfileInfo,url:string)=>{
    console.log(data,url)
    const fechdat= await fetch(url,{
        method:"POST",
        headers: {    "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
       },
       body:JSON.stringify(data)
      
      })
      const res= await fechdat.json()
      console.log(res)


}


"use client"
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";



export default function Home() {
  const {push} =useRouter()
  useEffect(()=>{
    push("/dashboard")

  },[push])
  return (
    <main className=" h-screen overflow-hidden   bg-gradient">
      
      
    </main>
  );
}

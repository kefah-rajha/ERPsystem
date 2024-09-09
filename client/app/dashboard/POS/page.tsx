"use client";
import React, { createContext, useState, useContext } from "react";
import CreateInvoice from "@/components/POS/createInvoice";
import ProductPOS from "@/components/POS/productPOS";
import { CounterProvider } from "@/context/productPosContext";

function Page() {
  return (
    <div className=" heighWithOutBar  overflow-hidden   bg-gradient">
      <CounterProvider>
        <div className="grid grid-cols-12 container h-full  mt-14  gap-2 ">
          <div className="bg-[#404040]/50 col-span-6  mb-10 rounded-sm">
            <CreateInvoice />
          </div>
          <div className="bg-[#404040]/50 col-span-6  mb-10 rounded-sm">
            <ProductPOS />
          </div>
        </div>
      </CounterProvider>
    </div>
  );
}

export default Page;







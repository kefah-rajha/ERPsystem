import React from "react";
import Loginform from "@/components/authComponent/Login-form";

function page() {
  return (
    <>
      <div className="h-20 w-full bg-[#272727] barShadow flex justify-center items-center">
        <h3 className="text-4xl font-bold">
          <span className="font-light">ERP</span>system
        </h3>
      </div>
      <div className=" bg-gradient  grid grid-cols-1 lg:grid-cols-2  heighWithOutBar">
        <div className="flex justify-center items-center h-full w-full  ">
          <Loginform />
        </div>
        <div className="w-50  lg:flex flex-col justify-center m-auto h-full hidden">
          <h2 className="xl:text-[96px] text-[80px] font-bold bg-gradient-to-r from-foreground to-gray-700  leading-none text-transparent bg-clip-text">
            ERPsystem
          </h2>
          <p className="text-[20px] text-[#8D8787] pl-2 mt-4">
            Manage Everything From One Place
          </p>
        </div>
      </div>
    </>
  );
}

export default page;

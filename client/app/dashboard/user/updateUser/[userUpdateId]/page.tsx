"use client";
import CreateProfileInfo from "@/components/user/createUserComponent/createUserProfile";
import CreateContantInfo from "@/components/user/createUserComponent/createContanctInfo";
import { Button } from "@/components/ui/button";
import CreateCompanyInfo from "@/components/user/createUserComponent/createCompanyInfo";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import ContanctInfo from "@/components/profile/ContanctInfo";
import CompanyInfo from "@/components/profile/companyInfo";
import InfoDone from "@/components/profile/infoDone";
import { json } from "stream/consumers";
import { responseUserInfo } from "@/dataType/dataTypeProfile/dataTypeProfile";
import UpdateProfileInfo from "@/components/user/updateUserComponent/UpdateProfileInfo"
import UpdateContanctInfo from "@/components/user/updateUserComponent/updateContanctInfo";
import UpdatecompanyInfo from "@/components/user/updateUserComponent/updateCompanyInfo"


function UpdateUser() {
  const [step, setStep] = React.useState<number>(1);
 const router = useRouter();
  const pathname = usePathname();
  const id = pathname?.split("/").pop();
  const stepsHandle = (stepButton: number) => {
    setStep(stepButton);
  };

  return (
    <div className="container bg-gradient heighWithOutBar pt-2 overflow-auto pb-10 ">
              <h1 className="text-4xl font-bold my-5">Update User</h1>

      <div className="flex items-center rounded-sm justify-between w-full h-16 bg-[#2F2F2F]  container">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-extrabold text-[#C2C2C2]">
            {(step == 1 && "Profile") ||
              (step == 2 && "Contact Info") ||
              (step == 3 && "Company Info")}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="bg-[#3A3A3A] h-10 hover:bg-[#6e6e6e]  w-8 transition-colors	"
          >
            <ChevronLeft className="w-6 h-6 text-[#2F2F2F]" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-[#3C3C3C] h-10 hover:bg-[#6e6e6e]  w-8 transition-colors	"
          >
            <ChevronRight className="w-6 h-6 text-[#0A0A0A]" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-24">
        <div className="flex items-center justify-between w-full max-w-md">
          <div
            className="relative flex flex-col items-center cursor-pointer"
            onClick={() => stepsHandle(1)}
          >
            <div
              className={cn(
                step == 1
                  ? "bg-[#BD9B76] text-white border border-foreground"
                  : "bg-[#826F5A] text-[#D7D7D7]",
                "font-medium rounded-full flex items-center justify-center w-6 h-6"
              )}
            >
              1
            </div>
          </div>
          <div className="relative flex-1">
            <div className="absolute  inset-0 bg-gradient-to-r from-[#ffffff] to-transparent h-[1px] rounded-full" />
          </div>
          <div
            className="relative flex flex-col items-center cursor-pointer"
            onClick={() => stepsHandle(2)}
          >
            <div
              className={cn(
                step == 2
                  ? "bg-[#BD9B76] text-white border border-foreground"
                  : "bg-[#826F5A] text-[#D7D7D7]",
                "font-medium rounded-full flex items-center justify-center w-6 h-6"
              )}
            >
              2
            </div>
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-transparent h-[1px] rounded-full" />
          </div>
          <div
            className="relative flex flex-col items-center cursor-pointer"
            onClick={() => stepsHandle(3)}
          >
            <div
              className={cn(
                step == 3
                  ? "bg-[#BD9B76] text-white border border-foreground"
                  : "bg-[#826F5A] text-[#D7D7D7]",
                "font-medium rounded-full flex items-center justify-center w-6 h-6"
              )}
            >
              3
            </div>
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-transparent h-[1px] rounded-full" />
          </div>
          <div
            className="relative flex flex-col items-center cursor-pointer"
            onClick={() => stepsHandle(4)}
          >
            <div
              className={cn(
                step == 4
                  ? "bg-[#BD9B76] text-white border border-foreground"
                  : "bg-[#826F5A] text-[#D7D7D7]",
                "font-medium rounded-full flex items-center justify-center w-6 h-6"
              )}
            >
              <Check className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

       <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: step === 1 ? 1 : 0, y: 0 }}
        transition={{ duration: 1 }}
      >
        {step == 1 && id && <UpdateProfileInfo id={id} stepsHandle={stepsHandle} />}
      </motion.div>
       <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: step === 2 ? 1 : 0, y: 0 }}
        transition={{ duration: 1 }}
      >
        {step == 2 && id && <UpdateContanctInfo id={id} stepsHandle={stepsHandle} />}
      </motion.div>
     
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: step === 3 ? 1 : 0, y: 0 }}
          transition={{ duration: 1 }}
        >
          {step == 3 && id &&<UpdatecompanyInfo id={id} stepsHandle={stepsHandle} />}
        </motion.div>
      
    
    </div>
  );
}

export default UpdateUser;

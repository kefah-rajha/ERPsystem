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
import InfoDone from "@/components/profile/infoDone";
import { json } from "stream/consumers";
import CreateSupplierForm from "@/components/supplier/createSupplierForm"

function CreateSupplier() {
  const [step, setStep] = React.useState<number>(1);

 

  return (
    <div className="container bg-gradient heighWithOutBar pt-2 overflow-auto pb-10 ">
      
     
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: step === 1 ? 1 : 0, y: 0 }}
        transition={{ duration: 1 }}
      >
         <CreateSupplierForm  />
      </motion.div>
     
      
      
    </div>
  );
}

export default CreateSupplier;

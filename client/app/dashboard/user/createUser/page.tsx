"use client";
import CreateProfileInfo from "@/components/user/createUserComponent/createUserProfile";
import CreateContantInfo from "@/components/user/createUserComponent/createContanctInfo";
import { Button } from "@/components/ui/button";
import CreateCompanyInfo from "@/components/user/createUserComponent/createCompanyInfo";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
ArrowLeftIcon,
  ArrowRightIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Users2,
} from "lucide-react";

import toast, { Toaster } from 'react-hot-toast';
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import ContanctInfo from "@/components/profile/ContanctInfo";
import CompanyInfo from "@/components/profile/companyInfo";
import InfoDone from "@/components/profile/infoDone";
import { json } from "stream/consumers";
import { responseUserInfo } from "@/dataType/dataTypeProfile/dataTypeProfile";

function CreateUser() {
  const [step, setStep] = React.useState<number>(1);
  const router = useRouter();


  useEffect(() => {
    localStorage.setItem("idNewUser", "");
  }, []);

  // Add a function to check if user can proceed
  const canProceedToNextSteps = () => {
    const idNewUser = localStorage.getItem("idNewUser");
    return idNewUser && idNewUser.trim() !== "";
  };

  // Modify the step handler to check validation
  const stepsHandle = (newStep: any) => {
    if (newStep !== 1 && !canProceedToNextSteps()) {
      // Prevent navigation if idNewUser is empty and trying to go past step 1
      // alert("Please complete profile information first");
      toast.error( "Please Complete Profile Information First");

      return;
    }

    setStep(newStep);
  };
  return (
    <div className="container bg-gradient heighWithOutBar pt-2 overflow-auto pb-10 ">
       <Toaster
                    position="top-right" // Or your preferred position
                    reverseOrder={false} // Or your preferred order
                    gutter={8} // Spacing
                    toastOptions={{
                      // Default options for all types
                      className: 'card-gradient', // You can add common classes here
                      duration: 5000, // Default duration
                      style: {
                        background: '#363636', // Default background (optional, if you want a base)
                        color: '#fff',      // Default text color
                      },
            
            
                    }}
                  />
      <h1 className="text-4xl font-bold my-5">Create User</h1>
      <div className="flex items-center rounded-sm justify-between w-full h-16 bg-[#2F2F2F] container">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-extrabold text-[#C2C2C2]">
            {(step == 1 && "Profile") ||
              (step == 2 && "Contact Info") ||
              (step == 3 && "Company Info") ||
              (step == 4 && "Confirmation")}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="bg-[#3A3A3A] h-10 hover:bg-[#6e6e6e] w-8 transition-colors"
            onClick={() => step > 1 && stepsHandle(step - 1)}
            disabled={step === 1}
          >
            <ChevronLeft className="w-6 h-6 text-[#2F2F2F]" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-[#3C3C3C] h-10 hover:bg-[#6e6e6e] w-8 transition-colors"
            onClick={() => step < 4 && stepsHandle(step + 1)}
            disabled={step === 4 || (!canProceedToNextSteps() && step === 1)}
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-transparent h-[1px] rounded-full" />
          </div>
          <div
            className={`relative flex flex-col items-center ${canProceedToNextSteps() ? "cursor-pointer" : "cursor-not-allowed"}`}
            onClick={() => stepsHandle(2)}
          >
            <div
              className={cn(
                step == 2
                  ? "bg-[#BD9B76] text-white border border-foreground"
                  : canProceedToNextSteps()
                    ? "bg-[#826F5A] text-[#D7D7D7]"
                    : "bg-red-500 text-[#D7D7D7]",
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
            className={`relative flex flex-col items-center ${canProceedToNextSteps() ? "cursor-pointer" : "cursor-not-allowed"}`}
            onClick={() => stepsHandle(3)}
          >
            <div
              className={cn(
                step == 3
                  ? "bg-[#BD9B76] text-white border border-foreground"
                  : canProceedToNextSteps()
                    ? "bg-[#826F5A] text-[#D7D7D7]"
                    : "bg-red-500 text-[#D7D7D7]",
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
            className={`relative flex flex-col items-center ${canProceedToNextSteps() ? "cursor-pointer" : "cursor-not-allowed"}`}
            onClick={() => stepsHandle(4)}
          >
            <div
              className={cn(
                step == 4
                  ? "bg-[#BD9B76] text-white border border-foreground"
                  : canProceedToNextSteps()
                    ? "bg-[#826F5A] text-[#D7D7D7]"
                    : "bg-red-500 text-[#D7D7D7]",
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
        {step == 1 && <CreateProfileInfo stepsHandle={stepsHandle} />}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: step === 2 ? 1 : 0, y: 0 }}
        transition={{ duration: 1 }}
      >
        {step == 2 && <CreateContantInfo stepsHandle={stepsHandle} />}
      </motion.div>
      {
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: step === 3 ? 1 : 0, y: 0 }}
          transition={{ duration: 1 }}
        >
          {step == 3 && <CreateCompanyInfo stepsHandle={stepsHandle} />}
        </motion.div>
      }

{step == 4 &&  (
          <div className="w-full flex items-center justify-center">
               <div className="text-center p-8">
              <Users2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Update is done </h3>
              <p className="mt-1 text-sm text-gray-500">
                Click To Show All User 
              </p>
              <div className="mt-6">
              <Button className='h-10 rounded-sm   text-foreground card-gradient  hover:text-gray-400 '
           onClick={()=>router.push("/dashboard/user")}
           >
             <UserPlus className='h-4 w-4 mr-2 text-green-300 ' />
             Showing All User</Button>
              </div>
            </div>
           </div>
        )}
    </div>
  );
}

export default CreateUser;

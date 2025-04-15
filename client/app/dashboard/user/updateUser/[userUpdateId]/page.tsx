"use client";
import { Button } from "@/components/ui/button";
import {
  
  Check,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Users2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import UpdateProfileInfo from "@/components/user/updateUserComponent/UpdateProfileInfo";
import UpdateContanctInfo from "@/components/user/updateUserComponent/updateContanctInfo";
import UpdatecompanyInfo from "@/components/user/updateUserComponent/updateCompanyInfo";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast

function UpdateUser() {
  // State to manage the current step in the update process
  const [step, setStep] = React.useState<number>(1);
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract user ID from the URL
  const id = pathname?.split("/").pop();

  // Function to handle step navigation
  const stepsHandle = (stepButton: number) => {
    setStep(stepButton);
    
    // Display toast notification on step change
   
  };

  // Handle back navigation with toast
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      toast.success("Moved to previous step", {
        duration: 2000,
        position: 'top-right',
      });
    } else {
      toast.error("Already at first step", {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

  // Handle forward navigation with toast
  const handleForward = () => {
    if (step < 4) {
      setStep(step + 1);
      toast.success("Moved to next step", {
        duration: 2000,
        position: 'top-right',
      });
    } else {
      toast.error("Already at last step", {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

  return (
    <div className="container bg-gradient heighWithOutBar pt-2 overflow-auto pb-10 ">
      {/* Toast container for notifications */}
      <Toaster />
      
      {/* Page title */}
      <h1 className="text-4xl font-bold my-5">Update User</h1>

      {/* Header navigation bar */}
      <div className="flex items-center rounded-sm justify-between w-full h-16 bg-[#2F2F2F] container">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-extrabold text-[#C2C2C2]">
            {(step == 1 && "Profile") ||
              (step == 2 && "Contact Info") ||
              (step == 3 && "Company Info")}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Back button */}
          <Button
            variant="secondary"
            size="icon"
            className="bg-[#3A3A3A] h-10 hover:bg-[#6e6e6e] w-8 transition-colors"
            onClick={handleBack}
          >
            <ChevronLeft className="w-6 h-6 text-[#0A0A0A]" />
          </Button>
          {/* Forward button */}
          <Button
            variant="secondary"
            size="icon"
            className="bg-[#3C3C3C] h-10 hover:bg-[#6e6e6e] w-8 transition-colors"
            onClick={handleForward}
          >
            <ChevronRight className="w-6 h-6 text-[#0A0A0A]" />
          </Button>
        </div>
      </div>

      {/* Step progress indicator */}
      <div className="flex items-center justify-center w-full h-24">
        <div className="flex items-center justify-between w-full max-w-md">
          {/* Step 1 indicator */}
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
          {/* Connector line */}
          <div className="relative flex-1">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-transparent h-[1px] rounded-full" />
          </div>
          {/* Step 2 indicator */}
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
          {/* Connector line */}
          <div className="relative flex-1">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-transparent h-[1px] rounded-full" />
          </div>
          {/* Step 3 indicator */}
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
          {/* Connector line */}
          <div className="relative flex-1">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-transparent h-[1px] rounded-full" />
          </div>
          {/* Completion indicator */}
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

      {/* Step 1: Profile Information Form with animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: step === 1 ? 1 : 0, y: 0 }}
        transition={{ duration: 1 }}
      >
        {step == 1 && id && (
          <UpdateProfileInfo 
            id={id} 
            stepsHandle={stepsHandle} 
          />
        )}
      </motion.div>

      {/* Step 2: Contact Information Form with animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: step === 2 ? 1 : 0, y: 0 }}
        transition={{ duration: 1 }}
      >
        {step == 2 && id && (
          <UpdateContanctInfo 
            id={id} 
            stepsHandle={stepsHandle} 
          />
        )}
      </motion.div>
     
      {/* Step 3: Company Information Form with animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: step === 3 ? 1 : 0, y: 0 }}
        transition={{ duration: 1 }}
      >
        {step == 3 && id && (
          <UpdatecompanyInfo 
            id={id} 
            stepsHandle={stepsHandle} 
          />
        )}
      </motion.div>
     
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

export default UpdateUser;
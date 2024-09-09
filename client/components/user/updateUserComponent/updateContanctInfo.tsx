"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import Image from "next/image";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MapPinHouse,
  Globe,
  UsersRound,
  ArrowBigRightDash,
  Mail,
  Brush,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { isValidPhoneNumber } from "react-phone-number-input";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Key } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PhoneInput } from "@/components/ui/phone-input";

import { UpdateContactInfo } from "@/lib/profileFetch/profileUpdate";
import { responseUserInfo } from "@/dataType/dataTypeProfile/dataTypeProfile";
import { responseContanctInfo } from "@/dataType/dataTypeProfile/dataTypeProfile";
import { useRouter } from "next/navigation";

interface dataType {
  id:string;
  stepsHandle: (stepButton: number) => void;
}

function UpdateContanctInfo({ id, stepsHandle }: dataType) {
  

  const [phone, setPhone] = useState("");
  const [contatcInfo, setContantInfo] = useState<responseContanctInfo>({
    userId: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    postCode: "",
    city: "",
    street: "",
  });
  const { push } = useRouter();
  useEffect(() => {
    let ignore = false;
    fetch(`/api/profile/contactInfo/${id}`)
      .then((res) => {
        
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData, "setUser contantINFO");

          setContantInfo(jsonData.data);
        }
      })
      .catch((err: unknown) => {
        console.log(err);
      })
      .finally(() => {
        if (!ignore) {
          console.log("noLoding");
        }
      });
    return () => {
      ignore = true;
    };
  }, [id]);
  !contatcInfo && null

  const profileFormSchema = z.object({
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: "Invalid phone number" })
      .or(z.literal("")),
    email: z.string(),
    address: z.string().min(5, {
      message: "Name must be  More 5 characters .",
    }),
    website: z.string(),
    postCode: z.string(),
    city: z.string(),
    street: z.string(),
  });
  type profileFormValues = z.infer<typeof profileFormSchema>;
  console.log(contatcInfo?.phone, "contatcInfo?.phone,");
  
  const form = useForm<profileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      phone: contatcInfo?.phone,
      email:contatcInfo?.email ,
      address:contatcInfo?.address,
      website: contatcInfo.website,
      postCode: contatcInfo.postCode,
      city: contatcInfo.city,
      street: contatcInfo.street,
    },
    
  });
  async function onSubmit(dataForm: profileFormValues) {
    console.log(dataForm, "test....");

    const updateDataProfileInfo = await UpdateContactInfo(
      dataForm,
      `/api/profile/contactInfo/${id}`
    );

    console.log(updateDataProfileInfo);
    if (updateDataProfileInfo.success == true) {
      toast({
        variant: "default",
        title: "Congratulations✅.",
        description: updateDataProfileInfo?.message,
      });
      stepsHandle(3);
    } else {
      toast({
        variant: "custum",
        title: "Uh oh! Something went wrong.❌",
        description: (
          <p className="mt-2  rounded-md text-foreground/75 whitespace-pre-line p-4 w-full">
            {updateDataProfileInfo.message}
          </p>
        ),
        action: <ToastAction altText="Goto schedule to undo">Yes</ToastAction>,
      });
    }
  }

  return (
    <div className="flex ">
      <div className="w-2/3 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-11/12">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex relative  flex-col items-start">
                  <Phone className="absolute top-[55%]  translate-y-[-50%] right-4  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                  <FormControl className="w-full">
                    <PhoneInput
                      placeholder="Phone Number"
                      autoComplete="off"
                      {...field}
                      className="w-full  pr-4 py-2  border h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:focus:bg-[#302f2f]"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative mb-2 ">
                  <Mail className="absolute top-[50%]  translate-y-[-50%] right-4  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="off"
                      {...field}
                      className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:focus:bg-[#302f2f]"
                    />
                  </FormControl>
                  <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="relative mb-2 ">
                  <MapPinHouse className="absolute right-4 top-[50%] translate-y-[-50%]  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                  <FormControl>
                    <Input
                      placeholder="Address"
                      autoComplete="off"
                      {...field}
                      className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 file:text-red-600 focus:bg-[#302f2f] file:bg-[#302f2f] "
                    />
                  </FormControl>
                  <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                </FormItem>
              )}
            />
            <div className="flex gap-2 w-full">
              <FormField
                control={form.control}
                name="postCode"
                render={({ field }) => (
                  <FormItem className="relative  ">
                    <FormControl>
                      <Input
                        placeholder="Post Code"
                        autoComplete="off"
                        {...field}
                        className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 file:text-red-600 focus:bg-[#302f2f] file:bg-[#302f2f] "
                      />
                    </FormControl>
                    <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="relative  ">
                    <FormControl>
                      <Input
                        placeholder="City"
                        autoComplete="off"
                        {...field}
                        className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 file:text-red-600 focus:bg-[#302f2f] file:bg-[#302f2f] "
                      />
                    </FormControl>
                    <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="relative  ">
                    <FormControl>
                      <Input
                        placeholder="Street"
                        autoComplete="off"
                        {...field}
                        className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 file:text-red-600 focus:bg-[#302f2f] file:bg-[#302f2f] "
                      />
                    </FormControl>
                    <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="relative mb-2 ">
                  <Globe className="absolute right-4 top-[50%] translate-y-[-50%]  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                  <FormControl>
                    <Input
                      placeholder="Website"
                      autoComplete="off"
                      {...field}
                      className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 file:text-red-600 focus:bg-[#302f2f] file:bg-[#302f2f] "
                    />
                  </FormControl>
                  <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                </FormItem>
              )}
            />

            <Button
              className="w-full mt-4 h-14 transition-colors buttom-gradient text-foreground text-[20px] font-medium hover:brightness-90 color-"
              type="submit"
            >
              Save & Next <ArrowBigRightDash />
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex justify-end w-1/3">
        <div className="w-3/4 16/9 h-fit relative rounded-full	overflow-hidden ">
          <div className="absolute   w-full h-1/4 bottom-0 right-0 flex justify-center items-center ">
            <div className="h-full absolute bottom-0 right-0 w-full bg-[rgba(1,1,1,0.5)] blur-lg scale-120 "></div>
            <Brush className="z-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateContanctInfo;

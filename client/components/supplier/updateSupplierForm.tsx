"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import Image from "next/image";
import { string, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserContext } from "@/context/userContext";
import { isValidPhoneNumber } from "react-phone-number-input";

import {
  UserRound,
  UsersRound,
  ArrowBigRightDash,
  Brush,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Key, Phone, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UpdateProfile } from "@/lib/profileFetch/profileUpdate";
import { responseUserInfo } from "@/dataType/dataTypeProfile/dataTypeProfile";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { AllSupplierResponse } from "@/dataType/dataTypeSupplier/dataTypeSupplier";
import { SupplierContext } from "@/context/supplierContext";

interface UpdateSupplierDataType {
  id: string;
}
function UpdateSupplierForm({ id }: UpdateSupplierDataType) {
  const { toast } = useToast();
  const supplierContext = useContext(SupplierContext);

  // push for route the user to /dashboard   If he logged in correctly
  const { push } = useRouter();
  const [date, setDate] = React.useState<Date>();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState<AllSupplierResponse>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    website: "",
    companyName: "",
    defaultTax: "",
    phone: "",
    mailingAddress: "",
    postCodeMiling: "",
    cityMiling: "",
    streetMiling: "",
    mailingCountry: "",
    address: "",
    postCode: "",
    city: "",
    street: "",
    country: "",
  });
  useEffect(() => {
    let ignore = false;
    fetch(`/api/supplier/getSupplier/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData, "INFO");

          setData(jsonData.data);
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
  }, [id, push]);

  const profileFormSchema = z.object({
    firstName: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(30, {
        message: "Name must not be longer than 30 characters.",
      }),
    lastName: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(30, {
        message: "Name must not be longer than 30 characters.",
      }),
    email: z.string().email(),
    website: z.string(),
    companyName: z.string(),
    defaultTax: z.string(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: "Invalid phone number" })
      .or(z.literal("")),
    mailingAddress: z.string(),
    postCodeMiling: z.string(),
    cityMiling: z.string(),
    streetMiling: z.string(),
    mailingCountry: z.string(),
    address: z.string(),
    postCode: z.string(),
    city: z.string(),
    street: z.string(),
    country: z.string(),
  });
  type profileFormValues = z.infer<typeof profileFormSchema>;

  const form = useForm<profileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      website: data?.website,
      companyName: data?.companyName,
      defaultTax: data?.defaultTax,
      phone: data?.phone,
      mailingAddress: data?.mailingAddress,
      postCodeMiling: data?.postCodeMiling,
      cityMiling: data?.cityMiling,
      streetMiling: data?.streetMiling,
      mailingCountry: data?.mailingCountry,
      address: data?.address,
      postCode: data?.postCode,
      city: data?.city,
      street: data?.street,
      country: data?.country,
    },
  });
  async function onSubmit(dataForm: profileFormValues) {
    console.log(dataForm);
    const fetchData = await fetch(`/api/supplier/UpdateSupplier/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(dataForm),
    });
    const UpdateDataSupplier = await fetchData.json();

    if (UpdateDataSupplier.success == true) {
      toast({
        variant: "default",
        title: "Congratulations✅.",
        description: UpdateDataSupplier?.message,
      });

      supplierContext?.setSupplier((prevUser)=>{

        return prevUser.map((supplier) => {
 
         if (supplier._id === UpdateDataSupplier.data._id) {
           return UpdateDataSupplier.data
         } else {
           return supplier;
         }})
   
       });
 
    } else {
      toast({
        variant: "custum",
        title: "Uh oh! Something went wrong.❌",
        description: (
          <p className="mt-2  rounded-md text-foreground/75 whitespace-pre-line p-4 w-full">
            {UpdateDataSupplier.message}
          </p>
        ),
        action: <ToastAction altText="Goto schedule to undo">Yes</ToastAction>,
      });
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-11/12">
          <div className="flex gap-8">
            <div className="w-1/2 ">
              <p className="text-foreground/20 mb-4">Basic Information</p>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="relative mb-2 ">
                    <UsersRound className="absolute top-[50%]  translate-y-[-50%] right-4  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                    <FormControl>
                      <Input
                        placeholder="First Name"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem className="relative mb-2 ">
                    <UsersRound className="absolute top-[50%]  translate-y-[-50%] right-4  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                    <FormControl>
                      <Input
                        placeholder="Last Name"
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
                name="email"
                render={({ field }) => (
                  <FormItem className="relative mb-2 ">
                    <Mail className="absolute top-[50%]  translate-y-[-50%] right-4  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                    <FormControl>
                      <Input
                        placeholder="Email"
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
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="relative mb-2 ">
                    <UsersRound className="absolute top-[50%]  translate-y-[-50%] right-4  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                    <FormControl>
                      <Input
                        placeholder="Company Name"
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
              <p className="text-foreground/20 mb-2 mt-4">Tax</p>
              <FormField
                control={form.control}
                name="defaultTax"
                render={({ field }) => (
                  <FormItem className="relative mb-2 ">
                    <FormControl>
                      <Input
                        placeholder="Default Tax"
                        autoComplete="off"
                        type="number"
                        {...field}
                        className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 file:text-red-600 focus:bg-[#302f2f] file:bg-[#302f2f] "
                      />
                    </FormControl>
                    <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full mt-4 h-14 transition-colors buttom-gradient text-foreground text-[20px] font-medium hover:brightness-90 "
                type="submit"
              >
                Save & Next <ArrowBigRightDash />
              </Button>
            </div>
            <div className=" flex justify-start w-1/2">
              <div className="w-full">
                <p className="text-foreground/20 mb-4 ">Mailing Informatio</p>
                <FormField
                  control={form.control}
                  name="mailingAddress"
                  render={({ field }) => (
                    <FormItem className="relative mb-2 ">
                      <FormControl>
                        <Input
                          placeholder="Mailing Address"
                          autoComplete="off"
                          type="number"
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
                  name="mailingCountry"
                  render={({ field }) => (
                    <FormItem className="relative mb-2 ">
                      <FormControl>
                        <Input
                          placeholder="Mailing Country"
                          autoComplete="off"
                          type="number"
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
                    name="postCodeMiling"
                    render={({ field }) => (
                      <FormItem className="relative  ">
                        <FormControl>
                          <Input
                            placeholder="Post Code Miling"
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
                    name="cityMiling"
                    render={({ field }) => (
                      <FormItem className="relative  ">
                        <FormControl>
                          <Input
                            placeholder="City Miling"
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
                    name="streetMiling"
                    render={({ field }) => (
                      <FormItem className="relative  ">
                        <FormControl>
                          <Input
                            placeholder="Street Miling"
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
                <p className="text-foreground/20 mt-4 mb-2 ">
                  Physical Informatio
                </p>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="relative mb-2 ">
                      <FormControl>
                        <Input
                          placeholder="Address"
                          autoComplete="off"
                          type="number"
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
                  name="country"
                  render={({ field }) => (
                    <FormItem className="relative mb-2 ">
                      <FormControl>
                        <Input
                          placeholder=" Country"
                          autoComplete="off"
                          type="number"
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
                            placeholder="Post Code "
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
                            placeholder="City "
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
                            placeholder="Street "
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
              </div>
            </div>
          </div>{" "}
        </form>
      </Form>
    </>
  );
}

export default UpdateSupplierForm;

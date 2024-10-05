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
import { UserRound, UsersRound, ArrowBigRightDash, Brush } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Key } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {UserContext}from "@/context/userContext"


interface dataType {
  id: string;
  stepsHandle: (stepButton: number) => void;
}
function UpdateProfileInfo({ id, stepsHandle }: dataType) {
  const { toast } = useToast();
  const userContext=useContext(UserContext)

  // push for route the user to /dashboard   If he logged in correctly
  const { push } = useRouter();
  const [date, setDate] = React.useState<Date>();
  const [data, setData] = useState<responseUserInfo>({
    _id: "",
    userName: "",
    name: "",
    password: "",
    Brithday: "",
  });
  useEffect(() => {
    let ignore = false;
    fetch(`/api/profile/getProfileInfo/${id}`)
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
  useEffect(() => {
    setDate(data?.Brithday);
  }, [data]);

  const profileFormSchema = z.object({
    userName: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(30, {
        message: "Name must not be longer than 30 characters.",
      }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    password: z.string().min(5, {
      message: "Name must be  More 5 characters .",
    }),
    Brithday: z.any(),
  });
  type profileFormValues = z.infer<typeof profileFormSchema>;

  const form = useForm<profileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      userName: data?.userName,
      password: data?.password,
      Brithday: new Date("1991-08-01"),
      name: data?.name,
    },
  });
  async function onSubmit(dataForm: profileFormValues) {
    dataForm.Brithday = date;
    console.log(typeof dataForm.Brithday, "test....");

    const updateDataProfileInfo = await UpdateProfile(
      dataForm,
      `/api/profile/UpdateprofileInfo/${data._id}`
    );

    console.log(updateDataProfileInfo);
    if (updateDataProfileInfo.success == true) {
      toast({
        variant: "default",
        title: "Congratulations✅.",
        description: updateDataProfileInfo?.message,
      });
      stepsHandle(2);
      userContext?.setUsers((prevUser)=>{

       return prevUser.map((user) => {

        if (user._id === updateDataProfileInfo.data._id) {
        console.log(updateDataProfileInfo?.data,"scsc")
          return updateDataProfileInfo.data
        } else {
          return user;
        }})
  
      });

      
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
  console.log(data?.name, "dwd");
  return (
    <>
      <div className="flex">
        <div className="w-2/3 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-11/12">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem className="relative mb-2 ">
                    <UsersRound className="absolute top-[50%]  translate-y-[-50%] right-4  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                    <FormControl>
                      <Input
                        placeholder="Your name"
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
                name="name"
                render={({ field }) => (
                  <FormItem className="relative mb-2 ">
                    <UserRound className="absolute top-[50%]  translate-y-[-50%] right-4  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                    <FormControl>
                      <Input
                        placeholder="name"
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
                name="password"
                render={({ field }) => (
                  <FormItem className="relative mb-2 ">
                    <Key className="absolute right-4 top-[50%] translate-y-[-50%]  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                    <FormControl>
                      <Input
                        placeholder="Password"
                        autoComplete="off"
                        {...field}
                        className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 file:text-red-600 focus:bg-[#302f2f] file:bg-[#302f2f] "
                      />
                    </FormControl>
                    <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                  </FormItem>
                )}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 pr-4 py-2  flex justify-between h-14 rounded-md  inputCustom hover:bg-[#302f2f]",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Brithday</span>}

                    <CalendarIcon className=" h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <input
                    type="date"
                    onChange={(e: any) => setDate(e.target.value)}
                  />
                </PopoverContent>
              </Popover>

              <Button
                className="w-full mt-4 h-14 transition-colors buttom-gradient text-foreground text-[20px] font-medium hover:brightness-90 "
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

            <Image
              alt="user photo"
              src="/noPhoto.jpg"
              width={300}
              height={300}
              className="aspect-square rounded-full	"
            />
          </div>
        </div>
      </div>{" "}
    </>
  );
}

export default UpdateProfileInfo;

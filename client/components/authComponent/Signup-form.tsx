"use client";
import React, { useEffect, useState } from "react";
import Cardsignup from "./Cardsignup";
import { useAuth } from '@/context/AuthContext';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Key, UserRound, Eye, Replace } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";
import { signupFetch } from "@/lib/action/actionFecth";
import { any, string } from "zod";
import { useToast } from "../ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";

const SignUpFormSchema = z.object({
  userName: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  password: z.string().min(5, {
    message: "Name must be  More 5 characters .",
  }),
  role :z.string().default("Customer")
});

function Signupform() {
   //toast for showing the result of the fetch data
   const { toast } = useToast();
   // push for route the user to /dashboard   If he logged in correctly
   const { replace } = useRouter();
 //for showing the password if he is true or disappear if he is false
   const [passwordShown, setPasswordShown] = useState(false);
   const { register, loading } = useAuth();

  type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
  });

  async function onSubmit(data: SignUpFormValues) {
    try{
      console.log(data,"data")
      data.role="Customer"

    await register(data);

    
  }catch(err:unknown){
      console.log(err)
    }
  }

  return (
    <div className="sm:w-8/12 w-11/12 ">
      <Cardsignup headContent="Sign Up " iHaveAcc="I Have An Accont">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem className="relative mb-4">
                  <UserRound className="absolute top-[50%]  translate-y-[-50%] right-3  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />

                  <FormControl>
                    <Input
                      placeholder="Your name"
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
                <FormItem className="relative ">
                  {field.value == "" && (
                    <Key className="absolute right-3 top-[50%] translate-y-[-50%]  text-gray-400 h-4 w-4 sm:h-5 sm:w-5 " />
                  )}
                  {field.value != "" && (
                    <Eye
                      onClick={() => setPasswordShown(prev=>!prev)}
                      
                      className="absolute right-3 cursor-pointer top-[50%] translate-y-[-50%]  text-gray-400 h-5 w-5"
                    />
                  )}

                  <FormControl>
                    <Input
                      placeholder="Password"
                      type={passwordShown ? "text" : "password"}
                      {...field}
                      className="w-full pl-3 pr-4 py-2   h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#302f2f]"
                    />
                  </FormControl>
                  <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                </FormItem>
              )}
            />
            

            <Button
              className="w-full mt-8 h-14 transition-colors buttom-gradient text-foreground text-[20px] font-medium hover:brightness-90 color-"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </Cardsignup>
    </div>
  );
}

export default Signupform;

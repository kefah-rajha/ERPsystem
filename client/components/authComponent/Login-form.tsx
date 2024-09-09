"use client";
import React, { useEffect, useState } from "react";
import CardLogin from "@/components/authComponent/Cardlogin";
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
import { Mail, Key, UserRound, Eye } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";
import { loginFetch } from "@/lib/action/actionFecth";
import { any, string } from "zod";
import { useToast } from "../ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";

const LoginFormSchema = z.object({
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
});

function Loginform() {
  //toast for showing the result of the fetch data
  const { toast } = useToast();
  // push for route the user to /dashboard   If he logged in correctly
  const { push } = useRouter();
//for showing the password if he is true or disappear if he is false
  const [passwordShown, setPasswordShown] = useState(false);

  type LoginFormValues = z.infer<typeof LoginFormSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  });
// function to action
  async function onSubmit(data: LoginFormValues) {
    // loginFetch is function that send the requst to server
    const LoginStatus = await loginFetch(data);
    if (LoginStatus.success == false) {
      toast({
        variant: "custum",
        title: "Uh oh! Something went wrong.❌",
        description: (
          <p className="mt-2  rounded-md text-foreground/75 whitespace-pre-line p-4 w-full">
            {LoginStatus.message}
          </p>
        ),
        action: <ToastAction altText="Goto schedule to undo">Yes</ToastAction>,
      });
    } else {
      toast({
        variant: "default",
        title: "Congratulations✅.",
        description: "login Is Done",
      });
      if (LoginStatus.refreash_token) {
        push("/dashboard");
      }
    }
  }

  return (
    <div className="sm:w-8/12 w-11/12 ">
      <CardLogin headContent="Login " iHaveAcc="Forget Your Password ??">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem className="relative mb-4">
                  <UserRound className="absolute top-[50%]  translate-y-[-50%] right-3  text-gray-400 h-4 w-4 sm:h-4 sm:w-4 " />
                 {/* inputCustom is custom css  that is in globals.css */}

                  <FormControl>
                    
                    <Input
                      placeholder="Your name"
                      {...field}
                      className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
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
                      // inputCustom is custom css  that is in globals.css
                      className="w-full pl-3 pr-4 py-2  autofill:bg-yellow-200  h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                    />
                  </FormControl>
                  <FormMessage className="text-foreground/65 pl-2 transition-transform" />
                </FormItem>
              )}
            />
            
            {/* buttom-gradient is custome css in globals.css */}
            <Button
              className="w-full mt-8 h-14 transition-colors buttom-gradient text-foreground text-[20px] font-medium hover:brightness-90 "
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardLogin>
    </div>
  );
}

export default Loginform;

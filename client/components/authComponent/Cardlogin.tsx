import React from "react";
interface cardLoginPropsType {
  headContent: string;
  iHaveAcc: string;
  children:React.ReactNode
}
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Headersignup from "./Headersignup";
import { Button } from "../ui/button";

const CardLogin = ({ headContent, iHaveAcc,children}: cardLoginPropsType) => {
  return (
    <Card className="rounded-[5px] border-none bg-foreground/06 shadow-[-7px_8px_1px_rgba(0,0,0,.25)]">
      <div className=" card-gradient">
      <CardHeader>
        <Headersignup content="Login"  />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="pl-6">
<Button
variant={"link"} className="text-[#ACACAC] pl-2 text-[16px] underline"
>{iHaveAcc}</Button>
      </CardFooter>
      </div>
    </Card>
  );
};
export default CardLogin;

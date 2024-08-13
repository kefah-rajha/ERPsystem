"use server";
import React from "react";
import { SignUpDataType } from "@/dataType/dataTypeAuth/dataTypeAuth";
import { LoginDataType } from "@/dataType/dataTypeAuth/dataTypeAuth";

import { z } from "zod";
const schema = z.object({
  username: z.string({
    invalid_type_error: "Invalid Email",
  }),
  password: z.string({
    invalid_type_error: "Invalid Email",
  }),
});

type FormState = {
  message: string;
};

const URLDATA = "http://localhost:4000";

interface loginError {
  message: any;
  success: false;
}

interface loginSuccess {
  refreash_token: string;
  success: true;
}

export async function loginFetch(
  formData: LoginDataType
): Promise<loginError | loginSuccess> {
  console.log(formData, "formDataLOgin");
  try {
    const fetchData = await fetch(`${URLDATA}/api/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(formData),
    });

    const res = await fetchData.json();
    console.log(res, "res");
    return res;
  } catch (erro: any) {
    console.log(erro.message);
    return {
      message: erro.message,
      success: false,
    };
  }
}
interface SignUpError {
  message: any;
  success: false;
}

interface SignUpSuccess {
  refreash_token: string;
  success: true;
}

export async function signupFetch(
  formData: SignUpDataType
): Promise<SignUpError | SignUpSuccess> {
  console.log(formData, "formData");
  try {
    const fetchData = await fetch(`${URLDATA}/api/SignUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(formData),
    });

    const res = await fetchData.json();
    console.log(res, "res");
    return res;
  } catch (erro: any) {
    console.log(erro.message);
    return {
      message: erro.message,
      success: false,
    };
  }
}

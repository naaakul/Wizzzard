"use client";

import React, { useState } from "react";
import GitButton from "@/components/gitButton";
import Link from "next/link";
import FormInput from "@/components/formInput";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full flex gap-5 flex-col text-center">
      <div>
        <p className="font-semibold text-3xl">Sign In Account</p>
        <p className="font-light text-xs text-zinc-500">
          Enter your details to sign in your account
        </p>
      </div>

      <GitButton />

      <div className=" w-full flex justify-center items-center gap-2 text-zinc-500">
        <div className="bg-zinc-500 w-full h-[1px]"></div>
        <p>or</p>
        <div className="bg-zinc-500 w-full h-[1px]"></div>
      </div>

      <FormInput
        label={"Email"}
        placeHolder={"eg. nakul@gmail.com"}
        setText={setEmail}
      />

      <FormInput
        label={"Password"}
        placeHolder={"Enter your password."}
        setText={setPassword}
      />

      <button className="w-full py-3 text-center bg-white rounded-lg">
        <p className="font-medium text-[#252328]">Sign in</p>
      </button>

      <p className="text-zinc-500">
        Don't have an account?
        <Link href={"/auth/signup"}>
          <span className="text-white"> Sign up </span>
        </Link>
      </p>
    </div>
  );
};

export default page;

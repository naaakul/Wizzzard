"use client";

import React, { useState } from "react";
import GitButton from "@/components/gitButton";
import Link from "next/link";
import FormInput from "@/components/formInput";

const page = () => {
  const [Fname, setFName] = useState("");
  const [Lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full flex gap-5 flex-col text-center">
      <div>
        <p className="font-semibold text-3xl">Sign Up Account</p>
        <p className="font-light text-xs text-zinc-500">
          Enter your details to create your account
        </p>
      </div>

      <GitButton />

      <div className=" w-full flex justify-center items-center gap-2 text-zinc-500">
        <div className="bg-zinc-500 w-full h-[1px]"></div>
        <p>or</p>
        <div className="bg-zinc-500 w-full h-[1px]"></div>
      </div>

      <div className="flex gap-5">
        <FormInput
          label={"First Name"}
          placeHolder={"eg. Nakul"}
          setText={setFName}
        />
        <FormInput
          label={"Last Name"}
          placeHolder={"eg. Chouksey"}
          setText={setLName}
        />
      </div>

      <FormInput
        label={"Email"}
        placeHolder={"eg. nakul@icloud.com"}
        setText={setEmail}
      />

      <FormInput
        label={"Password"}
        placeHolder={"Enter your password."}
        setText={setPassword}
      />

      <button className="w-full py-3 text-center bg-white rounded-lg">
        <p className="font-medium text-[#252328]">Sign up</p>
      </button>

      <p className="text-zinc-500">
        Already have an account?
        <Link href={"/auth/signin"}>
          <span className="text-white"> Sign in </span>
        </Link>
      </p>
    </div>
  );
};

export default page;

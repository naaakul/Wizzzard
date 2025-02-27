"use client";

import React, { useState } from "react";
import FormInput from "@/components/formInput";

const page = () => {
  const [name, setName] = useState("");

  return (
    <div className="w-full flex gap-5 flex-col text-center">
      <div>
        <p className="font-semibold text-3xl">Guest Account</p>
        <p className="font-light text-xs text-zinc-500">
          give it a username to create a guest account
        </p>
      </div>

      <FormInput
        label={"username"}
        placeHolder={"eg. naaakul"}
        setText={setName}
      />

      <button className="w-full py-3 text-center bg-white rounded-lg">
        <p className="font-medium text-[#252328]">Get Started</p>
      </button>
    </div>
  );
};

export default page;

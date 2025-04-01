"use client";

import React, { useState } from "react";
import FormInput from "@/components/formInput";
import { signInAsGuest } from "@/firebase/auth";
import { useRouter } from "next/navigation";

const Page = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGuestLogin = async () => {
    if (!name) {
      setError("Please provide a username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInAsGuest(name);
      router.push("/");
    } catch (error: any) {
      setError(error.message || "Failed to create guest account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex gap-5 flex-col text-center">
      <div>
        <p className="font-semibold text-3xl">Guest Account</p>
        <p className="font-light text-xs text-zinc-500">
          give it a username to create a guest account
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <FormInput
        value={name}
        label={"username"}
        placeHolder={"eg. naaakul"}
        setText={setName}
      />

      <button
        className={`w-full py-3 text-center bg-white rounded-lg ${
          loading ? "opacity-70" : ""
        }`}
        onClick={handleGuestLogin}
        disabled={loading}
      >
        <p className="font-medium text-[#252328]">
          {loading ? "Creating account..." : "Get Started"}
        </p>
      </button>
    </div>
  );
};

export default Page;

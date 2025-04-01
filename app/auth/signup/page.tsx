"use client";

import React, { useState } from "react";
import GitButton from "@/components/gitButton";
import GoogleButton from "@/components/googleButton";
import Link from "next/link";
import FormInput from "@/components/formInput";
import {
  // signUpWithEmail,
  signInWithGithub,
  signInWithGoogle,
} from "@/firebase/auth";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // const { user } = await signUpWithEmail(email, password);
    
      router.push("/auth/setup-username");
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        if (error.code === "auth/email-already-in-use") {
          setError("This email is already in use");
        } else {
          setError(error.message || "Failed to sign up");
        }
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
    
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { isNewUser } = await signInWithGithub();

      if (isNewUser) {
        router.push("/auth/setup-username");
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to sign in with GitHub");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { isNewUser } = await signInWithGoogle();

      if (isNewUser) {
        router.push("/auth/setup-username");
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to sign in with Google");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex gap-5 flex-col text-center">
      <div>
        <p className="font-semibold text-3xl">Sign Up Account</p>
        <p className="font-light text-xs text-zinc-500">
          Enter your details to create your account
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <div onClick={handleGithubSignIn} className="w-full">
          <GitButton />
        </div>
        <div onClick={handleGoogleSignIn} className="w-full">
          <GoogleButton />
        </div>
      </div>

      <div className="w-full flex justify-center items-center gap-2 text-zinc-500">
        <div className="bg-zinc-500 w-full h-[1px]"></div>
        <p>or</p>
        <div className="bg-zinc-500 w-full h-[1px]"></div>
      </div>

      <FormInput
        value={email}
        label={"Email"}
        placeHolder={"your.email@example.com"}
        setText={setEmail}
      />

      <FormInput
        value={password}
        label={"Password"}
        placeHolder={"Enter your password."}
        setText={setPassword}
      />

      <button
        className={`w-full py-3 text-center bg-white rounded-lg ${
          loading ? "opacity-70" : ""
        }`}
        onClick={handleSignUp}
        disabled={loading}
      >
        <p className="font-medium text-[#252328]">
          {loading ? "Signing up..." : "Sign up"}
        </p>
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

export default Page;

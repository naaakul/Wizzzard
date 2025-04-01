"use client";

import React, { useState, useEffect } from "react";
import FormInput from "@/components/formInput";
import { useAuth, saveUserData, isUsernameAvailable } from "@/firebase/auth";
import { useRouter } from "next/navigation";

const Page = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  const handleUsernameCheck = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    if (!usernameRegex.test(username)) {
      setError(
        "Username must be 3-15 characters and can only contain letters, numbers, and underscores"
      );
      return false;
    }

    setCheckingUsername(true);
    setError("");

    // try {
    //   const available = await isUsernameAvailable(username);
    //   if (!available) {
    //     setError("This username is already taken");
    //     return false;
    //   }
    //   return true;
    // } catch (error) {
    //   setError("Error checking username availability");
    //   return false;
    // } finally {
    //   setCheckingUsername(false);
    // }
    try {
      const available = await isUsernameAvailable(username);
      if (!available) {
        setError("This username is already taken");
        return false;
      }
      return true;
    } catch {
      setError("Error checking username availability");
      return false;
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    const isValid = await handleUsernameCheck();
    if (!isValid) return;

    setLoading(true);
    setError("");

    // try {
    //   await saveUserData(user, username);
    //   router.push("/");
    // } catch (error: any) {
    //   setError(error.message || "Failed to set username");
    // } finally {
    //   setLoading(false);
    // }
    try {
      await saveUserData(user, username);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to set username");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-5 flex-col text-center">
      <div>
        <p className="font-semibold text-3xl">Choose a Username</p>
        <p className="font-light text-xs text-zinc-500">
          This will be your unique identifier in the app
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <FormInput
        value={username}
        label={"Username"}
        placeHolder={"eg. naaakul"}
        setText={setUsername}
      />

      <p className="text-start text-sm text-zinc-500">
        Usernames must be between 3-15 characters and can only contain letters,
        numbers, and underscores.
      </p>

      <button
        className={`w-full py-3 text-center bg-white rounded-lg ${
          loading || checkingUsername ? "opacity-70" : ""
        }`}
        onClick={handleSubmit}
        disabled={loading || checkingUsername}
      >
        <p className="font-medium text-[#252328]">
          {loading
            ? "Setting username..."
            : checkingUsername
            ? "Checking availability..."
            : "Continue"}
        </p>
      </button>
    </div>
  );
};

export default Page;

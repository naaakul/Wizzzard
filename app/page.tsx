"use client";

import React, { useEffect } from "react";
import { useAuth, signOutUser, isGuestUser } from "@/firebase/auth";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/signin");
      } else if (!userData?.username) {
        router.push("/auth/setup-username");
      }
    }
  }, [user, userData, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !userData) return null;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold">Welcome, {userData.username}!</h1>

      {isGuestUser(user) ? (
        <p className="text-zinc-500">You are signed in as a guest.</p>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-zinc-500">
            You are signed in with{" "}
            {user.providerData[0]?.providerId.replace(".com", "") ||
              "email/password"}
            .
          </p>
          {user.email && <p className="text-zinc-500">Email: {user.email}</p>}
        </div>
      )}

      <button
        onClick={handleSignOut}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Page;

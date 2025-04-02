// app/game/page.tsx
"use client";

import React from "react";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GameDashboard = () => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !userData) return null;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Welcome, {userData.username}!</h1>
      
      <div className="w-full max-w-md flex flex-col gap-6">
        <Link href="/game/create">
          <div className="w-full py-4 text-center bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors">
            <p className="font-medium text-xl">Create Quiz</p>
          </div>
        </Link>
        
        <Link href="/game/join">
          <div className="w-full py-4 text-center bg-white hover:bg-gray-100 rounded-lg transition-colors">
            <p className="font-medium text-xl text-[#252328]">Join Quiz</p>
          </div>
        </Link>
      </div>
      
      <div className="mt-10">
        <Link href="/">
          <div className="px-6 py-2 text-center border border-zinc-700 rounded-lg">
            <p>Back to Home</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default GameDashboard;
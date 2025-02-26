"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {session ? (
        <>
          <h1>Welcome, {session.user?.name}!</h1>
          <button onClick={() => signOut()} className="p-2 bg-red-500 text-white">
            Sign Out
          </button>
        </>
      ) : (
        <>
          <h1>Please sign in</h1>
          <button onClick={() => signIn("github")} className="p-2 bg-blue-500 text-white">
            Sign in with GitHub
          </button>
        </>
      )}
    </div>
  );
}
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Bg from "../../components/background";
import WButton from "../../components/wButton";
import BButton from "../../components/bButton";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    // <div className="flex h-screen">
    //   {/* Left Panel - Navigation Buttons */}
    //   <div className="w-1/3 bg-gray-900 text-white flex flex-col items-center justify-center space-y-4">
    //     <Link href="/auth/register">
    //       <button className="w-40 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg">
    //         Register
    //       </button>
    //     </Link>
    //     <Link href="/auth/signin">
    //       <button className="w-40 py-2 bg-green-500 hover:bg-green-600 rounded-lg">
    //         Sign In
    //       </button>
    //     </Link>
    //     <Link href="/dashboard">
    //       <button className="w-40 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg">
    //         Guest
    //       </button>
    //     </Link>
    //   </div>

    //   {/* Right Panel - Dynamic Auth Form */}
    //   <div className="w-2/3 flex items-center justify-center">
    //     {children} {/* This will render either Register or Sign In form */}
    //   </div>
    // </div>

    <div className="w-full h-screen flex gap-3 p-3 bg-black">
      <div className="w-1/2 relative rounded-2xl overflow-hidden">
        <Bg />
        <div className="h-full w-full absolute flex flex-col justify-end items-center gap-3 pb-20">
          <Image
            src={"/t-logo.png"}
            alt="logo"
            width={1000}
            height={1000}
            className="w-20 mb-10"
          ></Image>
          {pathname === "/auth/register" ? (
            <>
              <Link href={"/auth/register"}>
                <WButton labal={"Register"} />
              </Link>
              <Link href={"/auth/signin"}>
                <BButton labal={"Sign in"} />
              </Link>
            </>
          ) : (
            <>
              <Link href={"/auth/register"}>
                <BButton labal={"Register"} />
              </Link>
              <Link href={"/auth/signin"}>
                <WButton labal={"Sign in"} />
              </Link>
            </>
          )}
          <BButton labal={"Continue as a guest"} />
        </div>
      </div>

      <div className="w-1/2">{children}</div>
    </div>
  );
}

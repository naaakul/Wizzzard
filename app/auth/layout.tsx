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
    <div className="w-full h-screen flex gap-3 p-3 bg-black">
      <div className="w-1/2 relative rounded-2xl overflow-hidden">
        <Bg />
        <div className="h-full w-full absolute flex flex-col justify-end items-center gap-3 pb-20">
          <Image
            src={"/t-logo.png"}
            alt="logo"
            width={1000}
            height={1000}
            className="w-16 mb-10"
          ></Image>
          {pathname === "/auth/signup" && (
            <>
              <Link href={"/auth/signup"}>
                <WButton labal={"Sign up"} />
              </Link>
              <Link href={"/auth/signin"}>
                <BButton labal={"Sign in"} />
              </Link>
              <Link href={"/auth/guest"}>
                <BButton labal={"Continue as a guest"} />
              </Link>
            </>
          )}

          {pathname === "/auth/signin" && (
            <>
              <Link href={"/auth/signup"}>
                <BButton labal={"Sign up"} />
              </Link>
              <Link href={"/auth/signin"}>
                <WButton labal={"Sign in"} />
              </Link>
              <Link href={"/auth/guest"}>
                <BButton labal={"Continue as a guest"} />
              </Link>
            </>
          )}

          {pathname === "/auth/guest" && (
            <>
              <Link href={"/auth/signup"}>
                <BButton labal={"Sign up"} />
              </Link>
              <Link href={"/auth/signin"}>
                <BButton labal={"Sign in"} />
              </Link>
              <Link href={"/auth/guest"}>
                <WButton labal={"Continue as a guest"} />
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="w-1/2 px-32 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}

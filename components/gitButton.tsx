import React from 'react'
import Image from "next/image"
import { signIn } from "next-auth/react";


const gitButton = () => {
  return (
    <button onClick={() => signIn("github")} className='flex w-full border-2 border-zinc-800 font-medium rounded-lg py-3 items-center justify-center gap-3'>
        <Image src={"/git.svg"} alt={"logo"} height={200} width={200} className='w-5'></Image>
        <p className='font-medium'>GitHub</p>
    </button>
  )
}

export default gitButton
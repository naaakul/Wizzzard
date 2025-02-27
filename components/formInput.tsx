import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const FormInput = ({ label, placeHolder, setText }: { 
  label: string; 
  placeHolder: string; 
  setText: (text: string) => void;
}) => {
  const pathname = usePathname();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='w-full flex flex-col gap-1 relative'>
      <p className='text-start'>{label}</p>
      
      <div className="relative w-full">
        <input 
          className='w-full p-3 bg-[#1A1A1A] rounded-lg pr-12' 
          type={label === "Password" && !showPassword ? "password" : "text"}
          placeholder={placeHolder} 
          onChange={(e) => setText(e.target.value)}
        />
        
        {label === "Password" && (
          <button 
            type="button" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image 
              src={showPassword ? "/openEye.svg" : "/closeEye.svg"} 
              alt="Toggle Password Visibility"
              width={20} 
              height={20} 
            />
          </button>
        )}
      </div>

      {((label === "Password") && (pathname === "/auth/signup")) && (
        <p className='text-start text-sm text-zinc-500'>Must be at least 8 characters.</p>
      )}
    </div>
  );
};

export default FormInput;

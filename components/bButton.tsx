import React from 'react'

const Button = ({labal}: {labal: string}) => {
  return (
    <div className="w-72 py-3 text-center bg-[#252328] rounded-lg">
        <p className='text-white'>{labal}</p>
    </div>
  )
}

export default Button
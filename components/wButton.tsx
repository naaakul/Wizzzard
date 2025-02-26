import React from 'react'

const Button = ({labal}: {labal: string}) => {
  return (
    <div className="w-72 py-3 text-center bg-white rounded-lg">
        <p className='font-medium text-[#252328]'>{labal}</p>
    </div>
  )
}

export default Button
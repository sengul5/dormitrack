import React, { type InputHTMLAttributes } from 'react'

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Switch: React.FC<SwitchProps> = ({ label, className = '', ...props }) => {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition-colors hover:bg-gray-50 ${className}`}
    >
      {label && <span className="font-bold text-gray-700">{label}</span>}
      <div className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" className="peer sr-only" {...props} />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
      </div>
    </label>
  )
}

export default Switch

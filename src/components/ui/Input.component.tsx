import React,  { type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

// --- Input ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>}
    <input 
      className={`w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${className}`}
      {...props} 
    />
  </div>
);

// --- Select ---
interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (string | SelectOption)[]; // String array veya obje array kabul eder
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options = [], placeholder, className = '', ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>}
    <div className="relative">
      <select 
        className={`w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt, i) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return <option key={i} value={value}>{label}</option>;
        })}
      </select>
      <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
    </div>
  </div>
);
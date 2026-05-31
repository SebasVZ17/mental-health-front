import React from 'react'

interface InputProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  required?: boolean
}

export const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-sm font-medium text-[#264653]"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`px-4 py-2.5 rounded-lg border font-body text-[#495057] bg-white outline-none transition-all duration-200
          ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-[#E9ECEF] focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20'
          }`}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  )
}
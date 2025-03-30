import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { ErrorMessage } from '@hookform/error-message'
import { useState } from 'react'
type Props = {
  type?: 'text' | 'email' | 'password' | 'number'
  inputType: 'select' | 'input' | 'textarea'
  options?: { value: string; label: string; id: string }[]
  label?: string
  placeholder: string
  name: string
  lines?: number
  value?: string
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  className?: string
}

const FormElements: React.FC<Props> = ({
  type,
  inputType,
  label,
  placeholder,
  name,
  register,
  value,
  errors,
  className = '', // Default to empty string
}: Props) => {
  const [isFocused, setIsFocused] = useState(false)
  switch (inputType) {
    case 'input':
      return (
        <div className="w-full">
          {label && (
            <Label
              htmlFor={`input-${name}`}
              className="block font-medium mb-2 mt-1 text-[#cccccc] text-sm"
            >
              {label} <span className="text-red-500">*</span>
            </Label>
          )}
          <Input
            id={`input-${name}`}
            type={type}
            placeholder={placeholder}
            value={value}
            {...register(name)}
            className={`  text-[#828282] placeholder-[#696969] placeholder:font-light 
        rounded-none px-4 focus:outline-none focus:ring-0 w-full h-14 mb-2 ${className}
        ${
          errors[name]
            ? 'border-red-500 text-red-500'
            : isFocused
            ? 'border-[#635BFF]'
            : 'border-gray-400'
        }
      `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mb-2.5  text-sm">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </div>
      )
    default:
      return null
  }
}

export default FormElements

import React, { useState, KeyboardEvent } from 'react'
import {
  getRoleBgColor,
  getRoleTextColor,
  hexToRgba,
} from '../../../utils/getRoleColor'
import { Control, Controller, FieldValues } from 'react-hook-form'

interface BadgeInputProps {
  type: 'email' | 'role'
  placeholder?: string
  maxItems?: number
  validator?: (item: string) => boolean
  name: string
  control: Control<FieldValues>
}

const BadgeInput: React.FC<BadgeInputProps> = ({
  type,
  placeholder,
  maxItems = 5,
  validator,
  name,
  control,
}) => {
  const [inputValue, setInputValue] = useState<string>('')

  const isValidItem = (item: string): boolean => {
    if (validator) return validator(item)
    return type === 'email' ? item.includes('@') : item.trim().length > 1
  }

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: { name: string }[],
    onChange: (value: { name: string }[]) => void
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        addItem(inputValue.trim(), value, onChange)
      }
    }
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      const newItems = [...value]
      newItems.pop()
      onChange(newItems)
    }
  }

  const addItem = (
    item: string,
    items: { name: string }[],
    onChange: (value: { name: string }[]) => void
  ) => {
    if (
      item &&
      !items.some((role) => role.name === item) &&
      isValidItem(item) &&
      items.length < maxItems
    ) {
      const newItems = [...items, { name: item }]
      onChange(newItems)
      setInputValue('')
    }
  }

  const removeItem = (
    index: number,
    items: { name: string }[],
    onChange: (value: { name: string }[]) => void
  ) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]} // ✅ Ensure default value is an empty array
      render={({ field: { onChange, value = [] } }) => (
        <div className="space-y-1">
          <div className="border-[1px] text-[#c9c9c9] bg-[#232323] border-[#393939] flex flex-wrap items-center px-2 py-2 min-h-14 focus-within:ring-1 focus-within:ring-[#635BFF] rounded-none">
            {Array.isArray(value) &&
              value.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center m-1 px-4 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: hexToRgba(getRoleBgColor(item.name), 0.2),
                    color: getRoleTextColor(item.name),
                  }}
                >
                  {item.name}
                  <button
                    type="button"
                    className="ml-2 opacity-70 hover:opacity-100"
                    onClick={() => removeItem(index, value, onChange)}
                  >
                    ×
                  </button>
                </div>
              ))}

            {(!value || value.length < maxItems) && (
              <input
                type="text"
                placeholder={
                  placeholder || `Add ${type === 'email' ? 'Emails' : 'Roles'}`
                }
                value={inputValue}
                onKeyDown={(e) => handleKeyDown(e, value || [], onChange)}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => {
                  if (inputValue.trim().length > 1) {
                    addItem(inputValue.trim(), value || [], onChange)
                  }
                }}
                className="h-10 flex-grow outline-none pl-2.5 text-[#c9c9c9] bg-[#232323] border-[#393939] placeholder-[#696969] placeholder:font-light focus:outline-none focus:ring-0 text-sm min-w-[120px]"
              />
            )}
          </div>
        </div>
      )}
    />
  )
}

export default BadgeInput

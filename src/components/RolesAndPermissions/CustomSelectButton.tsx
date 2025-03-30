import React from 'react'
import clsx from 'clsx'
import {
  getRoleTextColor,
  getRoleBgColor,
  hexToRgba,
} from '@/src/utils/getRoleColor'

interface CustomSelectButtonProps {
  text?: string
  className?: string
  onClose?: () => void
}

const CustomSelectButton: React.FC<CustomSelectButtonProps> = ({
  text,
  className,
  onClose,
}) => {
  const textColor = getRoleTextColor(text || '')
  const bgColor = hexToRgba(getRoleBgColor(text || ''), 0.2)
  return (
    <div
      className={clsx(
        'inline-flex items-center border-none rounded-full px-4 py-1.5 space-x-2  ',
        className
      )}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <span className="text-[16px] font-medium cursor-pointer">{text}</span>
      <span
        className="text-[16px] cursor-pointer hover:text-white"
        onClick={onClose}
      >
        ×
      </span>
    </div>
  )
}

export default CustomSelectButton

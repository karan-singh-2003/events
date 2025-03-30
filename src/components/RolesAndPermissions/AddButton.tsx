import React from 'react'
import { Plus } from 'lucide-react'
import clsx from 'clsx'

interface AddButtonProps {
  width?: number | string
  height?: number | string
  className?: string
  onClick?: () => void
}

const AddButton = ({ width, height, className, onClick }: AddButtonProps) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center bg-[#635BFF] text-white rounded-full hover:bg-[#635BFF]/80 cursor-pointer',
        'transition-all duration-200 ease-in-out',
        className
      )}
      style={{ width, height }}
      onClick={onClick}
    >
      <Plus size={Math.min(Number(width), Number(height)) / 1.5} />
    </div>
  )
}

export default AddButton

import clsx from 'clsx'
import React from 'react'

interface BadgeProps {
  text: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const Badge = ({ text, size = 'medium', className }: BadgeProps) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full font-semibold ',
        {
          'text-xs px-2 py-1': size === 'small',
          'text-sm px-3 py-1.5': size === 'medium',
          'text-base px-4 py-2': size === 'large',
        },
        className
      )}
    >
      {text}
    </div>
  )
}

export default Badge

import React from 'react'
import { Button } from '../../ui/button'
import clsx from 'clsx'

interface Props {
  disabled?: boolean
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

const CustomButton: React.FC<Props> = ({
  onClick,
  className,
  children,
  disabled,
}) => {
  return (
    <Button
      className={clsx(
        ' text-white  font-medium text-center p w-fit inner-shadow rounded-none',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,.3)]">{children}</span>
    </Button>
  )
}

export default CustomButton

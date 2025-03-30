import React from 'react'
import clsx from 'clsx'

import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  height: string
  width: string
  children: React.ReactNode
  className?: string
}

const Modal = ({
  isOpen,
  onClose,
  height,
  width,
  children,
  className,
}: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ✅ Background Blur Overlay */}
          <motion.div
            className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs  `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* ✅ Modal Content */}
          <motion.div
            className={clsx(
              'fixed inset-0 z-50 flex items-center justify-center duration-200'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={clsx(
                'bg-[#232323] rounded-lg shadow-lg p-6 relative',
                className
              )}
              style={{ height, width }}
              initial={{ y: 50, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: 50, opacity: 0, filter: 'blur(8px)' }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
                x: { type: 'spring', stiffness: 100, damping: 15 },
              }}
            >
              <button
                className="absolute top-5 right-7 text-gray-500 hover:text-white"
                onClick={onClose}
              >
                &times;
              </button>
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal

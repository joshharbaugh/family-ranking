'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  onClose: () => void
  children: React.ReactNode | ((close: () => void) => React.ReactNode)
  containerClassName?: string
}

export default function Modal({
  onClose,
  children,
  containerClassName,
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      close()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [close])

  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all duration-200 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        } ${containerClassName || ''}`}
      >
        {typeof children === 'function'
          ? (children as (c: () => void) => React.ReactNode)(close)
          : children}
      </div>
    </div>,
    document.body
  )
}

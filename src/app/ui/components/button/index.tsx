'use client'

import React from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const baseClasses = {
  primary:
    'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors flex items-center gap-2',
  secondary:
    'px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors',
  danger:
    'px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition-colors rounded-lg flex items-center gap-2',
}

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${baseClasses[variant]} ${className}`.trim()}
    />
  )
}

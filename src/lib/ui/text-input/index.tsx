'use client'

import React from 'react'

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.RefObject<HTMLInputElement | null>
}

const baseClass =
  'w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function TextInput({
  className = 'px-3 py-2',
  ...props
}: TextInputProps) {
  return <input {...props} className={`${baseClass} ${className}`.trim()} />
}

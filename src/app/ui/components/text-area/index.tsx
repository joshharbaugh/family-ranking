'use client'

import React from 'react'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const baseClass =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function TextArea({ className = '', ...props }: TextAreaProps) {
  return <textarea {...props} className={`${baseClass} ${className}`.trim()} />
}

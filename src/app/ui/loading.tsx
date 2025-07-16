import { Loader2 } from 'lucide-react'

export default function Loading({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center ${className ? className : 'min-h-[400px]'}`}
    >
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
    </div>
  )
}

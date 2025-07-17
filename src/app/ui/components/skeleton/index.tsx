export const skeletonClass = 'animate-[pulse_2s_infinite] bg-gray-200 dark:bg-gray-700'

export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div
      className={`${skeletonClass} bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`.trim()}
    />
  )
}

export function SkeletonText({ className = '' }: { className?: string }) {
  return <div className={`${skeletonClass} ${className}`.trim()} />
}

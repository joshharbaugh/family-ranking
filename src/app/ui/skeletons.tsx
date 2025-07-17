import UISelect from '@/app/ui/select'
import { SkeletonBox } from '@/app/ui/components/skeleton'
import { Book, Film, Gamepad2, Tv } from 'lucide-react'

export function RankingsSkeleton() {
  const sortItems = [
    { label: 'Highest Rated', value: 'rank-desc' },
    { label: 'Lowest Rated', value: 'rank-asc' },
    { label: 'Recently Added', value: 'date-desc' },
    { label: 'Oldest First', value: 'date-asc' },
    { label: 'Title A-Z', value: 'title' },
  ]
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Stats Skeleton */}
      <SkeletonBox className="p-6 h-[216px]" />
      {/* Filters and Sort Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Filter Buttons */}
        <div className="flex gap-2 flex-1 opacity-50">
          <button
            onClick={() => {}}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-indigo-600 text-white`}
          >
            All
          </button>
          <button
            onClick={() => {}}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
          >
            <Film className="w-4 h-4" />
            <span className="hidden sm:inline">Movies</span>
          </button>
          <button
            onClick={() => {}}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">TV</span>
          </button>
          <button
            onClick={() => {}}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
          >
            <Book className="w-4 h-4" />
            <span className="hidden sm:inline">Books</span>
          </button>
          <button
            onClick={() => {}}
            className={`pl-3 pr-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden sm:inline">Games</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <UISelect
          label="Sort by"
          name="sort-by"
          value="rank-desc"
          onValueChange={() => {}}
          items={sortItems}
          disabled={true}
        />
      </div>
      {/* Rankings List Skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonBox className="flex items-center gap-4 p-4 h-[152px]" key={i} />
        ))}
      </div>
    </div>
  )
}

export function FamilyOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBox className="p-6 h-[148px]" />
      <SkeletonBox className="p-6 h-[186px]" />
      <SkeletonBox className="p-6 h-[112px]" />
    </div>
  )
}

export function ProfilePageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SkeletonBox className="p-6 h-[293px]" />
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
        <SkeletonBox className="p-4 h-[200px]" />
        <SkeletonBox className="p-4 h-[200px]" />
        <SkeletonBox className="p-4 h-[200px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonBox className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 h-[164px]" />
        <SkeletonBox className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg p-4 h-[164px]" />
      </div>
      <SkeletonBox className="p-6 h-[300px]" />
    </div>
  )
}

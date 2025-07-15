import UISelect from '@/app/ui/select'
import { Book, Film, Gamepad2, Tv } from 'lucide-react'

const pulse = 'animate-[pulse_2s_infinite] bg-gray-200 dark:bg-gray-700'

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
      <div
        className={`${pulse} bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-[216px]`}
      ></div>
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
          <div
            className={`${pulse} flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 h-[152px]`}
            key={i}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default function FamilyPageSkeleton() {
  return (
    <>
      <div className={`${pulse} space-y-6 bg-gray-100`} />
    </>
  )
}

'use client'

import { Film, Tv, Book, PieChart, Gamepad2 } from 'lucide-react'
import { UserStats } from '@/lib/definitions/user'

interface MediaBreakdownProps {
  stats?: UserStats | null
}

export const MediaBreakdown: React.FC<MediaBreakdownProps> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <PieChart className="w-4 h-4" />
        Media Breakdown
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm">
            <Film className="w-4 h-4 text-blue-500" />
            Movies
          </span>
          <span className="font-semibold">{stats.movieCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm">
            <Tv className="w-4 h-4 text-green-500" />
            TV Shows
          </span>
          <span className="font-semibold">{stats.tvCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm">
            <Book className="w-4 h-4 text-purple-500" />
            Books
          </span>
          <span className="font-semibold">{stats.bookCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm">
            <Gamepad2 className="w-4 h-4 text-yellow-500" />
            Games
          </span>
          <span className="font-semibold">{stats.gameCount}</span>
        </div>
      </div>
    </div>
  )
}

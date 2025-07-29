'use client'

import { BarChart3, Star } from 'lucide-react'
import { UserStats } from '@/lib/definitions/user'

interface RatingDistributionProps {
  stats?: UserStats | null
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  stats,
}) => {
  if (!stats) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Rating Distribution
      </h3>
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-2">
            <div className="flex items-center gap-1 w-20">
              {[...Array(rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 dark:bg-indigo-400 h-full transition-all duration-500"
                style={{
                  width: `${stats.total > 0 ? (stats.ratingDistribution[rating - 1] / stats.total) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
              {stats.ratingDistribution[rating - 1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

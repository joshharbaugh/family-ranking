'use client'

import { Trophy, Star } from 'lucide-react'
import Image from 'next/image'
import { UserStats } from '@/lib/definitions/user'

interface HighestRatedProps {
  stats?: UserStats | null
}

export const HighestRated: React.FC<HighestRatedProps> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-600" />
        Highest Recent Rating
      </h3>
      <div className="flex items-center gap-3">
        <Image
          src={stats.highestRated.media?.poster || ''}
          alt={stats.highestRated.media?.title || ''}
          className="w-16 h-24 object-cover rounded shadow"
          width={80}
          height={120}
        />
        <div>
          <h4 className="font-medium">
            {stats.highestRated?.media?.title || 'No title'}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < stats.highestRated.rank
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-300 text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

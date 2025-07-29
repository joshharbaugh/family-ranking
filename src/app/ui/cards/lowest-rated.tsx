'use client'

import { TrendingUp, Star } from 'lucide-react'
import Image from 'next/image'
import { UserStats } from '@/lib/definitions/user'

interface LowestRatedProps {
  stats?: UserStats | null
}

export const LowestRated: React.FC<LowestRatedProps> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-gray-600 rotate-180" />
        Room for Improvement
      </h3>
      <div className="flex items-center gap-3">
        <Image
          src={stats.lowestRated.media?.poster || ''}
          alt={stats.lowestRated.media?.title || ''}
          className="w-16 h-24 object-cover rounded shadow"
          width={80}
          height={120}
        />
        <div>
          <h4 className="font-medium">
            {stats.lowestRated?.media?.title || 'No title'}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < stats.lowestRated.rank
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

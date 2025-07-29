'use client'

import { Award, Film, TrendingUp, Trophy, Star } from 'lucide-react'
import { UserStats } from '@/lib/definitions/user'

interface AchievementsProps {
  stats?: UserStats | null
}

export const Achievements: React.FC<AchievementsProps> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <Award className="w-4 h-4" />
        Achievements
      </h3>
      <div className="space-y-2">
        {stats.total >= 10 && (
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Ranked 10+ items</span>
          </div>
        )}
        {stats.total >= 25 && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-indigo-500" />
            <span>Super Ranker (25+)</span>
          </div>
        )}
        {stats.movieCount >= 5 && (
          <div className="flex items-center gap-2 text-sm">
            <Film className="w-4 h-4 text-blue-500" />
            <span>Movie Buff</span>
          </div>
        )}
        {Number(stats.avgRating) >= 4 && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Positive Reviewer</span>
          </div>
        )}
      </div>
    </div>
  )
}

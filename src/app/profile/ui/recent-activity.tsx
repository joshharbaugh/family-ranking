'use client'

import { Calendar } from 'lucide-react'
import { UserStats } from '@/lib/definitions/user'
import { RankingCard } from '@/app/ui/cards/ranking-card'

interface RecentActivityProps {
  stats?: UserStats | null
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Recent Activity
      </h3>
      <div className="space-y-3">
        {stats.recentRankings.map((ranking) => (
          <RankingCard key={ranking.id} ranking={ranking} />
        ))}
      </div>
    </div>
  )
}

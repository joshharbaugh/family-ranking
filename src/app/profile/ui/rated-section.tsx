'use client'

import { UserStats } from '@/lib/definitions/user'
import { HighestRated } from '@/app/ui/highest-rated'
import { LowestRated } from '@/app/ui/lowest-rated'

interface TopBottomRatedSectionProps {
  stats?: UserStats | null
}

export const TopBottomRatedSection: React.FC<TopBottomRatedSectionProps> = ({
  stats,
}) => {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Highest Rated */}
      {stats.highestRated && <HighestRated stats={stats} />}

      {/* Lowest Rated */}
      {stats.lowestRated && <LowestRated stats={stats} />}
    </div>
  )
}

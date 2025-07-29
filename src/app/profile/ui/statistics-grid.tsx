'use client'

import { UserStats } from '@/lib/definitions/user'
import { MediaBreakdown } from '@/app/ui/cards/media-breakdown'
import { RatingDistribution } from '@/app/ui/cards/rating-distribution'
import { Achievements } from '@/app/ui/cards/achievements'

interface ProfileStatisticsGridProps {
  stats?: UserStats | null
}

export const ProfileStatisticsGrid: React.FC<ProfileStatisticsGridProps> = ({
  stats,
}) => {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Media Breakdown */}
      <MediaBreakdown stats={stats} />

      {/* Rating Distribution */}
      <RatingDistribution stats={stats} />

      {/* Achievements */}
      <Achievements stats={stats} />
    </div>
  )
}

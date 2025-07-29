import React from 'react'
import { Star } from 'lucide-react'
import { Ranking } from '@/lib/definitions/index'
import { getMediaIcon } from '@/lib/utils'
import Image from 'next/image'

interface RankingCardProps {
  ranking: Ranking
}

export const RankingCard = React.memo(function RankingCard({
  ranking,
}: RankingCardProps) {
  const Icon = getMediaIcon(ranking.media?.type || 'movie')

  return (
    <div
      key={ranking.id}
      className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
    >
      <Image
        src={ranking.media?.poster || ''}
        alt={ranking.media?.title || ''}
        className="w-12 h-18 object-cover rounded"
        width={80}
        height={120}
      />
      <div className="flex-1">
        <p className="font-medium text-sm flex items-center gap-2">
          {ranking.media?.title}
          <Icon className="w-3 h-3 text-gray-400" />
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < ranking.rank
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-300 text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

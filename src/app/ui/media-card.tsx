import React from 'react'
import { Star, Plus, Check } from 'lucide-react'
import { Media } from '@/lib/definitions/index'
import { getMediaIcon } from '@/lib/utils'
import Image from 'next/image'

interface MediaCardProps {
  media: Media
  onAddToRankings: (media: Media) => void
  isRanked: boolean
}

export const MediaCard = ({
  media,
  onAddToRankings,
  isRanked,
}: MediaCardProps): React.ReactNode => {
  const Icon = getMediaIcon(media.type)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 relative">
        <Image
          src={media.poster || ''}
          alt={media.title}
          className="w-full h-full object-cover"
          width={80}
          height={120}
        />
        {media.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{media.rating}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{media.title}</h3>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Icon className="w-4 h-4" />
            <span className="text-xs">{media.releaseDate}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {media.overview}
        </p>
        <button
          disabled={isRanked}
          onClick={() => onAddToRankings(media)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-green-500 disabled:opacity-60"
        >
          {!isRanked ? (
            <Plus className="w-4 h-4" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {!isRanked ? 'Add to Rankings' : 'Added to Rankings'}
        </button>
      </div>
    </div>
  )
}

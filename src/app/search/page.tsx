'use client'

import React, { Suspense, useState, useCallback, useMemo } from 'react'
import { Search, Film, Tv, Book, Loader2, Gamepad2 } from 'lucide-react'
import { Media, MediaType, Ranking } from '@/lib/definitions/index'
import { MediaCard } from '@/app/ui/cards/media-card'
import { useSearch } from '@/app/hooks/useSearch'
import { useRankings } from '@/app/hooks/useRankings'
import dynamic from 'next/dynamic'
import Select from '@/lib/ui/select'

const RankingModal = dynamic(
  () => import('@/app/ui/modals/ranking').then((mod) => mod.RankingModal),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { suspense: true } as any
)

const SearchPage = (): React.ReactElement => {
  const { addRanking, rankings } = useRankings()
  const { searchMedia, searchResults, isLoading, clearSearch } = useSearch()
  const [mediaType, setMediaType] = useState<MediaType>('movie')
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [existingRanking, setExistingRanking] = useState<Ranking | null>(null)

  const handleAddToRankings = useCallback((media: Media) => {
    setSelectedMedia(media)
    setShowAddModal(true)
  }, [])

  const handleSaveRanking = useCallback(
    (ranking: Ranking) => {
      addRanking(ranking.rank, ranking.notes, ranking.media)
      setShowAddModal(false)
      setSelectedMedia(null)
      setExistingRanking(null)
    },
    [addRanking]
  )

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!searchQuery.trim()) {
        clearSearch()
        setHasSearched(false)
        return
      }

      setHasSearched(true)
      // Use immediate search (no debounce) for manual form submission
      searchMedia(mediaType, searchQuery, 0)
    },
    [searchQuery, mediaType, clearSearch, setHasSearched, searchMedia]
  )

  const handleMediaTypeChange = useCallback(
    (type: MediaType) => {
      setMediaType(type)
      clearSearch()
      setHasSearched(false)
    },
    [clearSearch, setHasSearched]
  )

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)

      // Perform debounced search as user types
      if (value.trim()) {
        setHasSearched(true)
        searchMedia(mediaType, value, 750) // 750ms debounce for typing
      } else {
        clearSearch()
        setHasSearched(false)
      }
    },
    [mediaType, searchMedia, clearSearch, setHasSearched]
  )

  const getMediaIcon = useMemo(
    // eslint-disable-next-line react/display-name
    () => (type: MediaType) => {
      switch (type) {
        case 'movie':
          return <Film className="w-4 h-4" />
        case 'tv':
          return <Tv className="w-4 h-4" />
        case 'book':
          return <Book className="w-4 h-4" />
        case 'game':
          return <Gamepad2 className="w-4 h-4" />
      }
    },
    []
  )

  const placeholder = useMemo(() => {
    switch (mediaType) {
      case 'movie':
        return 'Search for movies...'
      case 'tv':
        return 'Search for TV shows...'
      case 'book':
        return 'Search for books...'
      case 'game':
        return 'Search for games...'
    }
  }, [mediaType])

  const isRankedMap = useMemo(() => {
    const map = new Map()
    rankings.forEach((ranking) => {
      if (ranking.media?.id) {
        map.set(ranking.media.id, true)
      }
    })
    return map
  }, [rankings])

  return (
    <>
      {/* Add Ranking Modal (dynamic) */}
      {showAddModal && (selectedMedia || existingRanking) && (
        <Suspense>
          <RankingModal
            media={selectedMedia || existingRanking?.media}
            onSave={handleSaveRanking}
            onClose={() => {
              setShowAddModal(false)
              setSelectedMedia(null)
              setExistingRanking(null)
            }}
            existingRanking={existingRanking || undefined}
          />
        </Suspense>
      )}

      <div className="space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="flex items-center pl-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none">
              {/* Media Type Selector */}
              <Select
                className="rounded-sm"
                label="Media Type"
                name="mediaType"
                items={[
                  { label: 'Movies', value: 'movie' },
                  { label: 'TV', value: 'tv' },
                  { label: 'Books', value: 'book' },
                  { label: 'Games', value: 'game' },
                ]}
                value={mediaType}
                onValueChange={(value) =>
                  handleMediaTypeChange(value as MediaType)
                }
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleQueryChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 pr-12 focus:outline-none transition-all"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {/* Results Section */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : hasSearched && searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try searching for something else or browse our suggestions below
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="flex items-baseline mb-4 gap-2">
              <h3 className="text-2xl text-gray-900 dark:text-gray-100">
                {hasSearched ? 'Search Results' : 'Suggestions'}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {searchResults.length}{' '}
                {searchResults.length === 1 ? 'result' : 'results'}
              </span>
            </div>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}
            >
              {searchResults.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  onAddToRankings={handleAddToRankings}
                  isRanked={isRankedMap.has(media.id)}
                />
              ))}
            </div>
          </>
        ) : !hasSearched ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mb-4">
              {getMediaIcon(mediaType)}
            </div>
            <h3 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">
              Discover {mediaType === 'tv' ? 'TV Shows' : `${mediaType}s`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Search for your favorite{' '}
              {mediaType === 'tv' ? 'TV shows' : `${mediaType}s`} and add them
              to your personal rankings
            </p>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default SearchPage

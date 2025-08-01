'use client'

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  Suspense,
} from 'react'
import { Star, X, Trophy, Film, Tv, Book, Edit2, Gamepad2 } from 'lucide-react'
import { Media, Ranking } from '@/lib/definitions/index'
import { UserStats } from '@/lib/definitions/user'
import { getMediaIcon } from '@/lib/utils'
import { useRankings } from '@/app/hooks/useRankings'
import Select from '@/lib/ui/select'
import Image from 'next/image'
import { RankingsSkeleton } from '@/app/ui/skeletons'
import dynamic from 'next/dynamic'
import { ProtectedRoute } from '@/app/components/ProtectedRoute'

type SortOption = 'rank-desc' | 'rank-asc' | 'date-desc' | 'date-asc' | 'title'
type FilterOption = 'all' | 'movie' | 'tv' | 'book' | 'game'

const RankingModal = dynamic(
  () => import('@/app/ui/modals/ranking').then((mod) => mod.RankingModal),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { suspense: true } as any
)

const RankingsPage = (): React.ReactNode => {
  const { addRanking, deleteRanking, getUserStats, rankings } = useRankings()
  const [sortBy, setSortBy] = useState<SortOption>('rank-desc')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [stats, setStats] = useState<UserStats | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [existingRanking, setExistingRanking] = useState<Ranking | null>(null)
  const [loading, setLoading] = useState(true)

  // Sort and filter rankings
  const processedRankings = useMemo(() => {
    let filtered = [...rankings]

    // Apply filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((r) => r.media?.type === filterBy)
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rank-desc':
          return b.rank - a.rank
        case 'rank-asc':
          return a.rank - b.rank
        case 'date-desc':
          return (
            (b.createdAt?.toDate().getTime() ?? 0) -
            (a.createdAt?.toDate().getTime() ?? 0)
          )
        case 'date-asc':
          return (
            (a.createdAt?.toDate().getTime() ?? 0) -
            (b.createdAt?.toDate().getTime() ?? 0)
          )
        case 'title':
          return a.media?.title.localeCompare(b.media?.title || '') || 0
        default:
          return 0
      }
    })

    return filtered
  }, [rankings, sortBy, filterBy])

  const sortItems = [
    { label: 'Highest Rated', value: 'rank-desc' },
    { label: 'Lowest Rated', value: 'rank-asc' },
    { label: 'Recently Added', value: 'date-desc' },
    { label: 'Oldest First', value: 'date-asc' },
    { label: 'Title A-Z', value: 'title' },
  ]

  // Get user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStats = await getUserStats()
        setStats(userStats)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user stats:', error)
      }
    }

    fetchStats()
  }, [getUserStats, rankings])

  const handleDelete = useCallback(
    (id: string) => {
      deleteRanking(id)
      setShowDeleteConfirm(null)
    },
    [deleteRanking]
  )

  const handleEdit = useCallback((ranking: Ranking) => {
    setExistingRanking(ranking)
    setShowAddModal(true)
  }, [])

  const handleSave = useCallback(
    (ranking: Ranking) => {
      addRanking(ranking.rank, ranking.notes, ranking.media)
      setShowAddModal(false)
      setSelectedMedia(null)
      setExistingRanking(null)
    },
    [addRanking]
  )

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as SortOption)
  }, [])

  const handleFilterChange = useCallback((filterType: FilterOption) => {
    setFilterBy(filterType)
  }, [])

  if (loading || !stats) {
    return <RankingsSkeleton />
  }

  if (rankings.length === 0) {
    return (
      <ProtectedRoute>
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No rankings yet!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Search for your favorite movies, TV shows, books, and games to start
            building your personal rankings.
          </p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      {}
      {/* Add Ranking Modal (dynamic) */}
      {showAddModal && (selectedMedia || existingRanking) && (
        <Suspense>
          <RankingModal
            media={selectedMedia || existingRanking?.media}
            onSave={handleSave}
            onClose={() => {
              setShowAddModal(false)
              setSelectedMedia(null)
              setExistingRanking(null)
            }}
            existingRanking={existingRanking || undefined}
          />
        </Suspense>
      )}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            My Rankings
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {rankings.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats?.avgRating ?? 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Avg Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats?.movieCount ?? 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Movies
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats?.tvCount ?? 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">TV</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats?.bookCount ?? 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Books
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats?.gameCount ?? 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Games
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterBy === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('movie')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                filterBy === 'movie'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Movies</span>
              <span>({stats?.movieCount ?? 0})</span>
            </button>
            <button
              onClick={() => handleFilterChange('tv')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                filterBy === 'tv'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">TV</span>
              <span>({stats?.tvCount ?? 0})</span>
            </button>
            <button
              onClick={() => handleFilterChange('book')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                filterBy === 'book'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Book className="w-4 h-4" />
              <span className="hidden sm:inline">Books</span>
              <span>({stats?.bookCount ?? 0})</span>
            </button>
            <button
              onClick={() => handleFilterChange('game')}
              className={`pl-3 pr-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                filterBy === 'game'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Games</span>
              <span>({stats?.gameCount ?? 0})</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <Select
            label="Sort by"
            name="sort-by"
            onValueChange={handleSortChange}
            value={sortBy}
            items={sortItems}
          />
        </div>

        {/* Rankings List */}
        <div className="grid gap-4">
          {processedRankings.map((ranking, index) => {
            const Icon = getMediaIcon(ranking.media?.type || 'movie')

            return (
              <div
                key={ranking.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Rank Number (for top 3) */}
                  {sortBy === 'rank-desc' && index < 3 && (
                    <div
                      className={`
                      flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                      ${index === 0 ? 'bg-yellow-400 text-yellow-900' : ''}
                      ${index === 1 ? 'bg-gray-300 text-gray-700' : ''}
                      ${index === 2 ? 'bg-orange-400 text-orange-900' : ''}
                    `}
                    >
                      {index + 1}
                    </div>
                  )}

                  {/* Poster */}
                  <Image
                    src={ranking.media?.poster || ''}
                    alt={ranking.media?.title || ''}
                    width={80}
                    height={120}
                    className="w-16 h-24 sm:w-20 sm:h-30 object-cover rounded shadow-sm"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <span className="text-ellipsis line-clamp-1">
                            {ranking.media?.title}
                          </span>
                          <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        </h3>

                        <div className="flex items-center gap-3 mt-1">
                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < ranking.rank
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                              {ranking.rank}/5
                            </span>
                          </div>

                          {/* Release Date */}
                          {ranking.media?.releaseDate && (
                            <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                              {ranking.media?.releaseDate}
                            </span>
                          )}
                        </div>

                        {/* Notes */}
                        {ranking.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                            {ranking.notes}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col md:flex-row items-center gap-1">
                        <button
                          onClick={() => handleEdit(ranking)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          aria-label="Edit ranking"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {showDeleteConfirm === ranking.id ? (
                          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 rounded p-1">
                            <button
                              onClick={() => handleDelete(ranking.id)}
                              className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(ranking.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            aria-label="Remove ranking"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default RankingsPage

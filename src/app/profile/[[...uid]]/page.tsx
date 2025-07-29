'use client'

import React, { useEffect, useState } from 'react'
import {
  Trophy,
  Star,
  TrendingUp,
  Film,
  Tv,
  Book,
  BarChart3,
  PieChart,
  Calendar,
  Award,
  Gamepad2,
} from 'lucide-react'
import { getMediaIcon, isValidUID } from '@/lib/utils'
import { useProfileFetching } from '@/app/hooks/useProfileFetching'
import Image from 'next/image'
import { ProfilePageSkeleton } from '@/app/ui/skeletons'
import Link from 'next/link'
import { ProtectedRoute } from '@/app/components/ProtectedRoute'
import { ProfileHeader } from '@/app/profile/ui/header'

interface ProfilePageProps {
  params: Promise<{ uid?: string[] }>
}

const ProfilePage = ({ params }: ProfilePageProps): React.ReactElement => {
  // Parse the uid from params - if no uid provided, show current user's profile
  const [targetUserId, setTargetUserId] = useState<string | undefined>(
    undefined
  )
  const [paramsLoaded, setParamsLoaded] = useState(false)
  const [paramsError, setParamsError] = useState<string | null>(null)

  // Load params asynchronously with validation
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params
        const rawUid = resolvedParams.uid?.[0]

        if (rawUid) {
          // Validate the UID for security
          if (!isValidUID(rawUid)) {
            console.warn('Invalid UID detected:', rawUid)
            setParamsError('Invalid user ID format')
            setParamsLoaded(true)
            return
          }
          setTargetUserId(rawUid)
        } else {
          setTargetUserId(undefined)
        }

        setParamsLoaded(true)
      } catch (err) {
        console.error('Error loading params:', err)
        setParamsError('Failed to load profile parameters')
        setParamsLoaded(true)
      }
    }
    loadParams()
  }, [params])

  // Use the profile fetching hook
  const {
    viewedProfile,
    stats,
    loading,
    error: fetchError,
    isOwnProfile,
  } = useProfileFetching({
    targetUserId,
    paramsLoaded,
    debounceMs: 300,
  })

  // Combine params error and fetch error
  const error = paramsError || fetchError

  if (loading && !stats) {
    return <ProfilePageSkeleton />
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">
          <strong>Error:</strong> {error}
          {error === 'User not found' ? (
            <span>
              {' '}
              The user you&apos;re looking for doesn&apos;t exist or may have
              been removed.{' '}
              <Link
                href="/profile"
                className="text-indigo-600 dark:text-indigo-400"
              >
                Go to your profile
              </Link>
            </span>
          ) : (
            <span>
              {' '}
              Please try again later or{' '}
              <Link
                href="/profile"
                className="text-indigo-600 dark:text-indigo-400"
              >
                refresh the page
              </Link>
            </span>
          )}
        </p>
      </div>
    )
  }

  if (!viewedProfile) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          <strong>Profile not found:</strong> Unable to load the requested
          profile.
        </p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          viewedProfile={viewedProfile}
          stats={stats}
          isOwnProfile={isOwnProfile}
        />

        {/* Statistics Grid - Only show for own profile with stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Media Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Media Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Film className="w-4 h-4 text-blue-500" />
                    Movies
                  </span>
                  <span className="font-semibold">{stats.movieCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Tv className="w-4 h-4 text-green-500" />
                    TV Shows
                  </span>
                  <span className="font-semibold">{stats.tvCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Book className="w-4 h-4 text-purple-500" />
                    Books
                  </span>
                  <span className="font-semibold">{stats.bookCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Gamepad2 className="w-4 h-4 text-yellow-500" />
                    Games
                  </span>
                  <span className="font-semibold">{stats.gameCount}</span>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Rating Distribution
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-20">
                      {[...Array(rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-400 h-full transition-all duration-500"
                        style={{
                          width: `${stats.total > 0 ? (stats.ratingDistribution[rating - 1] / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                      {stats.ratingDistribution[rating - 1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
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
          </div>
        )}

        {/* Top & Bottom Rated */}
        {stats && stats.highestRated && stats.lowestRated && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Highest Rated */}
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

            {/* Lowest Rated */}
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
          </div>
        )}

        {/* Recent Activity */}
        {stats && stats.recentRankings.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {stats.recentRankings.map((ranking) => {
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
              })}
            </div>
          </div>
        )}

        {/* Placeholder for other users without stats */}
        {!isOwnProfile && !stats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {viewedProfile?.displayName}&apos;s detailed statistics and
              activity will be available soon.
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default ProfilePage

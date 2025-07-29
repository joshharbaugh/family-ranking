'use client'

import React, { useEffect, useState } from 'react'
import { isValidUID } from '@/lib/utils'
import { useProfileFetching } from '@/app/hooks/useProfileFetching'
import { ProfilePageSkeleton } from '@/app/ui/skeletons'
import Link from 'next/link'
import { ProtectedRoute } from '@/app/components/ProtectedRoute'
import { ProfileHeader } from '@/app/profile/ui/header'
import { ProfileStatisticsGrid } from '@/app/profile/ui/statistics-grid'
import { TopBottomRatedSection } from '@/app/profile/ui/rated-section'
import { RecentActivity } from '@/app/profile/ui/recent-activity'

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
        {stats && <ProfileStatisticsGrid stats={stats} />}

        {/* Top & Bottom Rated */}
        {stats && <TopBottomRatedSection stats={stats} />}

        {/* Recent Activity */}
        {stats && stats.recentRankings.length > 0 && (
          <RecentActivity stats={stats} />
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

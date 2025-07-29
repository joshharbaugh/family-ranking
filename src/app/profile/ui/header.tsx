'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { UserProfile, UserStats } from '@/lib/definitions/user'
import { UserAvatar } from '@/app/ui/user-avatar'
import { Bio } from '@/app/profile/ui/bio'

interface ProfileHeaderProps {
  viewedProfile: UserProfile
  stats?: UserStats | null
  isOwnProfile: boolean
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  viewedProfile,
  stats,
  isOwnProfile,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <UserAvatar viewedProfile={viewedProfile} isOwnProfile={isOwnProfile} />

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {viewedProfile?.displayName}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-3">
            {viewedProfile?.email}
          </p>

          {/* Bio Section */}
          <Bio viewedProfile={viewedProfile} isOwnProfile={isOwnProfile} />
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="flex sm:flex-col gap-4 sm:gap-2 text-center">
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.total}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Rankings
              </p>
            </div>
            <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.avgRating}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Avg Rating
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Favorite Genres */}
      {viewedProfile?.favoriteGenres &&
        viewedProfile.favoriteGenres.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Favorite Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {viewedProfile.favoriteGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
    </div>
  )
}

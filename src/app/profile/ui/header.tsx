'use client'

import React, { useState, useEffect } from 'react'
import { Edit3, Sparkles } from 'lucide-react'
import { useUserStore } from '@/app/store/user-store'
import { db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { UserProfile, UserStats } from '@/lib/definitions/user'
import { UserAvatar } from '@/app/ui/user-avatar'

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
  const currentUserProfile = useUserStore((state) => state.userProfile)
  const updateUserProfile = useUserStore((state) => state.updateUserProfile)

  // Bio editing state (only used for own profile)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempBio, setTempBio] = useState('')
  const [isSavingBio, setIsSavingBio] = useState(false)
  const [bioSaveError, setBioSaveError] = useState<string | null>(null)

  // Update tempBio when viewedProfile changes
  useEffect(() => {
    if (viewedProfile) {
      setTempBio(viewedProfile.bio || '')
    }
  }, [viewedProfile])

  const handleSaveBio = async () => {
    if (!currentUserProfile || !isOwnProfile || isSavingBio) return

    setIsSavingBio(true)
    setBioSaveError(null)

    try {
      const userRef = doc(db, 'users', currentUserProfile.uid)

      await setDoc(
        userRef,
        {
          bio: tempBio,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      updateUserProfile({ ...currentUserProfile, bio: tempBio })
      setIsEditingBio(false)
    } catch (error) {
      console.error('Error saving bio:', error)
      setBioSaveError('Failed to save bio. Please try again.')
    } finally {
      setIsSavingBio(false)
    }
  }

  const handleCancelBio = () => {
    setTempBio(viewedProfile?.bio || '')
    setIsEditingBio(false)
    setBioSaveError(null)
  }

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
          <div className="relative">
            {isEditingBio && isOwnProfile ? (
              <div className="space-y-2">
                <textarea
                  value={tempBio}
                  onChange={(e) => {
                    setTempBio(e.target.value)
                    // Clear error when user starts typing
                    if (bioSaveError) {
                      setBioSaveError(null)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      handleCancelBio()
                    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault()
                      handleSaveBio()
                    }
                  }}
                  disabled={isSavingBio}
                  className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isSavingBio ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  rows={3}
                  maxLength={200}
                  placeholder="Tell others about yourself..."
                />
                {bioSaveError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {bioSaveError}
                  </p>
                )}
                <div className="flex gap-2 items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveBio}
                      disabled={isSavingBio}
                      className={`px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm flex items-center gap-1 ${
                        isSavingBio
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-indigo-700'
                      }`}
                    >
                      {isSavingBio && (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {isSavingBio ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelBio}
                      disabled={isSavingBio}
                      className={`px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 ${
                        isSavingBio ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="group">
                <p className="text-gray-600 dark:text-gray-400 pr-8">
                  {viewedProfile?.bio ||
                    (isOwnProfile
                      ? 'Add a bio to tell others about yourself...'
                      : 'No bio available.')}
                </p>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                  </button>
                )}
              </div>
            )}
          </div>
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

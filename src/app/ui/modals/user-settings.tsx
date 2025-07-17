'use client'

import { X, Save } from 'lucide-react'
import React, { useState } from 'react'
import { UserProfile } from '@/lib/definitions/user'
import Modal from '@/app/ui/components/modal'

interface UserSettingsModalProps {
  userProfile: UserProfile
  onSave: (updates: Partial<UserProfile>) => void
  onClose: () => void
}

export const UserSettingsModal = ({
  userProfile,
  onSave,
  onClose,
}: UserSettingsModalProps): React.ReactElement => {
  const [displayName, setDisplayName] = useState(userProfile.displayName)
  const [email, setEmail] = useState(userProfile.email || '')
  const [bio, setBio] = useState(userProfile.bio)
  const [favoriteGenres, setFavoriteGenres] = useState(
    userProfile.favoriteGenres.join(', ')
  )

  const handleSave = (close: () => void) => {
    const updates: Partial<UserProfile> = {
      displayName: displayName.trim(),
      email: email.trim(),
      bio: bio.trim(),
      favoriteGenres: favoriteGenres
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g.length > 0),
    }

    onSave(updates)
    close()
  }

  return (
    <Modal onClose={onClose} containerClassName="max-w-md w-full">
      {(close) => (
        <>
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Update Settings
              </h3>
              <button
                onClick={close}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Favorite Genres
                </label>
                <input
                  type="text"
                  value={favoriteGenres}
                  onChange={(e) => setFavoriteGenres(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Comma separated"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button
              onClick={close}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(close)}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Update
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

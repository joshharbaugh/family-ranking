'use client'

import { X, Save } from 'lucide-react'
import React, { useState } from 'react'
import { UserProfile } from '@/lib/definitions/user'
import Modal from '@/lib/ui/modal'
import TextInput from '@/lib/ui/text-input'
import TextArea from '@/lib/ui/text-area'
import Button from '@/lib/ui/button'

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
              <h3
                id="modal-title"
                className="text-xl font-semibold text-gray-900 dark:text-gray-100"
              >
                Update Settings
              </h3>
              <button
                onClick={close}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
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
                <label
                  htmlFor="settings-display-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Display Name
                </label>
                <TextInput
                  id="settings-display-name"
                  name="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <TextInput
                  id="settings-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Bio
                </label>
                <TextArea
                  id="settings-bio"
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-favorite-genres"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Favorite Genres
                </label>
                <TextInput
                  id="settings-favorite-genres"
                  name="favoriteGenres"
                  type="text"
                  value={favoriteGenres}
                  onChange={(e) => setFavoriteGenres(e.target.value)}
                  placeholder="Comma separated"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-3">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(close)}
              className="flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Update
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}

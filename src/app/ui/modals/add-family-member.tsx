'use client'

import React, { useState } from 'react'
import { X, Users, Save, Loader2 } from 'lucide-react'
import { useFamilyStore } from '@/app/store/family-store'
// import { useUserStore } from '@/store/userStore';
import { FamilyRole } from '@/lib/definitions/family'
import { UserSearch } from '@/app/ui/user-search'
import { UserProfile } from '@/lib/definitions/user'
import Modal from '@/lib/ui/modal'
import Button from '@/lib/ui/button'

interface AddFamilyMemberModalProps {
  currentUserId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  currentUserId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addFamilyMember, clearError, currentFamily, loading, error } =
    useFamilyStore()
  // const { users, loading: usersLoading, error: usersError, fetchUsersByName } = useUserStore();
  const [userId, setUserId] = useState('')
  const [role] = useState<FamilyRole>('other')
  // const [search, setSearch] = useState('');

  // Search for users
  // useEffect(() => {
  //   if (search) {
  //     // Debounce fetchUsersByName
  //     const handler = setTimeout(() => {
  //       fetchUsersByName(search);
  //     }, 400);
  //     return () => clearTimeout(handler);
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [search]);

  const handleUserSelect = (user: UserProfile) => {
    setUserId(user.uid)
  }

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()

    if (!currentFamily?.id) {
      return
    }

    try {
      await addFamilyMember(currentFamily.id, userId, role as FamilyRole)
      handleClose(close)
      onSuccess?.()
    } catch {
      // Error is handled by the store
    }
  }

  const handleClose = (close: () => void) => {
    clearError()
    close()
  }

  if (!isOpen) return null

  return (
    <Modal
      onClose={onClose}
      containerClassName="max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      {(close) => (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Add Family Member
            </h2>
            <button
              onClick={() => handleClose(close)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search for users */}
          <UserSearch
            currentUserId={currentUserId}
            onUserSelect={handleUserSelect}
          />

          {/* Form */}
          {userId && (
            <form
              onSubmit={(e) => handleSubmit(e, close)}
              className="p-6 space-y-4"
            >
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* <div>
            <label htmlFor="family-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              id="family-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter family name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div> */}

              {/* <div>
            <label htmlFor="family-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="family-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your family..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
            />
          </div> */}
            </form>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="secondary"
              onClick={() => handleClose(close)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={(e) => handleSubmit(e, close)}
              disabled={loading || !userId.trim()}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Add Family Member
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}

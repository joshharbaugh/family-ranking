'use client'

import React, { useState } from 'react'
import { X, Users, Save, Loader2, Trash } from 'lucide-react'
import { useFamilyStore } from '@/app/store/family-store'
import Modal from '@/app/ui/components/modal'

interface FamilyModalProps {
  currentUserId: string
  isOpen: boolean
  isNewFamily?: boolean
  onClose: () => void
  onDelete?: () => void
  onSuccess?: () => void
}

export const FamilyModal: React.FC<FamilyModalProps> = ({
  currentUserId,
  isOpen,
  isNewFamily = false,
  onClose,
  onDelete,
  onSuccess,
}) => {
  const {
    createFamily,
    deleteFamily,
    updateFamily,
    clearError,
    currentFamily,
    loading,
    error,
  } = useFamilyStore()
  const [name, setName] = useState(isNewFamily ? '' : currentFamily?.name || '')
  const [description, setDescription] = useState(
    isNewFamily ? '' : currentFamily?.description || ''
  )

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()

    if (!name.trim()) {
      return
    }

    try {
      if (isNewFamily || !currentFamily?.id) {
        await createFamily(name.trim(), description.trim() || undefined)
        handleClose(close)
        onSuccess?.()
        return
      } else {
        await updateFamily(currentFamily.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        })
        handleClose(close)
        onSuccess?.()
      }
    } catch {
      // Error is handled by the store
    }
  }

  const handleDelete = async (close: () => void) => {
    if (!currentFamily?.id || !currentFamily.createdBy) return

    // Show a confirmation modal before deleting the family
    const confirmed = window.confirm(
      'Are you sure you want to delete this family? This action cannot be undone.'
    )
    if (!confirmed) return

    await deleteFamily(currentFamily.id, currentFamily.createdBy)
    handleClose(close)
    onDelete?.()
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
              {isNewFamily ? 'Create Family' : 'Update Family'}
            </h2>
            <button
              onClick={() => handleClose(close)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
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

            <div>
              <label
                htmlFor="family-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Family Name *
              </label>
              <input
                id="family-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter family name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="family-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description (Optional)
              </label>
              <textarea
                id="family-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your family..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Settings
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Child rankings enabled</p>
                <p>• Parent approval not required</p>
                <p>• Private family (only members can see)</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                You can change these settings after creating the family.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            {(isNewFamily || currentUserId !== currentFamily?.createdBy) && (
              <button
                type="button"
                onClick={() => handleClose(close)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            )}
            {!isNewFamily && currentUserId === currentFamily?.createdBy && (
              <button
                type="button"
                onClick={() => handleDelete(close)}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition-colors rounded-lg flex items-center gap-2"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>
            )}
            <button
              type="submit"
              onClick={(e) => handleSubmit(e, close)}
              disabled={loading || !name.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isNewFamily ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

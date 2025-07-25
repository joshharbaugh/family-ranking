'use client'

import React, { useState } from 'react'
import { X, Users, Save, Loader2 } from 'lucide-react'
import { UserService } from '@/app/services/user-service'
import { useInvitation } from '@/app/hooks/useInvitation'
import { useFamilyStore } from '@/app/store/family-store'
import { useUserStore } from '@/app/store/user-store'
import { Invitation } from '@/lib/definitions'
import { FamilyRole } from '@/lib/definitions/family'
import Modal from '@/lib/ui/modal'
import Button from '@/lib/ui/button'
import Select from '@/lib/ui/select'
// import { useAuth } from '@/app/hooks/useAuth'
// import { v4 as uuidv4 } from 'uuid'
// import { auth } from '@/lib/firebase'
// import { signInAnonymously, sendSignInLinkToEmail } from 'firebase/auth'

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
  // const { sendEmailLink } = useAuth()
  const { addFamilyMember, clearError, currentFamily, loading, error } =
    useFamilyStore()
  const {
    loading: inviteLoading,
    error: inviteError,
    sendInvitation,
  } = useInvitation()
  const { user } = useUserStore()
  const [email, setEmail] = useState<string>('')
  const [pendingInvites, setPendingInvites] = useState<Invitation[]>([])

  const handleAddByEmail = async (email: string) => {
    if (!currentFamily || !user) return
    try {
      setEmail('')

      // Fetch existing user profile by email
      const users = await UserService.getUsersByName(email)
      const existingUser = users.find(
        (user) => user.email === email && user.uid !== currentUserId
      )
      if (!existingUser) {
        setPendingInvites([
          ...pendingInvites,
          {
            email,
            role: 'other',
            familyId: currentFamily.id,
            invitedBy: user.email,
          },
        ])
      } else {
        setPendingInvites([
          ...pendingInvites,
          {
            id: existingUser.uid,
            email,
            role: 'other',
            familyId: currentFamily.id,
            invitedBy: user.email,
          },
        ])
      }
    } catch (error) {
      console.error('Error adding by email', error)
    }
  }

  const handleInvite = async (invite: Invitation) => {
    if (!invite.email.trim() || !currentFamily || !user || !user.displayName)
      return

    console.log(
      invite.email.trim(),
      currentFamily?.id,
      currentUserId,
      currentFamily?.name,
      user?.displayName,
      invite.role
    )

    try {
      setPendingInvites(
        pendingInvites.map((pendingInvite) =>
          pendingInvite.email === invite.email
            ? { ...pendingInvite, status: 'sent' }
            : pendingInvite
        )
      )
    } catch (error) {
      console.error('Error changing invite status', error)
    }

    // const result = await sendInvitation(
    //   invite.email.trim(),
    //   currentFamily.id,
    //   currentUserId,
    //   currentFamily.name,
    //   user.displayName,
    //   invite.role
    // )

    // if (result.success) {
    //   console.log(result)
    // }
  }

  const handleRemoveEmail = (email: string) => {
    try {
      setPendingInvites(
        pendingInvites.filter((invite) => invite.email !== email)
      )
    } catch (error) {
      console.error('Error removing email', error)
    }
  }

  const handleRoleChange = (email: string, role: FamilyRole) => {
    try {
      setPendingInvites(
        pendingInvites.map((invite) =>
          invite.email === email ? { ...invite, role } : invite
        )
      )
    } catch (error) {
      console.error('Error changing role', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()

    if (!currentFamily?.id || pendingInvites.length === 0) {
      return
    }

    try {
      for (const invite of pendingInvites) {
        console.log('Invite: ', currentFamily.id, invite)
        // await addFamilyMember(currentFamily.id, invite.userId, invite.role)
      }

      handleClose(close)
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting', error)
    }
  }

  const handleClose = (close: () => void) => {
    clearError()
    close()
  }

  if (!isOpen) return null

  return (
    <Modal onClose={onClose} containerClassName="max-w-md w-full">
      {(close) => (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              id="modal-title"
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2"
            >
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

          {/* Form */}
          <form className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="invite-by-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Invite by email
              </label>
              <div className="flex justify-between gap-4">
                <input
                  id="invite-by-email"
                  type="text"
                  value={email}
                  placeholder="Enter email address"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
                <Button
                  variant="outline"
                  onClick={() => handleAddByEmail(email)}
                  disabled={!email.trim()}
                >
                  Add
                </Button>
              </div>
            </div>

            <div>
              {pendingInvites.map((invite) => (
                <div
                  key={invite.email}
                  className="flex justify-between gap-4 items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/35 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="text-sm text-gray-900 dark:text-white truncate">
                    {invite.email}
                  </div>
                  <Select
                    label="Role"
                    name="invited-role"
                    value={invite.role || 'other'}
                    items={[
                      { label: 'Parent', value: 'parent' },
                      { label: 'Guardian', value: 'guardian' },
                      { label: 'Child', value: 'child' },
                      { label: 'Grandmother', value: 'grandmother' },
                      { label: 'Grandfather', value: 'grandfather' },
                      { label: 'Aunt', value: 'aunt' },
                      { label: 'Uncle', value: 'uncle' },
                      { label: 'Cousin', value: 'cousin' },
                      { label: 'Sibling', value: 'sibling' },
                      { label: 'Other', value: 'other' },
                    ]}
                    onValueChange={(value) =>
                      handleRoleChange(invite.email, value as FamilyRole)
                    }
                    disabled={invite.status === 'sent'}
                  />
                  {!invite.id && (
                    <Button
                      type="button"
                      variant={
                        invite.status === 'sent' ? 'secondary' : 'outline'
                      }
                      onClick={() => handleInvite(invite)}
                      disabled={invite.status === 'sent'}
                    >
                      {invite.status === 'sent' ? 'Sent' : 'Invite'}
                    </Button>
                  )}
                  {invite.id && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveEmail(invite.email)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </form>

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
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}

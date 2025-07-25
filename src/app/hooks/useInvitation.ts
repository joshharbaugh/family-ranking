import { useState } from 'react'
import { User } from 'firebase/auth'
import { useAuth } from '@/app/hooks/useAuth'
import { InvitationService } from '@/app/services/invitation-service'
import { EmailService } from '@/app/services/email-service'
import { FamilyRole } from '@/lib/definitions/family'
import { FamilyService } from '@/app/services/family-service'

export const useInvitation = () => {
  const { signUpWithEmail } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const invitationService = new InvitationService()
  const emailService = new EmailService()

  const sendInvitation = async (
    email: string,
    familyId: string,
    invitedBy: string,
    familyName: string,
    inviterName?: string,
    role?: FamilyRole
  ) => {
    setLoading(true)
    setError(null)

    try {
      const token = await invitationService.createInvitation(
        email,
        familyId,
        invitedBy,
        familyName,
        role
      )
      const status = await emailService.sendInvitationEmail(
        email,
        token,
        familyName,
        inviterName,
        role
      )

      return Promise.allSettled([token, status])
        .then(() => {
          return { success: status === 200, token }
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to send invitation'
          setError(errorMessage)
          return { success: false, error: errorMessage, token: null }
        })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send invitation'
      setError(errorMessage)
      return { success: false, error: errorMessage, token: null }
    } finally {
      setLoading(false)
    }
  }

  const validateInvitation = async (token: string) => {
    setLoading(true)
    setError(null)

    try {
      const invitation = await invitationService.getInvitationByToken(token)
      if (!invitation) {
        throw new Error('Invalid invitation')
      }
      return { success: true, invitation }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid invitation'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const completeInvitation = async (
    token: string,
    password: string,
    displayName: string
  ): Promise<User | undefined> => {
    setLoading(true)
    setError(null)

    try {
      // First, get and validate the invitation
      const invitation = await invitationService.getInvitationByToken(token)
      if (!invitation) {
        throw new Error('Invalid invitation')
      }

      // Create Firebase Auth and Firestore users
      const userCredential = await signUpWithEmail(
        invitation.email,
        password,
        displayName
      )

      if (userCredential && userCredential.user) {
        // Mark invitation as accepted
        await invitationService.acceptInvitation(token)

        // Add the user to the family
        await FamilyService.addFamilyMember(
          invitation.familyId,
          userCredential.user.uid,
          invitation.role || 'other'
        )

        return userCredential.user
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to complete registration'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    sendInvitation,
    validateInvitation,
    completeInvitation,
  }
}

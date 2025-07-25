import { useState } from 'react'
import { InvitationService } from '@/app/services/invitation-service'
import { EmailService } from '@/app/services/email-service'
import { UserService } from '@/app/services/user-service'
import { createUserWithEmailAndPassword, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { FamilyRole } from '@/lib/definitions/family'

export const useInvitation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const invitationService = new InvitationService()
  const emailService = new EmailService()
  const userService = new UserService()

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
      await emailService.sendInvitationEmail(
        email,
        token,
        familyName,
        inviterName,
        role
      )
      return { success: true, token }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send invitation'
      setError(errorMessage)
      return { success: false, error: errorMessage }
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
    password: string
  ): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      // First, get and validate the invitation
      const invitation = await invitationService.getInvitationByToken(token)
      if (!invitation) {
        throw new Error('Invalid invitation')
      }

      // Create Firebase Auth user
      // TODO: Wire into existing AuthProvider
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        invitation.email,
        password
      )

      // Create user profile in Firestore
      await userService.createUserProfile(
        userCredential.user.uid,
        invitation.email,
        invitation.familyId,
        invitation.role
      )

      // Mark invitation as accepted
      await invitationService.acceptInvitation(token)

      return userCredential.user
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

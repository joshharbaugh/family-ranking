import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { v4 as uuidv4 } from 'uuid'
import { Invitation } from '@/lib/definitions'
import { FamilyRole } from '@/lib/definitions/family'

export class InvitationService {
  private getInvitationsRef() {
    return collection(db, 'invitations')
  }

  private getInvitationRef(invitation: Invitation) {
    return doc(db, 'invitations', invitation.id!)
  }

  async createInvitation(
    email: string,
    familyId: string,
    invitedBy: string,
    familyName?: string,
    role?: FamilyRole
  ): Promise<string> {
    const token = uuidv4()

    // Check if invitation already exists for this email and family
    const existingInvitation = await this.getInvitationByEmail(email, familyId)
    if (existingInvitation && existingInvitation.status === 'pending') {
      throw new Error('Invitation already sent to this email address')
    }

    const invitation: Omit<Invitation, 'id'> = {
      email,
      familyId,
      invitedBy,
      status: 'pending',
      createdAt: serverTimestamp() as Timestamp,
      token,
      familyName,
      role,
    }

    await addDoc(this.getInvitationsRef(), {
      ...invitation,
      createdAt: serverTimestamp() as Timestamp,
    })

    return token
  }

  async getInvitationByToken(token: string): Promise<Invitation | null> {
    const q = query(
      this.getInvitationsRef(),
      where('token', '==', token),
      where('status', '==', 'pending')
    )

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null

    const docData = querySnapshot.docs[0]
    const data = docData.data()

    return {
      id: docData.id,
      ...data,
    } as Invitation
  }

  async getInvitationByEmail(
    email: string,
    familyId: string
  ): Promise<Invitation | null> {
    const q = query(
      this.getInvitationsRef(),
      where('email', '==', email),
      where('familyId', '==', familyId)
    )

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null

    const docData = querySnapshot.docs[0]
    const data = docData.data()

    return {
      id: docData.id,
      ...data,
    } as Invitation
  }

  async acceptInvitation(token: string): Promise<Invitation> {
    const invitation = await this.getInvitationByToken(token)
    if (!invitation) {
      throw new Error('Invalid invitation')
    }

    await updateDoc(this.getInvitationRef(invitation), {
      status: 'accepted',
    })

    return invitation
  }
}

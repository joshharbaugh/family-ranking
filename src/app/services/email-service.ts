import { FamilyRole } from '@/lib/definitions/family'

export class EmailService {
  async sendInvitationEmail(
    email: string,
    token: string,
    familyName: string,
    inviterName?: string,
    role?: FamilyRole
  ): Promise<number> {
    const inviteLink = `${window.location.origin}/signin?token=${token}&email=${encodeURIComponent(email)}`

    const response = await fetch('/api/send-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `You're invited to join ${familyName}${role ? ' as a ' + role : ''}!`,
        inviteLink,
        familyName,
        inviterName,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send invitation email')
    }

    return response.status
  }
}

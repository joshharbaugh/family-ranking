import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const { to, subject, inviteLink, familyName, inviterName } = await req.json()

  // Configure a transporter that talks to Ethereal
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.ETHEREAL_USERNAME,
      pass: process.env.ETHEREAL_PASSWORD,
    },
  })

  const emailHtml = `
    <h2>You're invited to join ${familyName}!</h2>
    <p>${inviterName ? `${inviterName} has` : 'You have been'} invited you to join their family.</p>
    <p><a href="${inviteLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Complete Registration</a></p>
  `

  try {
    // Send a message
    const info = await transporter.sendMail({
      from: 'noreply@localhost', // testing
      to,
      subject,
      html: emailHtml,
    })

    return new Response(
      JSON.stringify({
        success: !!info.messageId,
        messageId: info.messageId || null,
        preview: nodemailer.getTestMessageUrl(info) || null,
        error: !info.messageId ? 'Failed to send email' : null,
      })
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error,
      })
    )
  }
}

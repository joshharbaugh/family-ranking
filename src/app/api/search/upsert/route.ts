import { UserProfile } from '@/lib/definitions/user'
import { client } from '@/lib/upstash'

const index = client.index('users')

export async function POST(req: Request) {
  const { userId, updates, users } = await req.json()

  if (users) {
    await index.upsert(
      users.map((user: UserProfile) => ({
        id: user.uid,
        content: {
          ...user,
          updatedAt: new Date().toISOString(),
        },
      }))
    )
  } else {
    await index.upsert([
      {
        id: userId,
        content: {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
    ])
  }

  return new Response(JSON.stringify({ success: true }))
}

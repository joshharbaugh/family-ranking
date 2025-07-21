import { UserProfile } from '@/lib/definitions/user'

export class UpstashService {
  static async healthCheck() {
    const response = await fetch('/api/search')
    return response.json()
  }

  // Search for users in Upstash
  static async searchUsers(query: string, limit: number = 10) {
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    })
    return response.json()
  }

  // FUTURE : Suggest users in Upstash
  static async suggestUsers(prefix: string, limit: number = 5) {
    const response = await fetch('/api/search/suggest', {
      method: 'POST',
      body: JSON.stringify({ prefix, limit }),
    })
    return response.json()
  }

  // Update a single user in Upstash
  static async updateUser(userId: string, updates: Partial<UserProfile>) {
    const response = await fetch('/api/search/upsert', {
      method: 'POST',
      body: JSON.stringify({ userId, updates }),
    })
    return response.json()
  }

  // Update multiple users in Upstash
  static async updateUsers(users: UserProfile[]) {
    const response = await fetch('/api/search/upsert', {
      method: 'POST',
      body: JSON.stringify({ users }),
    })
    return response.json()
  }
}

import { client } from '@/lib/upstash'

const index = client.index('users')

// FUTURE : Suggest users (autocomplete)
export async function POST(req: Request) {
  const { prefix, limit } = await req.json()
  const results = await index.search({ query: prefix, limit })
  return new Response(JSON.stringify(results))
}

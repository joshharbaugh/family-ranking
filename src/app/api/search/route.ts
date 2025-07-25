import { client } from '@/lib/upstash'

const index = client.index('users')

export async function GET() {
  const results = await index.info()
  return new Response(JSON.stringify(results))
}

export async function POST(req: Request) {
  const { query, limit } = (await req.json()) as {
    query: string
    limit: number
  }

  const results = await index.search({ query, limit })
  const filteredResults = results
    .filter((result) => result.score > 0)
    .sort((a, b) => (b.score || 0) - (a.score || 0))

  return new Response(JSON.stringify(filteredResults))
}

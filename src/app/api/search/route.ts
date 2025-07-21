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

  return new Response(JSON.stringify(results))
}

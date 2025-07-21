import { Search } from '@upstash/search'

const client = Search.fromEnv()

export { client }

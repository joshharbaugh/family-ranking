import { Film, Tv, Book, Gamepad2, Music } from 'lucide-react'
import { GameBoxart } from '@/lib/definitions/index'

export const getInitials = (name: string | null) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const getMediaIcon = (type: string) => {
  switch (type) {
    case 'movie':
      return Film
    case 'tv':
      return Tv
    case 'book':
      return Book
    case 'game':
      return Gamepad2
    case 'song':
      return Music
    default:
      return Film
  }
}

export const getGameBoxart = (gameId?: string, boxart?: GameBoxart) => {
  if (!gameId || !boxart || !boxart.base_url || !boxart.data) return false
  const { base_url, data } = boxart

  // No boxart data found for this gameId
  if (!data[gameId]) return false

  return `${base_url.medium}${data[gameId][0].filename}`
}

export const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).getFullYear().toString()
}

export const roundToDecimal = (num: number, decimalPlaces: number) => {
  const factor = Math.pow(10, decimalPlaces)
  return Math.round(num * factor) / factor
}

/**
 * Creates a debounced version of a function that delays execution until after
 * the specified delay period has elapsed since the last invocation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | undefined

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

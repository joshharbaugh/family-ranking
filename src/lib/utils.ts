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

/**
 * Validates a user ID for security and format compliance
 *
 * Security rules:
 * - Must be 1-128 characters long (Firebase UID limit)
 * - Only alphanumeric characters, hyphens, and underscores allowed
 * - Cannot contain path traversal sequences (.., ./, .\)
 * - Cannot contain null bytes or control characters
 * - Cannot start or end with whitespace
 *
 * @param uid - The user ID to validate
 * @returns true if valid, false otherwise
 */
export const isValidUID = (uid: string | null | undefined): uid is string => {
  if (!uid || typeof uid !== 'string') {
    return false
  }

  // Check length constraints (Firebase UID is typically 28 chars, but allowing up to 128)
  if (uid.length === 0 || uid.length > 128) {
    return false
  }

  // Check for whitespace at start/end
  if (uid !== uid.trim()) {
    return false
  }

  // Check for valid characters only (alphanumeric, hyphen, underscore)
  // Firebase UIDs typically use alphanumeric + some special chars
  if (!/^[a-zA-Z0-9_-]+$/.test(uid)) {
    return false
  }

  // Check for path traversal attempts
  if (uid.includes('..') || uid.includes('./') || uid.includes('.\\')) {
    return false
  }

  // Check for null bytes and control characters
  if (/[\x00-\x1f\x7f]/.test(uid)) {
    return false
  }

  // Additional security: prevent common attack patterns
  const dangerousPatterns = [
    'script',
    'javascript',
    'vbscript',
    'onload',
    'onerror',
    'eval',
    'expression',
    'url',
    'import',
    'document',
    'window',
  ]

  const lowerUid = uid.toLowerCase()
  if (dangerousPatterns.some((pattern) => lowerUid.includes(pattern))) {
    return false
  }

  return true
}

/**
 * Sanitizes a user ID by removing or replacing dangerous characters
 * Should only be used as a fallback - prefer validation and rejection
 *
 * @param uid - The user ID to sanitize
 * @returns sanitized UID or null if unsalvageable
 */
export const sanitizeUID = (uid: string | null | undefined): string | null => {
  if (!uid || typeof uid !== 'string') {
    return null
  }

  // Basic cleanup
  let sanitized = uid.trim()

  // Remove dangerous characters, keep only alphanumeric, hyphen, underscore
  sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, '')

  // Check if anything meaningful remains
  if (sanitized.length === 0 || sanitized.length > 128) {
    return null
  }

  // Final validation
  return isValidUID(sanitized) ? sanitized : null
}

/**
 * Error class for invalid UID errors
 */
export class InvalidUIDError extends Error {
  constructor(uid: string, reason?: string) {
    const message = reason
      ? `Invalid user ID "${uid}": ${reason}`
      : `Invalid user ID "${uid}"`
    super(message)
    this.name = 'InvalidUIDError'
  }
}

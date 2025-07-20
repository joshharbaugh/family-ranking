import { describe, it, expect } from 'vitest'
import { Film, Tv, Book, Gamepad2, Music } from 'lucide-react'
import {
  getInitials,
  getMediaIcon,
  getGameBoxart,
  formatDate,
  roundToDecimal,
} from './utils'
import { GameBoxart } from '@/lib/definitions/index'

describe('getInitials', () => {
  it('should return initials from a full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
    expect(getInitials('Jane Smith')).toBe('JS')
    expect(getInitials('Alice Bob Charlie')).toBe('AB')
  })

  it('should handle single names', () => {
    expect(getInitials('John')).toBe('J')
    expect(getInitials('A')).toBe('A')
  })

  it('should handle null input', () => {
    expect(getInitials(null)).toBe('?')
  })

  it('should handle empty string', () => {
    expect(getInitials('')).toBe('?')
  })

  it('should convert to uppercase', () => {
    expect(getInitials('john doe')).toBe('JD')
    expect(getInitials('JANE smith')).toBe('JS')
  })

  it('should limit to 2 characters', () => {
    expect(getInitials('Alice Bob Charlie David')).toBe('AB')
  })
})

describe('getMediaIcon', () => {
  it('should return correct icons for valid media types', () => {
    expect(getMediaIcon('movie')).toBe(Film)
    expect(getMediaIcon('tv')).toBe(Tv)
    expect(getMediaIcon('book')).toBe(Book)
    expect(getMediaIcon('game')).toBe(Gamepad2)
    expect(getMediaIcon('song')).toBe(Music)
  })

  it('should return Film icon for unknown media types', () => {
    expect(getMediaIcon('unknown')).toBe(Film)
    expect(getMediaIcon('')).toBe(Film)
    expect(getMediaIcon('podcast')).toBe(Film)
  })

  it('should be case sensitive', () => {
    expect(getMediaIcon('Movie')).toBe(Film)
    expect(getMediaIcon('TV')).toBe(Film)
  })
})

describe('getGameBoxart', () => {
  const mockBoxart: GameBoxart = {
    base_url: {
      small: 'https://example.com/small/',
      medium: 'https://example.com/medium/',
      large: 'https://example.com/large/',
    },
    data: {
      '123': [
        {
          id: 1,
          type: 'front',
          side: 'front',
          filename: 'game123.jpg',
          resolution: 'medium',
        },
      ],
    },
  }

  it('should return correct boxart URL for valid input', () => {
    const result = getGameBoxart('123', mockBoxart)
    expect(result).toBe('https://example.com/medium/game123.jpg')
  })

  it('should return false when gameId is missing', () => {
    const result = getGameBoxart(undefined, mockBoxart)
    expect(result).toBe(false)
  })

  it('should return false when boxart is missing', () => {
    const result = getGameBoxart('123', undefined)
    expect(result).toBe(false)
  })

  it('should return false when base_url is missing', () => {
    const invalidBoxart = { ...mockBoxart, base_url: undefined }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getGameBoxart('123', invalidBoxart as any)
    expect(result).toBe(false)
  })

  it('should return false when data is missing', () => {
    const invalidBoxart = { ...mockBoxart, data: undefined }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getGameBoxart('123', invalidBoxart as any)
    expect(result).toBe(false)
  })

  it('should return false when gameId does not exist in data', () => {
    const result = getGameBoxart('999', mockBoxart)
    expect(result).toBe(false)
  })
})

describe('formatDate', () => {
  it('should return year from valid date string', () => {
    expect(formatDate('2023-01-15')).toBe('2023')
    expect(formatDate('1995-12-25')).toBe('1995')
    expect(formatDate('2020-06-01')).toBe('2020')
  })

  it('should handle different date formats', () => {
    expect(formatDate('2023/01/15')).toBe('2023')
    expect(formatDate('2023.01.15')).toBe('2023')
  })

  it('should return empty string for undefined input', () => {
    expect(formatDate(undefined)).toBe('')
  })

  it('should return empty string for empty string input', () => {
    expect(formatDate('')).toBe('')
  })

  it('should handle invalid date strings', () => {
    expect(formatDate('invalid-date')).toBe('NaN')
  })
})

describe('roundToDecimal', () => {
  it('should round to specified decimal places', () => {
    expect(roundToDecimal(3.14159, 2)).toBe(3.14)
    expect(roundToDecimal(3.14159, 3)).toBe(3.142)
    expect(roundToDecimal(3.14159, 0)).toBe(3)
  })

  it('should handle zero', () => {
    expect(roundToDecimal(0, 2)).toBe(0)
    expect(roundToDecimal(0, 0)).toBe(0)
  })

  it('should handle negative numbers', () => {
    expect(roundToDecimal(-3.14159, 2)).toBe(-3.14)
    expect(roundToDecimal(-3.14159, 3)).toBe(-3.142)
  })

  it('should handle large numbers', () => {
    expect(roundToDecimal(1234.5678, 2)).toBe(1234.57)
    expect(roundToDecimal(1234.5678, 0)).toBe(1235)
  })

  it('should handle numbers that are already rounded', () => {
    expect(roundToDecimal(3.14, 2)).toBe(3.14)
    expect(roundToDecimal(3, 2)).toBe(3)
  })
})

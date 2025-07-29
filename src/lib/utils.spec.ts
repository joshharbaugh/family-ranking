import { describe, it, expect, vi } from 'vitest'
import { Film, Tv, Book, Gamepad2, Music } from 'lucide-react'
import {
  getInitials,
  getMediaIcon,
  getGameBoxart,
  formatDate,
  roundToDecimal,
  debounce,
  isValidUID,
  sanitizeUID,
  InvalidUIDError,
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

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should delay function execution', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('test')
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('should cancel previous calls when called multiple times', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('first')
    debouncedFn('second')
    debouncedFn('third')

    vi.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('third')
  })

  it('should work with multiple arguments', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('arg1', 'arg2', 'arg3')
    vi.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })

  it('should reset the timer when called again before delay', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('first')
    vi.advanceTimersByTime(200)

    debouncedFn('second') // Should reset the timer
    vi.advanceTimersByTime(200)

    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100) // Total 300ms from the second call
    expect(mockFn).toHaveBeenCalledWith('second')
  })

  it('should handle async functions', async () => {
    const mockAsyncFn = vi.fn().mockResolvedValue('result')
    const debouncedFn = debounce(mockAsyncFn, 300)

    debouncedFn('test')
    vi.advanceTimersByTime(300)

    expect(mockAsyncFn).toHaveBeenCalledWith('test')
  })

  it('should work with no arguments', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn()
    vi.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledWith()
  })
})

describe('isValidUID', () => {
  it('should accept valid Firebase-style UIDs', () => {
    expect(isValidUID('abc123DEF456')).toBe(true)
    expect(isValidUID('user-123_456')).toBe(true)
    expect(isValidUID('A1B2C3D4E5F6G7H8I9J0K1L2M3N4')).toBe(true)
    expect(isValidUID('firebase-uid-example-123')).toBe(true)
  })

  it('should reject null, undefined, or empty strings', () => {
    expect(isValidUID(null)).toBe(false)
    expect(isValidUID(undefined)).toBe(false)
    expect(isValidUID('')).toBe(false)
  })

  it('should reject non-string values', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isValidUID(123 as any)).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isValidUID({} as any)).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isValidUID([] as any)).toBe(false)
  })

  it('should reject UIDs that are too long', () => {
    const longUID = 'a'.repeat(129) // 129 characters, exceeds 128 limit
    expect(isValidUID(longUID)).toBe(false)
  })

  it('should reject UIDs with whitespace at start/end', () => {
    expect(isValidUID(' validUID')).toBe(false)
    expect(isValidUID('validUID ')).toBe(false)
    expect(isValidUID(' validUID ')).toBe(false)
    expect(isValidUID('\tvalidUID')).toBe(false)
    expect(isValidUID('validUID\n')).toBe(false)
  })

  it('should reject UIDs with invalid characters', () => {
    expect(isValidUID('user@domain.com')).toBe(false) // @ and . not allowed
    expect(isValidUID('user/profile')).toBe(false) // / not allowed
    expect(isValidUID('user\\profile')).toBe(false) // \ not allowed
    expect(isValidUID('user profile')).toBe(false) // space not allowed
    expect(isValidUID('user<script>')).toBe(false) // < and > not allowed
    expect(isValidUID('user%20name')).toBe(false) // % not allowed
  })

  it('should reject path traversal attempts', () => {
    expect(isValidUID('../admin')).toBe(false)
    expect(isValidUID('user/../admin')).toBe(false)
    expect(isValidUID('./config')).toBe(false)
    expect(isValidUID('user.\\admin')).toBe(false)
  })

  it('should reject control characters and null bytes', () => {
    expect(isValidUID('user\x00admin')).toBe(false) // null byte
    expect(isValidUID('user\x01admin')).toBe(false) // control character
    expect(isValidUID('user\x1fadmin')).toBe(false) // control character
    expect(isValidUID('user\x7fadmin')).toBe(false) // DEL character
  })

  it('should reject dangerous script patterns', () => {
    expect(isValidUID('javascript-code')).toBe(false)
    expect(isValidUID('user-script-tag')).toBe(false)
    expect(isValidUID('vbscript-injection')).toBe(false)
    expect(isValidUID('onload-handler')).toBe(false)
    expect(isValidUID('eval-function')).toBe(false)
    expect(isValidUID('document-access')).toBe(false)
    expect(isValidUID('window-object')).toBe(false)
    expect(isValidUID('expression-eval')).toBe(false)
    expect(isValidUID('url-redirect')).toBe(false)
    expect(isValidUID('import-module')).toBe(false)
  })

  it('should handle edge cases', () => {
    expect(isValidUID('a')).toBe(true) // single character
    expect(isValidUID('1')).toBe(true) // single digit
    expect(isValidUID('_')).toBe(true) // single underscore
    expect(isValidUID('-')).toBe(true) // single hyphen
    expect(isValidUID('a'.repeat(128))).toBe(true) // exactly 128 characters
  })
})

describe('sanitizeUID', () => {
  it('should return valid UIDs unchanged', () => {
    expect(sanitizeUID('validUID123')).toBe('validUID123')
    expect(sanitizeUID('user-profile_123')).toBe('user-profile_123')
  })

  it('should return null for null/undefined input', () => {
    expect(sanitizeUID(null)).toBe(null)
    expect(sanitizeUID(undefined)).toBe(null)
  })

  it('should return null for non-string input', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(sanitizeUID(123 as any)).toBe(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(sanitizeUID({} as any)).toBe(null)
  })

  it('should trim whitespace', () => {
    expect(sanitizeUID(' validUID ')).toBe('validUID')
    expect(sanitizeUID('\tvalidUID\n')).toBe('validUID')
  })

  it('should remove invalid characters', () => {
    expect(sanitizeUID('user@domain.com')).toBe('userdomaincom')
    expect(sanitizeUID('user/profile\\test')).toBe('userprofiletest')
    expect(sanitizeUID('user profile name')).toBe('userprofilename')
    expect(sanitizeUID('user<tag>alert()</tag>')).toBe('usertagalerttag')
  })

  it('should return null if result is empty or too long', () => {
    expect(sanitizeUID('@#$%^&*()')).toBe(null) // only invalid chars
    expect(sanitizeUID('a'.repeat(200))).toBe(null) // too long after sanitization
    expect(sanitizeUID('   ')).toBe(null) // only whitespace
  })

  it('should return null if sanitized result is still invalid', () => {
    // This tests the final validation step
    expect(sanitizeUID('')).toBe(null)
  })

  it('should return null for dangerous patterns even after sanitization', () => {
    expect(sanitizeUID('user<script>alert()</script>')).toBe(null) // contains 'script'
    expect(sanitizeUID('user<javascript>code</javascript>')).toBe(null) // contains 'javascript'
    expect(sanitizeUID('user<eval>code</eval>')).toBe(null) // contains 'eval'
    expect(sanitizeUID('user<document>data</document>')).toBe(null) // contains 'document'
  })

  it('should handle complex sanitization cases', () => {
    expect(sanitizeUID('user@domain.com_123')).toBe('userdomaincom_123')
    expect(sanitizeUID('  user-profile_test  ')).toBe('user-profile_test')
    expect(sanitizeUID('user123!@#$%test456')).toBe('user123test456')
  })
})

describe('InvalidUIDError', () => {
  it('should create error with UID and default message', () => {
    const error = new InvalidUIDError('invalidUID')
    expect(error.name).toBe('InvalidUIDError')
    expect(error.message).toBe('Invalid user ID "invalidUID"')
    expect(error).toBeInstanceOf(Error)
  })

  it('should create error with UID and custom reason', () => {
    const error = new InvalidUIDError(
      'invalidUID',
      'contains illegal characters'
    )
    expect(error.name).toBe('InvalidUIDError')
    expect(error.message).toBe(
      'Invalid user ID "invalidUID": contains illegal characters'
    )
    expect(error).toBeInstanceOf(Error)
  })

  it('should be catchable as Error', () => {
    expect(() => {
      throw new InvalidUIDError('test')
    }).toThrow(Error)
  })

  it('should be catchable as InvalidUIDError', () => {
    expect(() => {
      throw new InvalidUIDError('test')
    }).toThrow(InvalidUIDError)
  })
})

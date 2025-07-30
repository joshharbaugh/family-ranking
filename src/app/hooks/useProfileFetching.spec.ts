import { describe, it, expect } from 'vitest'
import { useProfileFetching } from './useProfileFetching'

// Basic interface test without complex mocking
describe('useProfileFetching', () => {
  it('should export the hook function', () => {
    expect(typeof useProfileFetching).toBe('function')
  })

  it('should have the correct function signature', () => {
    // The hook function should accept an options object and return the expected interface
    expect(useProfileFetching.length).toBe(1) // Single parameter (options object)
  })
})

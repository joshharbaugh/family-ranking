'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserService } from '@/app/services/user-service'
import { UserProfile } from '@/lib/definitions/user'

interface UseUserSearchOptions {
  debounceMs?: number
  minSearchLength?: number
  maxResults?: number
}

interface SearchResult extends UserProfile {
  _score?: number
  relevance?: 'exact' | 'prefix' | 'fuzzy' | 'partial'
}

interface UseUserSearchReturn {
  results: SearchResult[]
  loading: boolean
  error: string | null
  search: (query: string) => void
  clearResults: () => void
  suggestions: string[]
}

export function useUserSearch(
  options: UseUserSearchOptions = {}
): UseUserSearchReturn {
  const { debounceMs = 300, minSearchLength = 2, maxResults = 10 } = options

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  )

  const clearResults = useCallback(() => {
    setResults([])
    setSuggestions([])
    setError(null)
  }, [])

  const search = useCallback(
    async (query: string) => {
      setLoading(true)

      // Clear previous timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }

      // Clear results if query is empty
      if (!query || query.trim().length === 0) {
        clearResults()
        setLoading(false)
        return
      }

      // Set up debounced search
      const timeout = setTimeout(async () => {
        // Check minimum length
        if (query.trim().length < minSearchLength) {
          setError(
            `Search query must be at least ${minSearchLength} characters`
          )
          setLoading(false)
          return
        }

        setError(null)

        try {
          const searchTerm = query.trim()

          // Get search results
          const searchResults = await UserService.getUsersByName(
            searchTerm,
            maxResults
          )

          // Process and score results
          const processedResults: SearchResult[] = searchResults.map((user) => {
            const displayNameLower = user.displayName.toLowerCase()
            const searchTermLower = searchTerm.toLowerCase()

            let relevance: SearchResult['relevance'] = 'partial'
            let score = 0

            // Determine relevance and score
            // FUTURE : Use Upstash to determine relevance and score
            if (displayNameLower === searchTermLower) {
              relevance = 'exact'
              score = 100
            } else if (displayNameLower.startsWith(searchTermLower)) {
              relevance = 'prefix'
              score = 80
            } else if (displayNameLower.includes(searchTermLower)) {
              relevance = 'partial'
              score = 60
            } else {
              // Fuzzy match (handled by Upstash)
              relevance = 'fuzzy'
              score = 40
            }

            // Boost score if user has a profile picture
            if (user.photoURL) {
              score += 5
            }

            // Boost score if user has a bio
            if (user.bio) {
              score += 3
            }

            return {
              ...user,
              _score: score,
              relevance,
            }
          })

          // Sort by score (highest first)
          processedResults.sort((a, b) => (b._score || 0) - (a._score || 0))

          setResults(processedResults)
        } catch (err) {
          console.error('Search error:', err)
          setError(
            err instanceof Error ? err.message : 'Failed to search users'
          )
          setResults([])
        } finally {
          setLoading(false)
        }
      }, debounceMs)

      setSearchTimeout(timeout)
    },
    [debounceMs, minSearchLength, maxResults, searchTimeout, clearResults]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  return {
    results,
    loading,
    error,
    search,
    clearResults,
    suggestions,
  }
}

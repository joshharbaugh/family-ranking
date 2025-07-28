import React, { useState } from 'react'
import { useUserSearch } from '@/app/hooks/useUserSearch'
import { Search, Mail, X, User, Sparkles, Clock } from 'lucide-react'
import { SearchResult } from '@/lib/definitions'
import { UserProfile } from '@/lib/definitions/user'
import Image from 'next/image'
// import Button from '@/lib/ui/button'
// import Select from '@/lib/ui/select'

interface UserSearchProps {
  currentUserId: string
  onUserSelect?: (user: UserProfile) => void
  placeholder?: string
  className?: string
  showSuggestions?: boolean
  maxResults?: number
}

export const UserSearch = React.memo(function UserSearch({
  currentUserId,
  onUserSelect,
  placeholder = 'Search users...',
  className = '',
  showSuggestions = true,
  maxResults = 10,
}: UserSearchProps) {
  const [query, setQuery] = useState('')

  const { results, loading, error, search, clearResults, suggestions } =
    useUserSearch({
      debounceMs: 300,
      minSearchLength: 2,
      maxResults,
    })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim()) {
      search(value)
    } else {
      clearResults()
    }
  }

  const handleUserSelect = (user: UserProfile) => {
    console.log('handleUserSelect', user)
    if (user.uid === currentUserId) {
      return
    }
    onUserSelect?.(user)
    setQuery('')
    clearResults()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    search(suggestion)
  }

  const getRelevanceIcon = (relevance: SearchResult['relevance']) => {
    switch (relevance) {
      case 'exact':
        return <Sparkles className="w-4 h-4 text-green-500" />
      case 'prefix':
        return <Search className="w-4 h-4 text-blue-500" />
      case 'fuzzy':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRelevanceText = (relevance: SearchResult['relevance']) => {
    switch (relevance) {
      case 'exact':
        return 'Exact match'
      case 'prefix':
        return 'Starts with'
      case 'fuzzy':
        return 'Similar match'
      default:
        return 'Contains'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {/* Loading Indicator */}
        {loading && (
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
        )}
        {query && (
          <button
            onClick={() => {
              setQuery('')
              clearResults()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {!loading && error && (
        <div className="absolute top-full left-0 right-0 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-lg z-10">
          <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
        </div>
      )}

      {/* Search Results */}
      {!loading && results.length > 0 && !error && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-10 max-h-[200px] overflow-y-auto">
          {results.map((user) => (
            <div
              key={user.uid}
              onClick={() => handleUserSelect(user)}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/35 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                      width={40}
                      height={40}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {user.displayName}{' '}
                      {user.uid === currentUserId && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {' '}
                          (You)
                        </span>
                      )}
                    </span>
                    {user.relevance && (
                      <div className="flex items-center space-x-1">
                        {getRelevanceIcon(user.relevance)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getRelevanceText(user.relevance)}
                        </span>
                      </div>
                    )}
                  </div>

                  {user.email && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </span>
                    </div>
                  )}

                  {user.bio && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* Score Indicator */}
                {user._score && (
                  <div className="flex-shrink-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Score: {user._score}
                    </div>
                  </div>
                )}

                {/* <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => handleUserSelect(user)}
                    disabled={user.uid === currentUserId}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Select
                    label="Role"
                    name="role"
                    value={user.role || 'other'}
                    items={[
                      { label: 'Parent', value: 'parent' },
                      { label: 'Guardian', value: 'guardian' },
                      { label: 'Child', value: 'child' },
                      { label: 'Grandmother', value: 'grandmother' },
                      { label: 'Grandfather', value: 'grandfather' },
                      { label: 'Aunt', value: 'aunt' },
                      { label: 'Uncle', value: 'uncle' },
                      { label: 'Cousin', value: 'cousin' },
                      { label: 'Sibling', value: 'sibling' },
                      { label: 'Other', value: 'other' },
                    ]}
                    onValueChange={(value) => (user.role = value as FamilyRole)}
                    className="z-100"
                  />
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions &&
        suggestions.length > 0 &&
        results.length === 0 &&
        !loading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
                Suggestions:
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* No Results */}
      {!loading &&
        results.length === 0 &&
        suggestions.length === 0 &&
        query.trim().length >= 2 &&
        !error && (
          <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              No users found for `{query}`
            </div>
          </div>
        )}
    </div>
  )
})

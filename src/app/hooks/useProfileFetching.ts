'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { UserProfile, UserStats } from '@/lib/definitions/user'
import { UserService } from '@/app/services/user-service'
import { InvalidUIDError, debounce } from '@/lib/utils'
import { useUserStore } from '@/app/store/user-store'
import { useRankings } from '@/app/hooks/useRankings'

interface UseProfileFetchingOptions {
  targetUserId?: string
  paramsLoaded: boolean
  debounceMs?: number
}

interface UseProfileFetchingReturn {
  viewedProfile: UserProfile | null
  stats: UserStats | null
  loading: boolean
  error: string | null
  isOwnProfile: boolean
  refetchProfile: () => void
  clearError: () => void
}

export function useProfileFetching({
  targetUserId,
  paramsLoaded,
  debounceMs = 300,
}: UseProfileFetchingOptions): UseProfileFetchingReturn {
  const currentUserProfile = useUserStore((state) => state.userProfile)
  const { getUserStats, rankings } = useRankings()
  
  // Determine if we're viewing our own profile or someone else's
  const isOwnProfile = !targetUserId || targetUserId === currentUserProfile?.uid
  
  // State for the profile being viewed (could be current user or other user)
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(
    isOwnProfile ? currentUserProfile : null
  )
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Keep track of the current fetch to avoid race conditions
  const currentFetchRef = useRef<string | null>(null)

  // Clear error function
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Memoized profile fetching function to prevent unnecessary recreations
  const fetchProfileData = useCallback(
    async (userId?: string, isOwn: boolean = false) => {
      // Don't fetch data until params are loaded
      if (!paramsLoaded) {
        return
      }

      // Create a unique identifier for this fetch
      const fetchId = `${userId || 'own'}-${Date.now()}`
      currentFetchRef.current = fetchId

      try {
        setLoading(true)
        setError(null)

        let profileToView: UserProfile | null = null

        if (isOwn) {
          // Use current user's profile from store
          profileToView = currentUserProfile
        } else {
          // Fetch other user's profile
          if (userId) {
            try {
              profileToView = await UserService.getUserProfile(userId)

              // Check if this fetch is still the current one (prevent race conditions)
              if (currentFetchRef.current !== fetchId) {
                return // Abort if a newer fetch has started
              }

              if (!profileToView) {
                setError('User not found')
                setLoading(false)
                return
              }
            } catch (fetchError) {
              // Check if this fetch is still the current one
              if (currentFetchRef.current !== fetchId) {
                return
              }

              if (fetchError instanceof InvalidUIDError) {
                setError('Invalid user ID format')
              } else {
                setError('Failed to load user profile')
              }
              setLoading(false)
              return
            }
          }
        }

        // Final race condition check before updating state
        if (currentFetchRef.current !== fetchId) {
          return
        }

        if (profileToView) {
          setViewedProfile(profileToView)

          // For now, only get stats for current user - will enhance in Phase 3
          if (isOwn) {
            const userStats = await getUserStats()

            // Final check before setting stats
            if (currentFetchRef.current === fetchId) {
              setStats(userStats)
            }
          } else {
            // Placeholder for other users' stats - will implement in Phase 3
            setStats(null)
          }
        }
      } catch (err) {
        // Only update error if this is still the current fetch
        if (currentFetchRef.current === fetchId) {
          console.error('Error fetching profile data:', err)
          setError('Failed to load profile')
        }
      } finally {
        // Only update loading if this is still the current fetch
        if (currentFetchRef.current === fetchId) {
          setLoading(false)
        }
      }
    },
    [paramsLoaded, currentUserProfile, getUserStats]
  )

  // Create debounced version of fetchProfileData
  const debouncedFetchProfile = useMemo(
    () => debounce(fetchProfileData, debounceMs),
    [fetchProfileData, debounceMs]
  )

  // Manual refetch function for external use
  const refetchProfile = useCallback(() => {
    if (isOwnProfile) {
      fetchProfileData(undefined, true)
    } else if (targetUserId) {
      fetchProfileData(targetUserId, false)
    }
  }, [isOwnProfile, targetUserId, fetchProfileData])

  // Effect to trigger profile fetching when dependencies change
  useEffect(() => {
    if (!paramsLoaded) {
      return
    }

    // For own profile, fetch immediately (no debouncing needed)
    if (isOwnProfile) {
      fetchProfileData(undefined, true)
    } else {
      // For other users' profiles, use debouncing to prevent excessive API calls
      if (targetUserId) {
        debouncedFetchProfile(targetUserId, false)
      }
    }
  }, [
    paramsLoaded,
    targetUserId,
    isOwnProfile,
    fetchProfileData,
    debouncedFetchProfile,
  ])

  // Also trigger when current user profile or rankings change (for own profile)
  useEffect(() => {
    if (paramsLoaded && isOwnProfile) {
      fetchProfileData(undefined, true)
    }
  }, [
    currentUserProfile,
    rankings,
    paramsLoaded,
    isOwnProfile,
    fetchProfileData,
  ])

  // Cleanup effect to cancel pending debounced calls on unmount
  useEffect(() => {
    return () => {
      // Clear any pending fetch to prevent state updates after unmount
      currentFetchRef.current = null
    }
  }, [])

  return {
    viewedProfile,
    stats,
    loading,
    error,
    isOwnProfile,
    refetchProfile,
    clearError,
  }
}
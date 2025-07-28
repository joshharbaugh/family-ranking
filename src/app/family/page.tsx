'use client'

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from 'react'
import { Users, Plus } from 'lucide-react'
import { useFamilyStore } from '@/app/store/family-store'
import { useUserStore } from '@/app/store/user-store'
import { FamilyOverviewSkeleton } from '@/app/ui/skeletons'
import dynamic from 'next/dynamic'
import Loading from '@/lib/ui/loading'
import { Family } from '@/lib/definitions/family'
import { FamilyCard } from './ui/family-card'
import { ProtectedRoute } from '@/app/components/ProtectedRoute'

const FamilyOverview = dynamic(
  () => import('@/app/family/ui/overview'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { suspense: true } as any
)

const CreateFamilyModal = dynamic(
  () => import('@/app/ui/modals/family').then((mod) => mod.FamilyModal),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { suspense: true } as any
)

const FamilyPage: React.FC = () => {
  const {
    families,
    currentFamily,
    loading: familiesLoading,
    error,
    fetchUserFamilies,
    setCurrentFamily,
  } = useFamilyStore()
  const { user } = useUserStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchFamilies = useCallback(async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      await fetchUserFamilies(user.uid)
    } catch (error) {
      console.error('Error fetching user families:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.uid, fetchUserFamilies])

  useEffect(() => {
    if (user?.uid) fetchFamilies()
  }, [user?.uid, fetchFamilies])

  useEffect(() => {
    // If there is only one family, set it as the current family
    if (families && families.length === 1 && !currentFamily) {
      setCurrentFamily(families[0])
    }
  }, [families, setCurrentFamily, currentFamily])

  useEffect(() => {
    if (families) {
      setLoading(false)
    }
  }, [families])

  const handleCreateSuccess = useCallback(() => {
    // The store will automatically update with the new family
    setShowCreateModal(false)
  }, [])

  const handleShowCreateModal = useCallback(() => {
    setShowCreateModal(true)
  }, [])

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false)
  }, [])

  const handleFamilySelect = useCallback(
    (family: Family) => {
      setCurrentFamily(family)
    },
    [setCurrentFamily]
  )

  const familyCards = useMemo(() => {
    if (!families) return null
    return families.map((family) => (
      <FamilyCard
        key={family.id}
        family={family}
        isSelected={currentFamily?.id === family.id}
        onSelect={handleFamilySelect}
      />
    ))
  }, [families, currentFamily?.id, handleFamilySelect])

  if (loading || familiesLoading) {
    return <Loading />
  }

  if (!loading && !familiesLoading && families.length === 0) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          {/* Empty State */}
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No families yet!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Create a family to start sharing rankings and experiences with
              your loved ones.
            </p>
            <button
              onClick={handleShowCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Family
            </button>
          </div>

          {/* Create Family Modal (dynamic) */}
          {user?.uid && (
            <Suspense>
              <CreateFamilyModal
                currentUserId={user.uid}
                isOpen={showCreateModal}
                isNewFamily={true}
                onClose={handleCloseCreateModal}
                onSuccess={handleCreateSuccess}
              />
            </Suspense>
          )}
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Family
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your family profiles and settings
            </p>
          </div>

          <button
            onClick={handleShowCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Family
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Family Selection */}
        {families.length > 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Select Family
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {familyCards}
            </div>
          </div>
        )}

        {/* Current Family Overview (dynamic) */}
        {currentFamily && user && (
          <Suspense fallback={<FamilyOverviewSkeleton />}>
            <FamilyOverview family={currentFamily} currentUserId={user.uid} />
          </Suspense>
        )}

        {/* Create Family Modal (dynamic) */}
        {user?.uid && (
          <Suspense>
            <CreateFamilyModal
              currentUserId={user.uid}
              isOpen={showCreateModal}
              isNewFamily={true}
              onClose={handleCloseCreateModal}
              onSuccess={handleCreateSuccess}
            />
          </Suspense>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default FamilyPage

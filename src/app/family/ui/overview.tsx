'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { Users, Settings, Plus } from 'lucide-react'
import { Invitation } from '@/lib/definitions'
import { Family, FamilyMember } from '@/lib/definitions/family'
import { useFamilyStore } from '@/app/store/family-store'
import dynamic from 'next/dynamic'
import Loading from '@/lib/ui/loading'
import { MemberCard } from '@/app/family/ui/member-card'

const UpdateFamilyModal = dynamic(
  () => import('@/app/ui/modals/family').then((mod) => mod.FamilyModal),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { suspense: true } as any
)
const AddFamilyMemberModal = dynamic(
  () =>
    import('@/app/ui/modals/add-family-member').then(
      (mod) => mod.AddFamilyMemberModal
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { suspense: true } as any
)

interface FamilyOverviewProps {
  family: Family
  currentUserId: string
}

const FamilyOverview: React.FC<FamilyOverviewProps> = ({
  family,
  currentUserId,
}) => {
  const {
    invitations,
    familyMembers,
    fetchFamilyMembersWithDetails,
    fetchFamilyInvitations,
  } = useFamilyStore()
  const [showUpdateFamilyModal, setShowUpdateFamilyModal] = useState(false)
  const [showAddFamilyMemberModal, setShowAddFamilyMemberModal] =
    useState(false)

  const isCreator = family.createdBy === currentUserId
  const isParent = familyMembers.some(
    (member) => member.userId === currentUserId && member.role === 'parent'
  )

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        await fetchFamilyMembersWithDetails(family.id)
        await fetchFamilyInvitations(family.id)
      } catch (error) {
        console.error('Error fetching family members:', error)
      }
    }

    if (family.id) fetchFamilyMembers()
  }, [family.id, fetchFamilyMembersWithDetails, fetchFamilyInvitations])

  return (
    <div className="space-y-6">
      {/* Update Family Modal (dynamic) */}
      <Suspense>
        <UpdateFamilyModal
          currentUserId={currentUserId}
          isOpen={showUpdateFamilyModal}
          onClose={() => setShowUpdateFamilyModal(false)}
          onDelete={() => setShowUpdateFamilyModal(false)}
          onSuccess={() => setShowUpdateFamilyModal(false)}
        />
      </Suspense>

      {/* Add Family Member Modal (dynamic) */}
      <Suspense>
        <AddFamilyMemberModal
          currentUserId={currentUserId}
          isOpen={showAddFamilyMemberModal}
          onClose={() => setShowAddFamilyMemberModal(false)}
          onSuccess={() => setShowAddFamilyMemberModal(false)}
        />
      </Suspense>

      {/* Family Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              {family.name}
            </h2>
            {family.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {family.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{family.memberIds.length} members</span>
              <span>•</span>
              <span>
                Created{' '}
                {family.createdAt?.toDate?.()
                  ? family.createdAt.toDate().toLocaleDateString()
                  : 'Recently'}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            {(isCreator || isParent) && (
              <button
                onClick={() => setShowUpdateFamilyModal(true)}
                title="Update Family"
                className="cursor-pointer p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setShowAddFamilyMemberModal(true)}
              title="Add Family Member"
              className="cursor-pointer p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="grid md:grid-cols-2 auto-cols-fr gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Family Members
            </h3>

            <div className="grid gap-4">
              {(!familyMembers || familyMembers.length === 0) && (
                <Loading className="min-h-[94px]" />
              )}
              {familyMembers &&
                familyMembers.map((member: FamilyMember) => (
                  <MemberCard
                    key={member.userId}
                    member={member}
                    family={family}
                    currentUserId={currentUserId}
                  />
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 my-4 md:mt-0">
              Invitations
            </h3>

            <div className="grid gap-4">
              {invitations &&
                invitations
                  .filter(
                    (invitation: Invitation) => invitation.status === 'pending'
                  )
                  .map((invitation: Invitation) => (
                    <MemberCard
                      key={invitation.token}
                      member={invitation}
                      family={family}
                      currentUserId={currentUserId}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Family Settings Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Family Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                family.settings.allowChildRankings
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Child rankings{' '}
              {family.settings.allowChildRankings ? 'enabled' : 'disabled'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                family.settings.requireParentApproval
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Parent approval{' '}
              {family.settings.requireParentApproval
                ? 'required'
                : 'not required'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {family.settings.privacyLevel} privacy
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FamilyOverview

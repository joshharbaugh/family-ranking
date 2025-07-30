import React from 'react'
import Link from 'next/link'
import { Ellipsis } from 'lucide-react'
import { Invitation } from '@/lib/definitions'
import { Family, FamilyMember } from '@/lib/definitions/family'
import { UserProfile } from '@/lib/definitions/user'
import { UserAvatar } from '@/app/ui/user-avatar'
import Button from '@/lib/ui/button'
import { capitalize } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/lib/ui/dropdown-menu'

interface MemberCardProps {
  member: FamilyMember | Invitation
  family: Family
  currentUserId: string
}

// Type guards
function isFamilyMember(
  member: FamilyMember | Invitation
): member is FamilyMember {
  return 'displayName' in member && 'userId' in member
}

function isInvitation(member: FamilyMember | Invitation): member is Invitation {
  return 'email' in member && !('displayName' in member)
}

export const MemberCard = React.memo(function MemberCard({
  member,
  family,
  currentUserId,
  ...props
}: MemberCardProps) {
  const isFamilyCreator = () => {
    return currentUserId === family.createdBy
  }
  const isEditable = (member: FamilyMember | Invitation) => {
    if (isFamilyMember(member)) {
      return (
        currentUserId === family.createdBy || member.userId === currentUserId
      )
    }
    if (isInvitation(member)) {
      return currentUserId === family.createdBy || member.id === currentUserId
    }
    return currentUserId !== family.createdBy
  }

  return (
    <div
      {...props}
      className={`flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700`}
    >
      <div className="flex items-center gap-4">
        <UserAvatar
          viewedProfile={member as unknown as UserProfile}
          isOwnProfile={false}
          size="sm"
        />

        <div className="text-sm font-normal text-gray-900 dark:text-gray-100 truncate">
          {isFamilyMember(member) && (
            <Link
              className="text-indigo-600 dark:text-indigo-400"
              href={
                member.userId === currentUserId
                  ? `/profile`
                  : `/profile/${member.userId}`
              }
              target="_blank"
            >
              {member.displayName}
            </Link>
          )}
          {isInvitation(member) && <span>{member.email}</span>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {member.role && (
          <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full">
            {capitalize(member.role)}
          </span>
        )}

        {isInvitation(member) && member.createdAt && (
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
            Sent:{' '}
            {member.createdAt instanceof Date
              ? member.createdAt.toLocaleDateString()
              : member.createdAt &&
                  typeof member.createdAt.toDate === 'function'
                ? member.createdAt.toDate().toLocaleDateString()
                : ''}
          </span>
        )}

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="px-[6px] py-[6px] hover:dark:bg-gray-700/50 rounded-md outline-none"
                aria-label={`Family ${isFamilyMember(member) ? 'member' : 'invitation'} actions`}
              >
                <Ellipsis className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isFamilyMember(member) && (
                <DropdownMenuItem>
                  <Link
                    href={
                      member.userId === currentUserId
                        ? `/profile`
                        : `/profile/${member.userId}`
                    }
                    target="_blank"
                  >
                    View profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem disabled={!isEditable(member)}>
                Change role
              </DropdownMenuItem>
              {/* Only creator of a family may remove a family member */}
              {isFamilyCreator() && (
                <>
                  <DropdownMenuSeparator className="m-[5px] h-px bg-gray-300" />
                  <DropdownMenuItem variant="danger">Remove</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
})

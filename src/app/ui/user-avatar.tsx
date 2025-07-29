'use client'

import React from 'react'
import { Camera } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { UserProfile } from '@/lib/definitions/user'

type UserAvatarSize = 'sm' | 'md' | 'lg'

interface UserAvatarProps {
  viewedProfile: UserProfile
  isOwnProfile: boolean
  size?: UserAvatarSize
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  viewedProfile,
  isOwnProfile,
  size = 'lg',
}) => {
  const getSizeClasses = (size: UserAvatarSize) => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs'
      case 'md':
        return 'w-12 h-12 text-base'
      case 'lg':
        return 'w-24 h-24 text-3xl'
    }
  }

  return (
    <div className="relative group">
      <div
        className={`${getSizeClasses(size)} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
      >
        {getInitials(
          viewedProfile?.displayName || viewedProfile?.email || null
        )}
      </div>
      {isOwnProfile && size === 'lg' && (
        <button
          title="Change Avatar"
          className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      )}
    </div>
  )
}

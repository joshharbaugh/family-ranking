'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '@/app/hooks/useAuth'
import { useUserStore } from '@/app/store/user-store'
import { UserService } from '@/app/services/user-service'
import { UserProfile } from '@/lib/definitions/user'
import { getInitials } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const LoginModal = dynamic(
  () => import('@/app/ui/modals/login').then((mod) => mod.LoginModal),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { suspense: true } as any
)

const UserSettingsModal = dynamic(
  () =>
    import('@/app/ui/modals/user-settings').then(
      (mod) => mod.UserSettingsModal
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { suspense: true } as any
)

export function UserMenu() {
  const { logout } = useAuth()
  const {
    user,
    userProfile,
    updateUserProfile,
    logout: logoutUserStore,
  } = useUserStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSaveSettings = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return
    try {
      await UserService.updateUserProfile(userProfile.uid, updates)
      updateUserProfile({ ...userProfile, ...updates })
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  const handleLogin = () => {
    setShowLoginModal(true)
  }

  const handleLogout = async () => {
    try {
      await logout()
      logoutUserStore()
      // Redirect will be handled by auth state change
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  if (!user) {
    return (
      <>
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <User className="w-4 h-4" />
            Login
          </button>
        </div>
        {/* Login Modal (dynamic) */}
        {showLoginModal && (
          <Suspense>
            <LoginModal
              onClose={() => {
                setShowLoginModal(false)
              }}
            />
          </Suspense>
        )}
      </>
    )
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {getInitials(user?.displayName || user?.email || null)}
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={() => {
                setShowUserMenu(false)
                router.push('/profile')
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={() => {
                setShowUserMenu(false)
                setShowSettingsModal(true)
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
      {/* User Settings Modal (dynamic) */}
      {showSettingsModal && userProfile && (
        <Suspense>
          <UserSettingsModal
            userProfile={userProfile}
            onSave={handleSaveSettings}
            onClose={() => {
              setShowSettingsModal(false)
            }}
          />
        </Suspense>
      )}
    </>
  )
}

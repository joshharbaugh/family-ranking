'use client'

import React from 'react'
import { Search, Trophy, User, Users } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'

type TabType = 'search' | 'rankings' | 'profile' | 'family'

interface NavItem {
  id: TabType
  label: string
  icon: React.ReactNode
  path: string
}

export const Navigation = (): React.ReactElement => {
  const { user } = useAuth()
  const router = useRouter()
  const path = usePathname()

  const getActiveTab = () => {
    if (path === '/search' || path === '/') return 'search'
    if (path === '/rankings') return 'rankings'
    if (path === '/family') return 'family'
    if (path.startsWith('/profile')) return 'profile'
    return 'search'
  }

  const activeTab = getActiveTab()

  const navItems: NavItem[] = [
    {
      id: 'search',
      label: 'Search',
      icon: <Search className="w-4 h-4" />,
      path: '/search',
    },
    {
      id: 'rankings',
      label: 'Rankings',
      icon: <Trophy className="w-4 h-4" />,
      path: '/rankings',
    },
    {
      id: 'family',
      label: 'Family',
      icon: <Users className="w-4 h-4" />,
      path: '/family',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      path: '/profile',
    },
  ]

  const handleTabChange = (path: string) => {
    router.push(path)
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-8">
          {navItems.map((item) => (
            <button
              role="tab"
              key={item.id}
              onClick={() => handleTabChange(item.path)}
              disabled={!user && item.id !== 'search'}
              className={`disabled:opacity-50 py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors flex items-center gap-2 ${
                activeTab === item.id
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:hover:text-gray-500 disabled:dark:hover:text-gray-400'
              }`}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex justify-around py-2">
          {navItems.map((item) => (
            <button
              role="tab"
              key={item.id}
              onClick={() => handleTabChange(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

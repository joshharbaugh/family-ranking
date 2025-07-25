'use client'

import { Suspense } from 'react'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import { Header } from '@/app/ui/header'
import { Navigation } from '@/app/ui/navigation'
import Loading from '@/lib/ui/loading'

export function AppContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()
  const segment = useSelectedLayoutSegment()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Loading />
      </div>
    )
  }

  if (segment === 'signin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Suspense fallback={<Loading />}>
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </Suspense>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <Navigation />
      <Suspense fallback={<Loading />}>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </Suspense>
    </div>
  )
}

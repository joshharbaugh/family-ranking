'use client'

import { Suspense } from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import { Header } from '@/app/ui/header'
import { Navigation } from '@/app/ui/navigation'
import Loading from '@/lib/ui/loading'

export function AppContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()

  if (loading) return <Loading />

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

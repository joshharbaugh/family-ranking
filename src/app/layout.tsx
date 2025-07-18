import '@/app/globals.css'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/app/providers/auth'
import { Header } from '@/app/ui/header'
import { Navigation } from '@/app/ui/navigation'
import Loading from '@/lib/ui/Loading'
// import { WebVitals } from "@/app/_components/web-vitals";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: 'FamRank',
  description: "Your family's entertainment story",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* <WebVitals /> */}
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            <Header />
            <Navigation />

            <Suspense fallback={<Loading />}>
              <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
            </Suspense>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAuth } from '@/app/hooks/useAuth'
import { ProtectedRoute } from '.'

// Mock modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('@/app/hooks/useAuth')

// Mock functions
const mockPush = vi.fn()
const mockUseAuth = vi.mocked(useAuth)

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockUseAuth.mockClear()
  })

  it('shows loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    } as any)

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to signin when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    } as any)

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockPush).toHaveBeenCalledWith('/signin')
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: '123' },
      loading: false,
    } as any)

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('uses custom redirect path when provided', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    } as any)

    render(
      <ProtectedRoute redirectTo="/custom-signin">
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockPush).toHaveBeenCalledWith('/custom-signin')
  })
})

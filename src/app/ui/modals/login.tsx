'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, googleProvider } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { AlertCircle, Mail, User, Eye, EyeOff, Lock, X } from 'lucide-react'
import Modal from '@/app/ui/components/modal'
import TextInput from '@/app/ui/components/text-input'
import Button from '@/app/ui/components/button'

type AuthMode = 'login' | 'signup' | 'reset'

interface LoginModalProps {
  onClose: () => void
}

export const LoginModal = ({ onClose }: LoginModalProps) => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  useEffect(() => {
    // Clear errors when switching modes
    setLocalError('')
    setSuccessMessage('')
  }, [mode])

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault()
    setLocalError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setLocalError('Passwords do not match')
          setIsSubmitting(false)
          return
        }
        if (!displayName.trim()) {
          setLocalError('Please enter your name')
          setIsSubmitting(false)
          return
        }
        await createUserWithEmailAndPassword(auth, email, password)
        router.push('/search')
      } else if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
        router.push('/search')
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email)
        setSuccessMessage('Password reset email sent! Check your inbox.')
        setEmail('')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      if (err instanceof Error) {
        setLocalError(err.message)
      } else {
        setLocalError('An unknown error occurred.')
      }
    } finally {
      setIsSubmitting(false)
      close()
    }
  }

  const handleGoogleSignIn = async (close: () => void) => {
    setLocalError('')

    try {
      setIsSubmitting(true)
      await signInWithPopup(auth, googleProvider)
      router.push('/search')
    } catch (err) {
      console.error('Google sign-in failed:', err)
      if (err instanceof Error) {
        setLocalError(err.message)
      } else {
        setLocalError('An unknown error occurred.')
      }
    } finally {
      setIsSubmitting(false)
      close()
    }
  }

  return (
    <Modal onClose={onClose} containerClassName="relative max-w-md w-full">
      {(close) => (
        <>
          <button
            onClick={close}
            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {mode === 'login' && 'Welcome back'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'reset' && 'Reset your password'}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {mode === 'login' && "Don't have an account? "}
                {mode === 'signup' && 'Already have an account? '}
                {mode === 'reset' && 'Remember your password? '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Form */}
            <div className="pt-6 pb-4 px-4 sm:rounded-lg sm:px-10">
              {/* Error/Success Messages */}
              {localError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{localError}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm">
                  {successMessage}
                </div>
              )}

              <form
                onSubmit={(e) => handleSubmit(e, close)}
                className="space-y-6"
              >
                {/* Name field (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <TextInput
                        id="displayName"
                        name="displayName"
                        type="text"
                        autoComplete="name"
                        required={mode === 'signup'}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <TextInput
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password field */}
                {mode !== 'reset' && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <TextInput
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={
                          mode === 'login' ? 'current-password' : 'new-password'
                        }
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder={
                          mode === 'signup'
                            ? 'At least 6 characters'
                            : 'Enter your password'
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm password field (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <TextInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                )}

                {/* Forgot password link */}
                {mode === 'login' && (
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center"
                >
                  {isSubmitting
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Sign in'
                      : mode === 'signup'
                        ? 'Create account'
                        : 'Send reset email'}
                </Button>
              </form>

              {/* Divider */}
              {mode !== 'reset' && (
                <>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      onClick={() => handleGoogleSignIn(close)}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}

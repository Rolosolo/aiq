'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/adapters/auth/session'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, signIn, authRequired } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authRequired && !isLoading && !isAuthenticated) {
      // Force sign in if auth is required but user is not authenticated
      signIn()
    }
  }, [authRequired, isLoading, isAuthenticated, signIn])

  // If auth is required, we wait until authenticated before rendering children
  // Otherwise, we just render children
  if (authRequired) {
    if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-teal-400">
          <div className="text-xl">Verifying Security Credentials...</div>
        </div>
      )
    }
    
    if (!isAuthenticated) {
      return null // Will redirect via useEffect
    }
  }

  return <>{children}</>
}

'use client'

/**
 * CoralFil OS — Sign In Page
 *
 * Branded login portal for os.coralfil.com.
 * Redirects to home when REQUIRE_AUTH=false.
 * Delegates to AWS Cognito via NextAuth when REQUIRE_AUTH=true.
 */

import { type ReactNode, Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useAppConfig } from '@/shared/context'

// ── Error map ────────────────────────────────────────────────────────────────
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin:         'Failed to initiate sign-in. Check Cognito configuration.',
  OAuthCallback:       'Invalid authentication response from Cognito.',
  OAuthCreateAccount:  'Could not create your account. Contact your administrator.',
  Callback:            'Authentication callback error. Please try again.',
  OAuthAccountNotLinked: 'This email is linked to a different sign-in method.',
  SessionRequired:     'Your session has expired. Please sign in again.',
  Default:             'An authentication error occurred. Please try again.',
}

// ── Animated bioluminescent particle background ───────────────────────────────
function OceanBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep ocean gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020c18] via-[#041830] to-[#020c18]" />

      {/* Bioluminescent orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#00D9C0]/5 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-[#0066FF]/5 blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-[#00D9C0]/8 blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,217,192,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,192,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#00D9C0]/40"
          style={{
            left:  `${10 + i * 12}%`,
            top:   `${20 + (i % 3) * 25}%`,
            animation: `float-${i % 3} ${6 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
    </div>
  )
}

// ── Sign-in card content ──────────────────────────────────────────────────────
function SignInContent(): ReactNode {
  const router = useRouter()
  const { authRequired, authProviderId } = useAppConfig()
  const searchParams = useSearchParams()
  const error = searchParams?.get('error') ?? null
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!authRequired) router.replace('/')
  }, [authRequired, router])

  if (!authRequired) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[#00D9C0] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    await signIn(authProviderId, { callbackUrl: '/' })
    // setIsLoading(false) — will redirect, so no reset needed
  }

  const errorMsg = error ? (AUTH_ERROR_MESSAGES[error] ?? AUTH_ERROR_MESSAGES.Default) : null

  return (
    <div className="space-y-8">
      {/* Logo & branding */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#00D9C0] flex items-center justify-center shadow-[0_0_30px_rgba(0,217,192,0.4)]">
            <span className="text-2xl">🧬</span>
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-white">
          CoralFil<span className="text-[#00D9C0]"> OS</span>
        </h1>
        <p className="text-sm text-white/50 uppercase tracking-[0.2em]">
          Ocean Systems Intelligence Platform
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30 uppercase tracking-widest">Secure Access</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm">
          <span className="text-red-400 text-lg leading-none">⚠</span>
          <div>
            <p className="font-bold text-red-300 mb-0.5">Authentication Failed</p>
            <p className="text-red-400/80">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Sign in button */}
      <button
        id="cognito-signin-btn"
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.15em] transition-all duration-200 flex items-center justify-center gap-3
          bg-gradient-to-r from-[#00D9C0] to-[#00B5A3] text-[#020c18]
          hover:shadow-[0_0_30px_rgba(0,217,192,0.35)] hover:scale-[1.01]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-[#020c18] border-t-transparent rounded-full animate-spin" />
            Connecting to Cognito...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 7l10 5m0 0l10-5m-10 5v10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Sign in with AWS Cognito
          </>
        )}
      </button>

      {/* Info strip */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">🔒</span>
          Access is restricted to authorized CoralFil personnel.
        </div>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">👤</span>
          New users: contact <a href="mailto:admin@coralfil.com" className="text-[#00D9C0]/70 hover:text-[#00D9C0] underline underline-offset-2">admin@coralfil.com</a> to request access.
        </div>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">🌐</span>
          Looking for the public site? <a href="https://coralfil.com" target="_blank" rel="noreferrer" className="text-[#00D9C0]/70 hover:text-[#00D9C0] underline underline-offset-2 ml-1">coralfil.com →</a>
        </div>
      </div>
    </div>
  )
}

// ── Page shell ────────────────────────────────────────────────────────────────
export default function SignInPage(): ReactNode {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
      {/* Animated ocean background */}
      <OceanBackground />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-2xl border border-white/10 p-8 shadow-2xl"
          style={{
            background: 'rgba(4, 24, 48, 0.85)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#00D9C0] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <SignInContent />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/20 mt-6 leading-relaxed max-w-sm mx-auto">
          CoralFil OS is an internal research platform. By signing in you agree to the
          CoralFil Acceptable Use Policy. Session activity is logged for security purposes.
        </p>
      </div>

      {/* CSS for float animations */}
      <style jsx>{`
        @keyframes float-0 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes float-1 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  )
}

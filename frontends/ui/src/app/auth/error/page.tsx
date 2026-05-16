'use client'

/**
 * CoralFil OS — Auth Error Page
 * Shown when Cognito returns an unrecoverable authentication error.
 */

import { type ReactNode, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const ERROR_DETAILS: Record<string, { title: string; desc: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    desc:  'There is a problem with the server authentication configuration. Please contact your administrator.',
  },
  AccessDenied: {
    title: 'Access Denied',
    desc:  'You do not have permission to access CoralFil OS. If you believe this is an error, contact admin@coralfil.com.',
  },
  Verification: {
    title: 'Link Expired',
    desc:  'The sign-in link has expired or has already been used. Please request a new one.',
  },
  Default: {
    title: 'Authentication Error',
    desc:  'An unexpected error occurred during authentication. Please try again or contact support.',
  },
}

function ErrorContent(): ReactNode {
  const searchParams = useSearchParams()
  const errorCode = searchParams?.get('error') ?? 'Default'
  const { title, desc } = ERROR_DETAILS[errorCode] ?? ERROR_DETAILS.Default

  return (
    <div className="space-y-6 text-center">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
      </div>

      {/* Text */}
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-white mb-2">{title}</h1>
        <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
        {errorCode !== 'Default' && (
          <p className="text-xs text-white/20 mt-3 font-mono">Error code: {errorCode}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <Link
          href="/auth/signin"
          className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-center
            bg-gradient-to-r from-[#00D9C0] to-[#00B5A3] text-[#020c18]
            hover:shadow-[0_0_30px_rgba(0,217,192,0.3)] transition-all"
        >
          Try Again
        </Link>
        <a
          href="mailto:admin@coralfil.com"
          className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-center
            border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition-all"
        >
          Contact Support
        </a>
      </div>
    </div>
  )
}

export default function AuthErrorPage(): ReactNode {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(to bottom, #020c18, #041830, #020c18)' }}
    >
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* CoralFil wordmark */}
        <div className="text-center mb-8">
          <Link href="/auth/signin" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#00D9C0] flex items-center justify-center">
              <span className="text-lg">🧬</span>
            </div>
            <span className="font-black tracking-tighter text-white text-lg group-hover:text-[#00D9C0] transition-colors">
              CoralFil OS
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-white/10 p-8 shadow-2xl"
          style={{ background: 'rgba(4, 24, 48, 0.85)', backdropFilter: 'blur(20px)' }}
        >
          <Suspense fallback={<div className="h-48" />}>
            <ErrorContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

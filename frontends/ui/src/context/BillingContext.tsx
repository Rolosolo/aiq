'use client'

/**
 * BillingContext
 *
 * Provides live billing state (subscription, usage records, alerts) to the
 * entire application via React Context. Wraps the mock billing service.
 *
 * Usage:
 *   Wrap your layout with <BillingProvider>.
 *   Consume with useBilling() in any client component.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  fetchSubscription,
  reportUsage,
  getBillingAlerts,
} from '@/adapters/billing/service'
import type {
  BillingContextValue,
  BillingAlert,
  MeteredSubscription,
  RecordUsageParams,
  UsageRecord,
} from '@/adapters/billing/types'

// ── Context ──────────────────────────────────────────────────────────────────

const BillingContext = createContext<BillingContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────────────────

export const BILLING_REFRESH_INTERVAL_MS = 30_000 // 30 s

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<MeteredSubscription | null>(null)
  const [alerts, setAlerts] = useState<BillingAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = useCallback(async () => {
    try {
      const sub = await fetchSubscription()
      setSubscription(sub)
      setAlerts(getBillingAlerts(sub.currentPeriod))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load billing data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load + polling
  useEffect(() => {
    refresh()
    intervalRef.current = setInterval(refresh, BILLING_REFRESH_INTERVAL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [refresh])

  const recordUsage = useCallback(
    async (params: RecordUsageParams): Promise<UsageRecord> => {
      const record = await reportUsage(params)
      // Optimistic refresh after recording
      await refresh()
      return record
    },
    [refresh]
  )

  return (
    <BillingContext.Provider value={{ subscription, isLoading, error, recordUsage, refresh, alerts }}>
      {children}
    </BillingContext.Provider>
  )
}

// ── Consumer Hook ─────────────────────────────────────────────────────────────

export function useBilling(): BillingContextValue {
  const ctx = useContext(BillingContext)
  if (!ctx) {
    throw new Error('useBilling must be used inside <BillingProvider>')
  }
  return ctx
}

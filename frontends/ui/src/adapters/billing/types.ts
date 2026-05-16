/**
 * Billing Adapter — Type Definitions
 *
 * Mock implementation mirroring Stripe's metered billing model.
 * GPU compute time is tracked as the primary metered resource.
 */

export type GPUModel = 'A100' | 'H100' | 'L40S' | 'T4'

export interface UsageRecord {
  id: string
  timestamp: Date
  /** Duration of GPU job in seconds */
  durationSeconds: number
  gpuModel: GPUModel
  /** Cost in USD */
  cost: number
  jobType: 'pdf_ingestion' | 'web_scrape' | 'gpu_compute' | 'embedding' | 'inference'
  jobLabel: string
  /** Stripe-style metered unit (GPU-hours) */
  units: number
}

export interface BudgetPeriod {
  /** ISO date string — start of billing cycle */
  periodStart: string
  /** ISO date string — end of billing cycle */
  periodEnd: string
  /** Total budget allocated for the period in USD */
  budgetAllocated: number
  /** Amount consumed so far */
  budgetUsed: number
  /** Remaining budget */
  budgetRemaining: number
  /** Projected spend at current rate */
  projectedSpend: number
}

export interface MeteredSubscription {
  subscriptionId: string
  customerId: string
  /** Stripe price ID (mock) */
  priceId: string
  status: 'active' | 'paused' | 'canceled'
  /** Cost per GPU-hour in USD */
  ratePerGpuHour: Record<GPUModel, number>
  currentPeriod: BudgetPeriod
  usageRecords: UsageRecord[]
}

export interface BillingAlert {
  id: string
  type: 'warning' | 'critical' | 'info'
  message: string
  threshold: number
  triggeredAt: Date
}

export interface BillingContextValue {
  subscription: MeteredSubscription | null
  isLoading: boolean
  error: string | null
  /** Record a new GPU usage event */
  recordUsage: (params: RecordUsageParams) => Promise<UsageRecord>
  /** Refresh billing data from mock API */
  refresh: () => Promise<void>
  alerts: BillingAlert[]
}

export interface RecordUsageParams {
  gpuModel: GPUModel
  durationSeconds: number
  jobType: UsageRecord['jobType']
  jobLabel: string
}

/**
 * Mock Billing Service
 *
 * Simulates Stripe Metered Billing for GPU compute.
 * Pricing mirrors real-world Lambda Labs / AWS rates.
 *
 * In production, replace API calls with actual Stripe endpoints:
 *   POST /v1/usage_records (subscription item ID, quantity, timestamp)
 *   GET  /v1/subscription_items/{id}/usage_record_summaries
 */

import type {
  MeteredSubscription,
  UsageRecord,
  BillingAlert,
  GPUModel,
  RecordUsageParams,
  BudgetPeriod,
} from './types'

// ── Pricing Table (USD per GPU-hour) ────────────────────────────────────────
const GPU_HOURLY_RATES: Record<GPUModel, number> = {
  A100: 2.49,
  H100: 4.19,
  L40S: 1.79,
  T4:   0.52,
}

// ── Billing Period Helpers ───────────────────────────────────────────────────
function getCurrentPeriodDates(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  return { start, end }
}

// ── Deterministic Mock Seed Data ─────────────────────────────────────────────
function buildSeedUsageRecords(): UsageRecord[] {
  const { start } = getCurrentPeriodDates()
  const base = start.getTime()

  const seed: Array<Omit<UsageRecord, 'id' | 'cost' | 'units'>> = [
    {
      timestamp: new Date(base + 1 * 3600_000),
      durationSeconds: 1800,
      gpuModel: 'A100',
      jobType: 'pdf_ingestion',
      jobLabel: 'Bacterial_pathogenesis_Vibrio.pdf',
    },
    {
      timestamp: new Date(base + 5 * 3600_000),
      durationSeconds: 3600,
      gpuModel: 'H100',
      jobType: 'gpu_compute',
      jobLabel: 'Chitosan efficacy study — batch inference',
    },
    {
      timestamp: new Date(base + 26 * 3600_000),
      durationSeconds: 900,
      gpuModel: 'T4',
      jobType: 'embedding',
      jobLabel: 'Knowledge base vectorization',
    },
    {
      timestamp: new Date(base + 48 * 3600_000),
      durationSeconds: 7200,
      gpuModel: 'A100',
      jobType: 'inference',
      jobLabel: 'Vibrio suppression model — bulk run',
    },
    {
      timestamp: new Date(base + 72 * 3600_000),
      durationSeconds: 1200,
      gpuModel: 'L40S',
      jobType: 'web_scrape',
      jobLabel: 'PubMed scraping — oyster mortality',
    },
  ]

  return seed.map((r, i) => {
    const hours = r.durationSeconds / 3600
    const cost = parseFloat((GPU_HOURLY_RATES[r.gpuModel] * hours).toFixed(4))
    return { ...r, id: `ur_mock_${i + 1}`, cost, units: parseFloat(hours.toFixed(4)) }
  })
}

// ── State (in-memory — persists for lifetime of session) ─────────────────────
let _records: UsageRecord[] = buildSeedUsageRecords()
const BUDGET_ALLOCATED = 20_000 // $20k monthly budget

function computePeriod(): BudgetPeriod {
  const { start, end } = getCurrentPeriodDates()
  const budgetUsed = parseFloat(_records.reduce((s, r) => s + r.cost, 0).toFixed(2))
  const budgetRemaining = parseFloat((BUDGET_ALLOCATED - budgetUsed).toFixed(2))

  // Simple projection: avg daily spend × days in month
  const now = new Date()
  const daysPassed = Math.max(1, (now.getTime() - start.getTime()) / 86_400_000)
  const dailyRate = budgetUsed / daysPassed
  const daysInMonth = end.getDate()
  const projectedSpend = parseFloat((dailyRate * daysInMonth).toFixed(2))

  return {
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    budgetAllocated: BUDGET_ALLOCATED,
    budgetUsed,
    budgetRemaining,
    projectedSpend,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch the current metered subscription state.
 * Simulates ~200ms network latency.
 */
export async function fetchSubscription(): Promise<MeteredSubscription> {
  await delay(180)
  return {
    subscriptionId: 'sub_mock_coralfil_ai_q',
    customerId:     'cus_mock_coralfil',
    priceId:        'price_mock_gpu_compute_metered',
    status:         'active',
    ratePerGpuHour: GPU_HOURLY_RATES,
    currentPeriod:  computePeriod(),
    usageRecords:   [..._records].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
  }
}

/**
 * Record a new GPU usage event.
 * Mirrors Stripe's POST /v1/usage_records.
 */
export async function reportUsage(params: RecordUsageParams): Promise<UsageRecord> {
  await delay(120)

  const hours = params.durationSeconds / 3600
  const cost = parseFloat((GPU_HOURLY_RATES[params.gpuModel] * hours).toFixed(4))
  const record: UsageRecord = {
    id:              `ur_mock_${Date.now()}`,
    timestamp:       new Date(),
    durationSeconds: params.durationSeconds,
    gpuModel:        params.gpuModel,
    jobType:         params.jobType,
    jobLabel:        params.jobLabel,
    cost,
    units:           parseFloat(hours.toFixed(4)),
  }

  _records.push(record)
  return record
}

/**
 * Derive billing alerts based on thresholds.
 */
export function getBillingAlerts(period: BudgetPeriod): BillingAlert[] {
  const alerts: BillingAlert[] = []
  const pct = (period.budgetUsed / period.budgetAllocated) * 100

  if (pct >= 90) {
    alerts.push({
      id: 'alert_critical_90',
      type: 'critical',
      message: `Budget 90% consumed — $${period.budgetRemaining.toLocaleString()} remaining this period.`,
      threshold: 90,
      triggeredAt: new Date(),
    })
  } else if (pct >= 75) {
    alerts.push({
      id: 'alert_warning_75',
      type: 'warning',
      message: `Budget 75% consumed. Projected spend: $${period.projectedSpend.toLocaleString()}`,
      threshold: 75,
      triggeredAt: new Date(),
    })
  }

  if (period.projectedSpend > period.budgetAllocated * 1.1) {
    alerts.push({
      id: 'alert_overrun',
      type: 'critical',
      message: `Projected spend ($${period.projectedSpend.toLocaleString()}) exceeds budget by 10%+.`,
      threshold: 110,
      triggeredAt: new Date(),
    })
  }

  return alerts
}

/** Returns human-readable GPU pricing table */
export function getPricingTable(): Record<GPUModel, number> {
  return { ...GPU_HOURLY_RATES }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

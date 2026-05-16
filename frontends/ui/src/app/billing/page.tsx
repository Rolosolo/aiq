'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import AuthGuard from '@/components/AuthGuard';
import { useBilling } from '@/context/BillingContext';
import {
  CreditCard, Activity, Cpu, TrendingUp, AlertTriangle,
  RefreshCw, Clock, Zap, BarChart2, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { UsageRecord, GPUModel } from '@/adapters/billing/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const GPU_COLORS: Record<GPUModel, string> = {
  A100: 'text-teal-primary',
  H100: 'text-cyan-400',
  L40S: 'text-purple-400',
  T4:   'text-yellow-400',
};

const GPU_BG: Record<GPUModel, string> = {
  A100: 'bg-teal-primary/10',
  H100: 'bg-cyan-400/10',
  L40S: 'bg-purple-400/10',
  T4:   'bg-yellow-400/10',
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ── Sub-Components ─────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, color = 'text-teal-primary',
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color?: string;
}) {
  return (
    <div className="bg-bg-secondary border border-border-dark rounded-xl p-5 flex items-start gap-4">
      <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">{label}</p>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        {sub && <p className="text-xs text-text-secondary mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function BudgetBar({ pct, allocated, used }: { pct: number; allocated: number; used: number }) {
  const color =
    pct >= 90 ? 'from-coral to-red-600' :
    pct >= 75 ? 'from-yellow-400 to-orange-400' :
    'from-teal-primary to-cyan-400';

  return (
    <div className="bg-bg-secondary border border-border-dark rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-teal-primary" />
          Monthly Budget
        </h2>
        <span className={`text-sm font-bold ${pct >= 90 ? 'text-coral' : pct >= 75 ? 'text-yellow-400' : 'text-teal-primary'}`}>
          {pct.toFixed(1)}% used
        </span>
      </div>

      <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-3">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
        {/* 75% & 90% tick marks */}
        <div className="absolute inset-y-0 left-[75%] w-px bg-white/20" />
        <div className="absolute inset-y-0 left-[90%] w-px bg-white/30" />
      </div>

      <div className="flex justify-between text-xs text-text-secondary">
        <span>${used.toLocaleString('en-US', { minimumFractionDigits: 2 })} used</span>
        <span className="text-white/40">75%</span>
        <span className="text-white/40">90%</span>
        <span>${allocated.toLocaleString('en-US', { minimumFractionDigits: 2 })} allocated</span>
      </div>
    </div>
  );
}

function UsageRow({ record }: { record: UsageRecord }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border-dark rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${GPU_BG[record.gpuModel]} ${GPU_COLORS[record.gpuModel]}`}>
            {record.gpuModel}
          </span>
          <span className="text-sm truncate">{record.jobLabel}</span>
        </div>
        <div className="flex items-center gap-6 flex-shrink-0 ml-4">
          <span className="text-xs text-text-secondary hidden sm:block">{formatDate(record.timestamp)}</span>
          <span className="text-xs text-text-secondary flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(record.durationSeconds)}
          </span>
          <span className="text-sm font-bold text-teal-primary min-w-[70px] text-right">
            ${record.cost.toFixed(4)}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 bg-bg-dark grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-text-secondary uppercase tracking-widest mb-1">Job Type</p>
            <p className="font-bold capitalize">{record.jobType.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-text-secondary uppercase tracking-widest mb-1">GPU-Hours</p>
            <p className="font-bold">{record.units.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-text-secondary uppercase tracking-widest mb-1">Duration</p>
            <p className="font-bold">{formatDuration(record.durationSeconds)}</p>
          </div>
          <div>
            <p className="text-text-secondary uppercase tracking-widest mb-1">Record ID</p>
            <p className="font-mono text-[10px] text-text-secondary">{record.id}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const { subscription, alerts, isLoading, refresh } = useBilling();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const period = subscription?.currentPeriod;
  const records = subscription?.usageRecords ?? [];
  const rates = subscription?.ratePerGpuHour;
  const pct = period ? (period.budgetUsed / period.budgetAllocated) * 100 : 0;

  // Aggregate GPU usage
  const gpuTotals = records.reduce<Record<string, { cost: number; hours: number }>>((acc, r) => {
    if (!acc[r.gpuModel]) acc[r.gpuModel] = { cost: 0, hours: 0 };
    acc[r.gpuModel].cost  += r.cost;
    acc[r.gpuModel].hours += r.units;
    return acc;
  }, {});

  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg-dark text-text-primary pt-16">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-8">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-teal-primary" />
              Metered Billing
              <span className="text-xs font-normal bg-teal-primary/10 text-teal-primary border border-teal-primary/30 px-2 py-1 rounded-full tracking-widest uppercase">
                Mock · Stripe-style
              </span>
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-secondary hover:text-teal-primary transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2 mb-6">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${
                    alert.type === 'critical'
                      ? 'bg-coral/10 border-coral/40 text-coral'
                      : alert.type === 'warning'
                      ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300'
                      : 'bg-teal-primary/10 border-teal-primary/30 text-teal-primary'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-24 text-text-secondary">
              <RefreshCw className="w-6 h-6 animate-spin mr-3" />
              Loading billing data...
            </div>
          ) : (
            <div className="space-y-6">

              {/* Stat cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Budget Used"
                  value={`$${period?.budgetUsed.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '—'}`}
                  sub={`of $${period?.budgetAllocated.toLocaleString('en-US') ?? '—'} allocated`}
                  icon={TrendingUp}
                  color={pct >= 90 ? 'text-coral' : pct >= 75 ? 'text-yellow-400' : 'text-teal-primary'}
                />
                <StatCard
                  label="Budget Remaining"
                  value={`$${period?.budgetRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '—'}`}
                  sub="This billing period"
                  icon={CreditCard}
                />
                <StatCard
                  label="Projected Spend"
                  value={`$${period?.projectedSpend.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '—'}`}
                  sub="At current daily rate"
                  icon={Activity}
                  color={
                    period && period.projectedSpend > period.budgetAllocated
                      ? 'text-coral'
                      : 'text-teal-primary'
                  }
                />
                <StatCard
                  label="Total Jobs"
                  value={String(records.length)}
                  sub="GPU compute events this period"
                  icon={Cpu}
                />
              </div>

              {/* Budget bar */}
              {period && (
                <BudgetBar
                  pct={pct}
                  allocated={period.budgetAllocated}
                  used={period.budgetUsed}
                />
              )}

              {/* GPU breakdown + Pricing table */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* GPU breakdown */}
                <div className="bg-bg-secondary border border-border-dark rounded-xl p-6">
                  <h2 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-teal-primary" />
                    GPU Spend Breakdown
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(gpuTotals).map(([gpu, { cost, hours }]) => {
                      const totalCost = period?.budgetUsed ?? 1;
                      const sharePct = (cost / totalCost) * 100;
                      return (
                        <div key={gpu}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className={`font-bold ${GPU_COLORS[gpu as GPUModel]}`}>{gpu}</span>
                            <span className="text-text-secondary">
                              {hours.toFixed(4)} GPU-hrs · <span className="text-text-primary font-bold">${cost.toFixed(4)}</span>
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${GPU_BG[gpu as GPUModel].replace('/10', '/60')}`}
                              style={{ width: `${sharePct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(gpuTotals).length === 0 && (
                      <p className="text-sm text-text-secondary italic">No GPU jobs recorded.</p>
                    )}
                  </div>
                </div>

                {/* Pricing table */}
                <div className="bg-bg-secondary border border-border-dark rounded-xl p-6">
                  <h2 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-primary" />
                    Rate Card
                    <span className="text-xs font-normal text-text-secondary">(per GPU-hour)</span>
                  </h2>
                  <div className="space-y-2">
                    {rates && Object.entries(rates).map(([gpu, rate]) => (
                      <div
                        key={gpu}
                        className="flex items-center justify-between p-3 bg-bg-dark rounded-lg border border-border-dark"
                      >
                        <span className={`font-bold text-sm ${GPU_COLORS[gpu as GPUModel]}`}>{gpu}</span>
                        <span className="text-sm font-bold text-text-primary">
                          ${rate.toFixed(2)}<span className="text-text-secondary font-normal">/hr</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary mt-4 leading-relaxed">
                    Rates mirror Lambda Labs / AWS on-demand GPU pricing.
                    Mock subscription ID: <span className="font-mono text-[10px]">{subscription?.subscriptionId}</span>
                  </p>
                </div>
              </div>

              {/* Usage history */}
              <div className="bg-bg-secondary border border-border-dark rounded-xl p-6">
                <h2 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-primary" />
                  Usage History
                  <span className="ml-auto text-xs font-normal text-text-secondary">
                    {records.length} records · click to expand
                  </span>
                </h2>
                <div className="space-y-2">
                  {records.map((r) => (
                    <UsageRow key={r.id} record={r} />
                  ))}
                  {records.length === 0 && (
                    <p className="text-sm text-text-secondary italic">No usage records this period.</p>
                  )}
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

'use client'

import React from 'react';
import { Settings, User, Database, Cpu, CreditCard, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useBilling } from '@/context/BillingContext';

interface HeaderProps {
  gpuStatus?: 'ready' | 'processing' | 'offline';
}

export const Header: React.FC<HeaderProps> = ({ gpuStatus = 'ready' }) => {
  const { subscription, alerts, isLoading } = useBilling();

  const budgetRemaining = subscription?.currentPeriod.budgetRemaining ?? null;
  const budgetPct = subscription
    ? (subscription.currentPeriod.budgetUsed / subscription.currentPeriod.budgetAllocated) * 100
    : 0;

  const hasCriticalAlert = alerts.some((a) => a.type === 'critical');
  const hasWarningAlert  = alerts.some((a) => a.type === 'warning');

  const budgetColor =
    budgetPct >= 90 ? 'text-coral' :
    budgetPct >= 75 ? 'text-yellow-400' :
    'text-teal-primary';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary border-b border-border-dark">
      {/* Critical alert banner */}
      {hasCriticalAlert && (
        <div className="bg-coral/10 border-b border-coral/30 px-6 py-1.5 flex items-center gap-2 text-xs text-coral">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {alerts.find((a) => a.type === 'critical')?.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-primary flex items-center justify-center">
            <span className="text-bg-dark font-black text-lg">🧬</span>
          </div>
          <h1 className="text-text-primary text-xl font-black tracking-tighter">
            CoralFil Lab
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-teal-primary transition-colors flex items-center gap-2">
            Agent Chat
          </Link>
          <Link href="/ingestion" className="text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-teal-primary transition-colors flex items-center gap-2">
            <Database className="w-4 h-4" />
            Ingestion & Mining
          </Link>
          <Link href="/insights" className="text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-teal-primary transition-colors flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            GPU Insights
          </Link>
          <Link href="/billing" className="text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-teal-primary transition-colors flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </Link>
        </nav>

        {/* GPU Status & Actions */}
        <div className="flex items-center gap-6">
          
          {/* NVIDIA Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <span className="text-xs font-bold text-teal-primary uppercase tracking-widest">
              Inception
            </span>
          </div>

          {/* GPU Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              gpuStatus === 'ready' ? 'bg-green-prebiotic animate-pulse' :
              gpuStatus === 'processing' ? 'bg-coral animate-pulse' :
              'bg-threat-vibrio'
            }`}></div>
            <span className="text-xs uppercase tracking-widest text-text-secondary">
              {gpuStatus === 'ready' ? 'GPU Ready' :
               gpuStatus === 'processing' ? 'Processing...' :
               'Offline'}
            </span>
          </div>

          {/* Budget Indicator */}
          <Link href="/billing" className="text-right group relative">
            <p className="text-xs text-text-secondary flex items-center gap-1">
              Budget Remaining
              {hasWarningAlert && !hasCriticalAlert && (
                <AlertTriangle className="w-3 h-3 text-yellow-400" />
              )}
            </p>
            {isLoading ? (
              <p className="text-sm font-bold text-text-secondary animate-pulse">Loading...</p>
            ) : budgetRemaining !== null ? (
              <>
                <p className={`text-sm font-bold ${budgetColor} transition-colors`}>
                  ${budgetRemaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {/* Mini budget bar */}
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      budgetPct >= 90 ? 'bg-coral' :
                      budgetPct >= 75 ? 'bg-yellow-400' :
                      'bg-teal-primary'
                    }`}
                    style={{ width: `${Math.min(100, budgetPct)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-sm font-bold text-text-secondary">—</p>
            )}
          </Link>

          {/* Settings & Profile */}
          <button 
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-text-secondary hover:text-teal-primary" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <User className="w-5 h-5 text-text-secondary hover:text-teal-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};

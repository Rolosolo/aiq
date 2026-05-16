'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Cpu, Search, AlertTriangle, Activity, Target, Database } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

export default function InsightsPage() {
  const [target, setTarget] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [isComputing, setIsComputing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleCompute = () => {
    setIsComputing(true);
    // Simulate GPU compute delay
    setTimeout(() => {
      setIsComputing(false);
      setResults({
        score: 92,
        insights: [
          "Identified 3 related studies indicating strong Vibrio suppression.",
          "Chitosan DA 15-20% recommended for maximum efficacy.",
          "Estimated success rate: 87% within 72 hours."
        ]
      });
    }, 3000);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg-dark text-text-primary pt-16">
        <Header gpuStatus={isComputing ? 'processing' : 'ready'} />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-black mb-8 tracking-tighter flex items-center gap-3">
            <Cpu className="w-8 h-8 text-teal-primary" />
            Research Insights & GPU Compute
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Query Parameters */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-bg-secondary p-6 rounded-xl border border-border-dark space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                  <Target className="w-5 h-5 text-coral" />
                  Target Query
                </h2>
                
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Target Threat / Project</label>
                  <input 
                    type="text" 
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g., Vibrio Splendidus"
                    className="w-full bg-bg-dark border border-border-dark rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Keywords</label>
                  <input 
                    type="text" 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., chitosan, mortality, decay"
                    className="w-full bg-bg-dark border border-border-dark rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Brief Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Context for the AI agent to query against..."
                    className="w-full bg-bg-dark border border-border-dark rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-primary transition-colors resize-none"
                  />
                </div>

                <button 
                  onClick={handleCompute}
                  disabled={isComputing || !target}
                  className={`w-full py-3 font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${
                    isComputing ? 'bg-coral/20 text-coral cursor-not-allowed' : 'bg-gradient-to-r from-teal-primary to-cyan-400 text-black hover:shadow-[0_0_20px_rgba(0,217,192,0.4)]'
                  }`}
                >
                  {isComputing ? (
                    <>
                      <Activity className="w-5 h-5 animate-pulse" />
                      Computing...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-5 h-5" />
                      Run GPU Compute
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results & Context */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* GPU Results Panel */}
              {results ? (
                <div className="bg-bg-secondary p-6 rounded-xl border border-teal-primary/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-primary/10 blur-3xl rounded-full"></div>
                  <h2 className="text-xl font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-teal-primary" />
                    Compute Results
                  </h2>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-bg-dark rounded-lg border border-border-dark">
                      <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">Efficacy Score</p>
                      <p className="text-3xl font-black text-teal-primary">{results.score}/100</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-bold uppercase tracking-widest text-text-secondary">Agent Insights</p>
                    {results.insights.map((insight: string, idx: number) => (
                      <div key={idx} className="flex gap-3 p-3 bg-white/5 rounded-lg">
                        <span className="text-green-prebiotic">✓</span>
                        <p className="text-sm text-text-primary">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-bg-secondary p-12 rounded-xl border border-border-dark flex flex-col items-center justify-center text-center opacity-50">
                  <Cpu className="w-16 h-16 text-text-secondary mb-4" />
                  <p className="font-bold text-lg mb-2">Awaiting GPU Compute</p>
                  <p className="text-sm text-text-secondary max-w-md">
                    Enter target parameters and execute to leverage NVIDIA CUDA for accelerated formulation and threat analysis.
                  </p>
                </div>
              )}

              {/* Current Knowledge Base Context */}
              <div className="bg-bg-secondary p-6 rounded-xl border border-border-dark">
                <h2 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-text-secondary" />
                  Relevant Knowledge Base Studies
                </h2>
                
                <div className="space-y-3">
                  <div className="p-4 bg-bg-dark rounded-lg border border-border-dark flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm mb-1">Impact of Chitosan on Vibrio Species</h3>
                      <p className="text-xs text-text-secondary">Pathogenesis reduction observed in controlled environments. Added 2 days ago.</p>
                    </div>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded">Study</span>
                  </div>
                  <div className="p-4 bg-bg-dark rounded-lg border border-border-dark flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm mb-1">Thermal Stress Tolerance in Crassostrea gigas</h3>
                      <p className="text-xs text-text-secondary">Analysis of mortality events during 2024 heat dome. Added 1 week ago.</p>
                    </div>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded">Dataset</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

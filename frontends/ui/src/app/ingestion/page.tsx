'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Upload, Globe, Database, FileText, CheckCircle2 } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

export default function IngestionPage() {
  const [dragActive, setDragActive] = useState(false);
  const [scrapedUrls, setScrapedUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Future: handle file drop
  };

  const handleScrape = () => {
    if (currentUrl) {
      setScrapedUrls([...scrapedUrls, currentUrl]);
      setCurrentUrl('');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg-dark text-text-primary pt-16">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-black mb-8 tracking-tighter flex items-center gap-3">
            <Database className="w-8 h-8 text-teal-primary" />
            Knowledge Ingestion & Mining
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* PDF Ingestion Section */}
            <div className="bg-bg-secondary p-6 rounded-xl border border-border-dark space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-coral" />
                <h2 className="text-xl font-bold uppercase tracking-tight">PDF Ingestion</h2>
              </div>
              
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  dragActive ? 'border-teal-primary bg-teal-primary/5' : 'border-border-dark hover:border-white/20'
                }`}
              >
                <Upload className="w-10 h-10 mx-auto mb-4 text-text-secondary" />
                <p className="font-bold mb-2">Drag & Drop Research Papers</p>
                <p className="text-sm text-text-secondary">PDF files up to 50MB</p>
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-3">Recent Uploads</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-teal-primary" />
                      <span className="text-sm">Bacterial_pathogenesis_Vibrio.pdf</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-prebiotic" />
                  </div>
                </div>
              </div>
            </div>

            {/* Web Scraping Section */}
            <div className="bg-bg-secondary p-6 rounded-xl border border-border-dark space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-threat-acidif" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Web Scraping</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Target URL or Domain</label>
                  <div className="flex gap-3">
                    <input 
                      type="url" 
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      placeholder="https://example.com/research"
                      className="flex-1 bg-bg-dark border border-border-dark rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-primary transition-colors"
                    />
                    <button 
                      onClick={handleScrape}
                      className="bg-teal-primary text-bg-dark px-6 py-2 rounded-lg font-bold uppercase text-sm tracking-widest hover:bg-teal-light transition-colors"
                    >
                      Mine Data
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-3 mt-8">Scraping Queue</h3>
                  <div className="space-y-2">
                    {scrapedUrls.map((url, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-text-secondary" />
                          <span className="text-sm text-text-secondary truncate max-w-[250px]">{url}</span>
                        </div>
                        <span className="text-xs bg-coral/20 text-coral px-2 py-1 rounded">Processing</span>
                      </div>
                    ))}
                    {scrapedUrls.length === 0 && (
                      <p className="text-sm text-text-secondary italic">No active scraping jobs.</p>
                    )}
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

import React from 'react';
import { ASSET_IMAGES } from '../constants';
import { Sparkles, Download, CheckCircle2, ShieldCheck, PlayCircle, Zap } from 'lucide-react';

interface HeroSectionProps {
  onBuyClick: () => void;
  onExploreDemos: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBuyClick, onExploreDemos }) => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-blue-600/20 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-yellow-500/10 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Value Proposition, Pricing, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Discount Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <span>MEGA VIRAL SALE · 84% OFF TODAY ONLY</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
              GET THE ULTIMATE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]">
                SHERU BHAI
              </span>{' '}
              REELS BUNDLE
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
              Premium HD Ready-to-Post AI Reels <span className="text-purple-400">·</span> No Editing Needed <span className="text-purple-400">·</span> Instant Digital Access after payment approval. Dominate Instagram & YouTube Shorts with India&apos;s most viral royal character.
            </p>

            {/* Pricing Box - Glassmorphism */}
            <div className="w-full sm:w-auto p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl mb-8 flex flex-col sm:flex-row sm:items-center gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                  EXCLUSIVE DEAL PRICE
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl sm:text-2xl text-slate-500 line-through font-semibold decoration-red-500/70">
                    ₹1,199
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight flex items-baseline">
                    <span className="text-2xl sm:text-3xl text-yellow-400 mr-1">₹</span>197
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold uppercase tracking-wide">
                    SAVE ₹1,002 (84% OFF)
                  </span>
                </div>
              </div>

              <div className="sm:border-l sm:border-white/10 sm:pl-6 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span>One-Time Payment</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span>Lifetime Google Drive Access</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span>No Monthly Subscription</span>
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onBuyClick}
                className="neon-btn-primary px-8 py-4 rounded-xl text-lg font-black text-white flex items-center justify-center gap-3 cursor-pointer group shadow-2xl transition-all"
              >
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 group-hover:scale-110 transition-transform" />
                <span>BUY NOW FOR ₹197</span>
              </button>

              <button
                onClick={onExploreDemos}
                className="px-6 py-4 rounded-xl text-sm font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-purple-400" />
                <span>WATCH DEMO REELS 🔥</span>
              </button>
            </div>

            {/* Proof Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 border-t border-white/10 text-xs text-slate-400">
              <div>
                <span className="font-display font-extrabold text-lg text-white block tabular-nums">1,000+</span>
                <span>HD Ready Reels</span>
              </div>
              <div>
                <span className="font-display font-extrabold text-lg text-white block tabular-nums">100M+</span>
                <span>Organic Views</span>
              </div>
              <div>
                <span className="font-display font-extrabold text-lg text-white block tabular-nums">100%</span>
                <span>Watermark Free</span>
              </div>
              <div>
                <span className="font-display font-extrabold text-lg text-white block tabular-nums">Instant</span>
                <span>Digital Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Bundle Mockup Artwork */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Glowing Backdrop Plate */}
            <div className="relative w-full max-w-lg aspect-4/3 rounded-2xl overflow-hidden glass-panel-glow p-2.5">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#07060e] flex items-center justify-center">
                <img
                  src={ASSET_IMAGES.bundleMockup}
                  alt="Sheru Bhai Reels Bundle Mockup 3D Render"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Corner Value Stamp */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-yellow-500/50 px-3 py-1.5 rounded-lg text-xs font-bold text-yellow-400 flex items-center gap-1.5 shadow-xl">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MASTER BUNDLE 2026</span>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                        AUTHENTIC CREATOR LICENSE
                      </span>
                      <h4 className="text-base font-bold text-white font-display">
                        Sheru Bhai Viral Reels Vault
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through block">₹1,199</span>
                      <span className="text-lg font-extrabold text-yellow-400">₹197</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Floating decorative pill */}
            <div className="hidden sm:flex absolute -bottom-5 -left-4 bg-[#110e24] border border-purple-500/30 rounded-xl p-3 shadow-2xl items-center gap-3 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Download className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Instant Google Drive Link</div>
                <div className="text-[11px] text-slate-400">1000+ MP4 Videos in 1080p</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

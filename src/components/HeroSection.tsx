import React from 'react';
import { ASSET_IMAGES } from '../constants';
import { Star, ShieldCheck, Lock, Zap } from 'lucide-react';

interface HeroSectionProps {
  onBuyClick: () => void;
  onExploreDemos: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBuyClick, onExploreDemos }) => {
  const BULLET_POINTS = [
    '2000+ Viral Sheru Reels',
    'Trending AI Lion Videos',
    'Sheru Lifestyle & Attitude Reels',
    'Luxury Cars & Royal Lifestyle Videos',
    'Funny Animal Character Reels',
    '100% Copyright Free',
    'High Quality Videos',
    'Ready To Post: With BGM & Text',
    'Lifetime Access',
    'Instant Delivery on Email and WhatsApp',
    'Free Quality Bonuses Worth ₹12,000/-',
  ];

  return (
    <section className="relative pt-6 pb-14 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-blue-600/20 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: Prominent Product Cover Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden glass-panel-glow p-2 border border-purple-500/30 shadow-2xl">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#07060e] flex items-center justify-center">
                <img
                  src={ASSET_IMAGES.bundleMockup}
                  alt="Sheru Bhai Reels Bundle Cover Mockup"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                />

                {/* 2027 Edition Badge */}
                <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md border border-yellow-400/60 px-3 py-1 rounded-lg text-[11px] font-black text-yellow-400 tracking-wider uppercase shadow-xl">
                  ★ 2027 MASTER EDITION
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-left">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">
                    EXCLUSIVE BUNDLE
                  </span>
                  <div className="text-sm font-black text-white font-display">
                    SHERU BHAI VIRAL REELS VAULT
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Anchor Button */}
            <button
              onClick={onExploreDemos}
              className="mt-3 text-xs text-purple-300 hover:text-yellow-400 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>👇 Scroll Down To Watch Demo Videos</span>
            </button>
          </div>

          {/* RIGHT: Typography, Bullets, Rating & Price Offer Card */}
          <div className="lg:col-span-7 flex flex-col text-left">
            
            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-2">
              Get The Ultimate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.35)]">
                AI SHERU BHAI
              </span> <br />
              Reels Bundle 2027 Edition
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-normal mb-4">
              Get PREMIUM HD Ready-to-Post AI Reels. No Editing Needed • No Watermark • Instant Access.
            </p>

            {/* 3. Small Premium Golden Rating Banner */}
            <div className="inline-flex items-center gap-3 p-2.5 px-4 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-transparent border border-yellow-500/30 mb-5 w-fit">
              <span className="font-display font-black text-sm text-yellow-400 tabular-nums">4.9/5</span>
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                ))}
              </div>
              <span className="text-slate-400 text-xs">|</span>
              <span className="text-xs font-bold text-white tracking-wide">
                Excellent <span className="text-slate-400 font-normal">· Trusted by Happy Customers</span>
              </span>
            </div>

            {/* Exact Bullet Points Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-xs sm:text-sm text-slate-200">
              {BULLET_POINTS.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-400 shrink-0 font-bold">✅</span>
                  <span className="font-semibold text-slate-200">{bullet}</span>
                </div>
              ))}
            </div>

            {/* 4. PRICE AND BUY NOW OFFER CARD */}
            <div className="p-5 sm:p-6 rounded-2xl glass-panel-glow border border-purple-500/40 relative overflow-hidden text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-[11px] font-black tracking-wider uppercase">
                  LIMITED TIME OFFER
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase">
                  SAVE 80%
                </span>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-3 mb-4 justify-center sm:justify-start">
                <span className="text-xl sm:text-2xl text-slate-500 line-through font-semibold decoration-red-500/80">
                  ₹1,199
                </span>
                <span className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight flex items-baseline">
                  <span className="text-2xl sm:text-3xl text-yellow-400 mr-1">₹</span>197/-
                </span>
              </div>

              {/* Large Gradient CTA Button */}
              <button
                onClick={onBuyClick}
                className="neon-btn-primary w-full py-4 rounded-xl text-base sm:text-lg font-black text-white flex items-center justify-center gap-2 cursor-pointer shadow-2xl transition-all duration-200 hover:scale-[1.02]"
              >
                <span>🚀 BUY NOW FOR ₹197/- ONLY</span>
              </button>

              {/* Secure Checkout Subtext & Payment Logos */}
              <div className="mt-3.5 flex flex-col items-center gap-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🔒 100% SECURE INSTANT CHECKOUT VIA ANY UPI APP</span>
                </div>

                {/* Clean Payment Logos Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-white">Google Pay</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-purple-400">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-blue-400">Paytm</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-yellow-400">UPI</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-slate-300">Visa</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-slate-300">Mastercard</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

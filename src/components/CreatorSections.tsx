import React from 'react';
import { CREATOR_BONUSES, TARGET_AUDIENCE, UPLOAD_PLATFORMS, MONETIZATION_METHODS } from '../constants';
import { Gift, Users, UploadCloud, DollarSign, ArrowRight, Check } from 'lucide-react';

interface CreatorSectionsProps {
  onBuyClick: () => void;
}

export const CreatorSections: React.FC<CreatorSectionsProps> = ({ onBuyClick }) => {
  return (
    <div className="space-y-16 py-6">
      
      {/* 1. EXCLUSIVE CREATOR BONUSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>WORTH ₹12,000/- FOR FREE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            EXCLUSIVE CREATOR BONUSES
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Free high-value strategy assets included inside your download package.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREATOR_BONUSES.map((bonus, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-yellow-400/40 transition-all flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-lg bg-yellow-400/20 text-yellow-400 font-bold text-xs flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    FREE
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-white group-hover:text-yellow-300 transition-colors mb-1.5">
                  {bonus.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {bonus.description}
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Value: <del className="text-slate-400">{bonus.value}</del></span>
                <span className="text-yellow-400 font-bold">Included</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. WHO IS THIS BUNDLE FOR? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>AUDIENCE FIT</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            WHO IS THIS BUNDLE FOR?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TARGET_AUDIENCE.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-purple-500/40 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3 font-bold text-sm">
                0{idx + 1}
              </div>
              <h3 className="font-display font-bold text-sm text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHERE CAN I UPLOAD THESE REELS? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>PLATFORM COMPATIBILITY</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            WHERE CAN I UPLOAD THESE REELS?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {UPLOAD_PLATFORMS.map((platform, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-4 border border-white/10 text-center flex flex-col items-center justify-center hover:border-blue-500/40 transition-all"
            >
              <span className="font-display font-bold text-sm text-white mb-1">
                {platform.name}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono">
                {platform.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW CAN I MAKE MONEY? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            <span>MONETIZATION GUIDE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            HOW CAN I MAKE MONEY?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MONETIZATION_METHODS.map((method, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-emerald-500/40 transition-all text-left"
            >
              <span className="font-mono text-emerald-400 font-extrabold text-sm block mb-1">
                Step {method.step}
              </span>
              <h3 className="font-display font-bold text-sm text-white mb-1.5">
                {method.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {method.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Action strip */}
        <div className="mt-8 p-6 rounded-2xl glass-panel-glow border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-display font-bold text-white text-base">
              Get Instant Access to 2000+ Ready-to-Post Sheru Bhai Reels
            </h4>
            <p className="text-xs text-slate-400">
              One-time payment of ₹197 only · Lifetime Google Drive folder updates included.
            </p>
          </div>
          <button
            onClick={onBuyClick}
            className="neon-btn-primary px-6 py-3 rounded-xl text-xs font-black text-white shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xl"
          >
            <span>BUY NOW FOR ₹197/-</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};

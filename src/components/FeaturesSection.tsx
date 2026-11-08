import React from 'react';
import { PRODUCT_FEATURES } from '../constants';
import { Crown, Flame, Zap, Dumbbell, Smile, Sparkles, Check, ArrowRight } from 'lucide-react';

interface FeaturesSectionProps {
  onBuyClick: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Crown: <Crown className="w-6 h-6 text-yellow-400" />,
  Flame: <Flame className="w-6 h-6 text-orange-400" />,
  Zap: <Zap className="w-6 h-6 text-purple-400" />,
  Dumbbell: <Dumbbell className="w-6 h-6 text-blue-400" />,
  Smile: <Smile className="w-6 h-6 text-emerald-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-amber-300" />,
};

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onBuyClick }) => {
  return (
    <section id="features" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block mb-2">
            WHAT’S INSIDE THE VAULT
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Crafted for Immediate Virality & High Audience Retention
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Every clip is engineered using proprietary state-of-the-art AI rendering pipelines, luxury styling, and viral pacing so your Instagram profile stands out instantly.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {ICON_MAP[feature.icon] || <Sparkles className="w-6 h-6 text-purple-400" />}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {feature.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
                <Check className="w-3.5 h-3.5 text-yellow-400" />
                <span>Authorized Distribution License Included</span>
              </div>
            </div>
          ))}
        </div>

        {/* Value Callout Strip */}
        <div className="mt-12 glass-panel-glow rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="font-display text-xl font-bold text-white mb-1">
              Ready to post your first viral reel in the next 15 minutes?
            </h4>
            <p className="text-sm text-slate-300">
              Get all 1,000+ files organized in categorized Google Drive folders with lifetime updates.
            </p>
          </div>

          <button
            onClick={onBuyClick}
            className="neon-btn-primary px-6 py-3 rounded-xl text-sm font-black text-white shrink-0 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>UNLOCK ALL REELS FOR ₹197</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

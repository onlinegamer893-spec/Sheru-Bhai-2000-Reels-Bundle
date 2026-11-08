import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';

export const WhyChooseUsSection: React.FC<{ onBuyClick: () => void }> = ({ onBuyClick }) => {
  const COMPARISONS = [
    {
      feature: 'Video Quality',
      sheru: 'Ultra-Clear 1080x1920 60FPS HD',
      others: 'Blurry 720p 24FPS compressed clips',
    },
    {
      feature: 'Watermarks & Logos',
      sheru: '100% Clean & Watermark-Free',
      others: 'Ugly foreign handles or watermark logos',
    },
    {
      feature: 'Viral Persona',
      sheru: 'Iconic Sheru Bhai AI Lion Character',
      others: 'Random scraped clips with zero identity',
    },
    {
      feature: 'Audio & Hashtag Strategy',
      sheru: 'Curated Trending Audio + Viral Indian Tags',
      others: 'No audio guide or hashtag templates',
    },
    {
      feature: 'Access & Storage',
      sheru: 'Permanent Google Drive Master Folder',
      others: 'Broken Telegram channels or expiring links',
    },
    {
      feature: 'Support & Assistance',
      sheru: 'Dedicated WhatsApp Team Support',
      others: 'No customer support or contact',
    },
  ];

  return (
    <section className="py-20 relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 block mb-2">
            QUALITY COMPARISON
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Why Creators Prefer Sheru Bhai Over Cheap Scraped Bundles
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Don&apos;t waste your time with recycled, low-resolution videos that get shadowbanned. Invest in authentic, high-definition AI cinematic reels.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="py-5 px-6 text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Feature & Standard
                  </th>
                  <th className="py-5 px-6 text-sm font-black text-yellow-400 bg-purple-900/20 border-x border-purple-500/20">
                    SHERU BHAI STORE (₹197)
                  </th>
                  <th className="py-5 px-6 text-sm font-semibold text-slate-500">
                    Other Generic Bundles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {COMPARISONS.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-200 bg-purple-900/10 border-x border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.sheru}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-400/80 shrink-0" />
                        <span>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Action */}
          <div className="p-6 bg-[#0c0a18] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              <span>Full 100% Monetization & Commercial Distribution Clearance</span>
            </div>
            <button
              onClick={onBuyClick}
              className="neon-btn-primary px-6 py-2.5 rounded-xl text-xs font-black text-white cursor-pointer"
            >
              CLAIM YOUR BUNDLE FOR ₹197
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { TESTIMONIALS } from '../constants';
import { Star, BadgeCheck, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
            CREATOR SUCCESS STORIES
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Hear from Indian Creators Crushing the Algorithm
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Verified Indian digital creators who scaled their theme pages and generated real followers with Sheru Bhai reels.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 hover:border-purple-500/30 transition-all duration-300 relative group"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>

                {/* Growth Metric Highlight */}
                <div className="mb-4 inline-block px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
                  {t.followersGained}
                </div>

                {/* Quote Prose */}
                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                    <span>{t.name}</span>
                    {t.verified && <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400" />}
                  </div>
                  <div className="text-xs text-purple-400 font-mono mt-0.5">
                    {t.handle}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {t.city}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                  <Quote className="w-4 h-4 text-purple-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

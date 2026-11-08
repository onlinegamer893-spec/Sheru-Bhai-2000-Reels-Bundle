import React, { useState } from 'react';
import { InstagramProfile } from '../types';
import { ASSET_IMAGES } from '../constants';
import { BadgeCheck, Play, ArrowRight, ExternalLink, ShieldCheck, Eye, Maximize2, X } from 'lucide-react';

interface InstagramDemoSectionProps {
  instagram: InstagramProfile;
  onBuyClick: () => void;
}

export const InstagramDemoSection: React.FC<InstagramDemoSectionProps> = ({ instagram, onBuyClick }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Default screenshot fallback if admin hasn't uploaded a custom one yet
  const screenshotSrc =
    instagram.profileScreenshot ||
    '/src/assets/images/demo_reel_royal_1794107966987.jpg';

  const profileUrl = instagram.profileUrl || `https://instagram.com/${instagram.username.replace('@', '')}`;

  return (
    <section id="instagram-proof" className="py-16 relative border-t border-white/10 overflow-hidden bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3 tracking-wider uppercase">
            <span>OFFICIAL CREATOR PAGE DEMO</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            SEE OUR INSTAGRAM PAGE DEMO
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            Full uncropped mobile view of our official {instagram.followersCount || '1.4M+'} creator profile.
          </p>
        </div>

        {/* Side-by-Side Prominent Dual Panels (Desktop 2-col, Mobile vertical stack) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: FULL-SIZE INSTAGRAM PROFILE SCREENSHOT (689 × 1536 Ratio, Uncropped, Object-Contain) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] rounded-3xl p-2.5 sm:p-3 bg-[#0d0b1a] border border-purple-500/35 shadow-[0_0_50px_rgba(168,85,247,0.18)] group">
              
              {/* Outer phone-like bezel styling */}
              <div className="relative w-full aspect-[689/1536] max-h-[720px] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 shadow-2xl">
                <img
                  src={screenshotSrc}
                  alt={`Full Instagram Profile Screenshot of @${instagram.username}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain select-none cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                />

                {/* Hover overlay hint to expand */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer"
                  aria-label="Expand screenshot in full resolution"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-600/80 backdrop-blur-md flex items-center justify-center shadow-xl">
                    <Maximize2 className="w-5 h-5 text-yellow-300" />
                  </div>
                  <span>Click To View Full Size</span>
                </button>
              </div>

              {/* Bottom Trust Badge */}
              <div className="mt-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold truncate">@{instagram.username} Verified Page</span>
                </div>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-yellow-400 font-bold flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Open App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: VIRAL CASE STUDY & HOMEPAGE PROOF */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
            
            {/* Creator Bio & Stats Lockup */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-xl text-white">
                    @{instagram.username}
                  </span>
                  <BadgeCheck className="w-5 h-5 text-blue-400 fill-blue-400" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                  100% Organic Growth
                </span>
              </div>

              {/* Key Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 py-1">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center sm:text-left">
                  <span className="text-[11px] text-slate-400 block">Followers</span>
                  <span className="font-display font-black text-xl text-yellow-400 tabular-nums">
                    {instagram.followersCount || '1.4M'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center sm:text-left">
                  <span className="text-[11px] text-slate-400 block">Total Posts</span>
                  <span className="font-display font-black text-xl text-white tabular-nums">
                    {instagram.postsCount || '342'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center sm:text-left">
                  <span className="text-[11px] text-slate-400 block">Monthly Views</span>
                  <span className="font-display font-black text-xl text-purple-300 tabular-nums">
                    100M+
                  </span>
                </div>
              </div>

              {/* Verified Profile Bio */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {instagram.bio}
              </div>
            </div>

            {/* Viral Reel Performance Spotlight */}
            <div className="glass-panel-glow rounded-2xl p-6 border border-purple-500/30 space-y-4">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">
                VIRAL AUDIENCE RETENTION METRICS
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                How These AI Reels Generate Massive Follower Surges
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every video in the <strong>Sheru Bhai Viral Reels Bundle</strong> is engineered for maximum completion rate. When viewers stay until the end of a 9:16 vertical video, the Instagram algorithm pushes your content to the Explore feed and recommended reels tab automatically.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left">
                  <span className="text-[10px] text-slate-400 block">Average Watch Time</span>
                  <span className="font-display font-black text-white text-base">94.2%</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left">
                  <span className="text-[10px] text-slate-400 block">Audio Boost</span>
                  <span className="font-display font-black text-yellow-400 text-base">Trending</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block">Ready To Upload</span>
                  <span className="font-display font-black text-emerald-400 text-base">No Editing</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onBuyClick}
                  className="neon-btn-primary w-full py-4 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 cursor-pointer shadow-2xl"
                >
                  <span>GET INSTANT ACCESS TO ALL REELS FOR ₹197</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-[11px] text-slate-400 text-center mt-2">
                  🔒 Lifetime access · No monthly subscription · Delivery on Email & WhatsApp
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* FULL RESOLUTION LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full max-h-[92vh] bg-[#090714] border border-purple-500/40 rounded-3xl p-3 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white">Full Instagram Profile Screenshot</span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 mt-2 rounded-xl flex items-center justify-center">
              <img
                src={screenshotSrc}
                alt="Instagram Profile Screenshot Full Size"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

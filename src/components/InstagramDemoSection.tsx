import React from 'react';
import { InstagramProfile } from '../types';
import { ASSET_IMAGES } from '../constants';
import { BadgeCheck, Play, ArrowRight } from 'lucide-react';

interface InstagramDemoSectionProps {
  instagram: InstagramProfile;
  onBuyClick: () => void;
}

export const InstagramDemoSection: React.FC<InstagramDemoSectionProps> = ({ instagram, onBuyClick }) => {
  return (
    <section id="instagram-proof" className="py-14 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            SEE OUR INSTAGRAM PAGE DEMO
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real performance from our official 1.4M+ follower creator page.
          </p>
        </div>

        {/* Side-by-Side Dual Panels (Stack vertically on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Instagram Profile Mockup */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-5 border border-white/10 shadow-xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider">
                INSTAGRAM PROFILE MOCKUP
              </span>
              <span className="font-mono text-purple-400 font-bold">
                @{instagram.username}
              </span>
            </div>

            {/* Profile Header Details */}
            <div className="pt-4 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shrink-0">
                <img
                  src={instagram.avatarUrl || ASSET_IMAGES.avatarLogo}
                  alt={instagram.displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover border-2 border-black"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-base text-white">{instagram.username}</span>
                  {instagram.isVerified && <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400" />}
                </div>

                <div className="flex items-center gap-4 text-xs mt-1">
                  <div><strong className="text-white">{instagram.postsCount}</strong> <span className="text-slate-400">posts</span></div>
                  <div><strong className="text-yellow-400">{instagram.followersCount}</strong> <span className="text-slate-400">followers</span></div>
                  <div><strong className="text-white">{instagram.followingCount}</strong> <span className="text-slate-400">following</span></div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {instagram.bio}
            </div>

            {/* 3-Thumbnail Reel Grid */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                REELS GRID
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(instagram.postGrid && instagram.postGrid.length > 0
                  ? instagram.postGrid
                  : [
                      { id: '1', imageUrl: ASSET_IMAGES.royalReel, views: '22.4M' },
                      { id: '2', imageUrl: ASSET_IMAGES.supercarReel, views: '14.8M' },
                      { id: '3', imageUrl: ASSET_IMAGES.funnyLionReel, views: '18.2M' },
                    ]
                ).slice(0, 6).map((item, i) => (
                  <div key={item.id || i} className="relative aspect-square rounded-xl overflow-hidden bg-black group">
                    <img
                      src={item.imageUrl}
                      alt="Reel preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 text-white text-xs font-bold">
                        <Play className="w-3 h-3 fill-white" />
                        <span>{item.views || '10M+'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Viral Analytics Case Study */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-5 border border-white/10 shadow-xl text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  VIRAL REEL PERFORMANCE
                </span>
                <span className="text-emerald-400 font-bold">100% Organic</span>
              </div>

              {/* Spotlight Card */}
              <div className="mt-4 p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex gap-4 items-center">
                <div className="relative w-24 aspect-[9/16] rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                  <img
                    src={ASSET_IMAGES.royalReel}
                    alt="Viral Reel Spotlight"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">
                    SAMPLE VIRAL METRICS
                  </span>
                  <h4 className="font-display font-bold text-white text-sm">
                    Maharaja Lion Attitude Reel
                  </h4>
                  <div className="flex justify-between border-b border-white/5 py-0.5">
                    <span className="text-slate-400">Total Views:</span>
                    <strong className="text-yellow-400 font-black">22,481,902</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-0.5">
                    <span className="text-slate-400">Total Likes:</span>
                    <strong className="text-white">1,940,210</strong>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Saves / Bookmarks:</span>
                    <strong className="text-purple-300">412,800</strong>
                  </div>
                </div>
              </div>

              {/* 2 Stats Badges */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block text-[11px]">Avg Watch Duration</span>
                  <span className="font-display font-black text-white text-lg">94.2%</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block text-[11px]">Commercial Freedom</span>
                  <span className="font-display font-black text-yellow-400 text-lg">100% Safe</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10">
              <button
                onClick={onBuyClick}
                className="neon-btn-primary w-full py-3 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>GET ALL VIRAL REELS FOR ₹197</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

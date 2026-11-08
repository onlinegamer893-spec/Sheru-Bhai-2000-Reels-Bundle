import React from 'react';
import { InstagramProfile } from '../types';
import { ASSET_IMAGES } from '../constants';
import { BadgeCheck, Play, Heart, MessageCircle, Bookmark, ExternalLink, Sparkles } from 'lucide-react';

interface InstagramDemoSectionProps {
  instagram: InstagramProfile;
  onBuyClick: () => void;
}

export const InstagramDemoSection: React.FC<InstagramDemoSectionProps> = ({ instagram, onBuyClick }) => {
  return (
    <section id="instagram-proof" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>REAL VIRAL PROOF</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            SEE OUR INSTAGRAM PAGE DEMO
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            See how our official brand page reached over <strong>1,400,000+ followers</strong> using the exact same HD AI Lion & Luxury Supercar reels you get in this bundle.
          </p>
        </div>

        {/* Side-by-Side Dual Panels (Stacks vertically on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Instagram Profile Card */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-pink-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

            {/* Profile Header Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                  OFFICIAL CREATOR PROFILE
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white/5 text-[11px] text-slate-300 font-mono">
                @ {instagram.username}
              </span>
            </div>

            {/* Profile Info */}
            <div className="pt-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* Profile Avatar */}
              <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-xl shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-black">
                  <img
                    src={ASSET_IMAGES.avatarLogo}
                    alt={instagram.displayName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Stats & Username */}
              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                  <h3 className="font-display font-bold text-xl text-white">
                    {instagram.username}
                  </h3>
                  {instagram.isVerified && (
                    <BadgeCheck className="w-5 h-5 text-blue-400 fill-blue-400" />
                  )}
                </div>

                {/* Follower Stats */}
                <div className="grid grid-cols-3 gap-4 py-3 border-y border-white/5 text-center my-3">
                  <div>
                    <span className="block font-display font-black text-white text-lg tabular-nums">
                      {instagram.postsCount}
                    </span>
                    <span className="text-[11px] text-slate-400">Posts</span>
                  </div>
                  <div>
                    <span className="block font-display font-black text-yellow-400 text-lg tabular-nums">
                      {instagram.followersCount}
                    </span>
                    <span className="text-[11px] text-slate-400">Followers</span>
                  </div>
                  <div>
                    <span className="block font-display font-black text-white text-lg tabular-nums">
                      {instagram.followingCount}
                    </span>
                    <span className="text-[11px] text-slate-400">Following</span>
                  </div>
                </div>

                {/* Display Name & Bio */}
                <div className="text-left mt-3">
                  <div className="font-bold text-sm text-white mb-1">
                    {instagram.displayName}
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {instagram.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Story Highlights Circles */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[
                { label: 'Viral Proof', emoji: '🔥' },
                { label: '1M Master', emoji: '👑' },
                { label: 'Supercars', emoji: '🏎️' },
                { label: 'Reviews', emoji: '⭐' },
              ].map((hl, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#131122] border-2 border-black flex items-center justify-center text-lg">
                      {hl.emoji}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{hl.label}</span>
                </div>
              ))}
            </div>

            {/* Profile 3x3 Mini Grid Preview */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-3">
                RECENT POSTS & REELS
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { img: ASSET_IMAGES.royalReel, views: '22.4M' },
                  { img: ASSET_IMAGES.supercarReel, views: '14.8M' },
                  { img: ASSET_IMAGES.fitnessReel, views: '9.6M' },
                ].map((post, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-black group cursor-pointer">
                    <img
                      src={post.img}
                      alt="Profile post thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 text-white text-xs font-bold">
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: High-Virality Reels Showcase & Engagement */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                  VIRAL ENGAGEMENT ANALYTICS
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% Organic Reach</span>
                </span>
              </div>

              {/* Spotlight Reel Highlight */}
              <div className="relative rounded-2xl overflow-hidden glass-panel-glow border border-purple-500/30 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <div className="relative w-36 aspect-[9/16] rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 shadow-lg">
                    <img
                      src={ASSET_IMAGES.royalReel}
                      alt="Spotlight Viral Reel"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-black text-yellow-400">
                      TOP REEL
                    </div>
                  </div>

                  <div className="text-left flex-1">
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                      CASE STUDY: REEL #042
                    </span>
                    <h4 className="font-display text-lg font-bold text-white mb-2">
                      Maharaja Lion Royal Attitude
                    </h4>
                    
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Total Views:</span>
                        <strong className="text-yellow-400 font-black tabular-nums">22,481,902 Views</strong>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Likes:</span>
                        <strong className="text-white font-bold tabular-nums">1,940,210 Likes</strong>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Saves / Bookmarks:</span>
                        <strong className="text-purple-300 font-bold tabular-nums">412,800 Saves</strong>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-400">Followers Gained:</span>
                        <strong className="text-emerald-400 font-bold tabular-nums">+48,200 New Followers</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Badges */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                  <span className="text-xs text-slate-400 block mb-1">Average Watch Time</span>
                  <span className="font-display font-black text-white text-xl">94.2%</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">High algorithmic push</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                  <span className="text-xs text-slate-400 block mb-1">Commercial Freedom</span>
                  <span className="font-display font-black text-yellow-400 text-xl">100% Safe</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">No copyright strikes</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-left leading-relaxed">
                When you post high-status AI lion reels paired with trending cinematic tracks, Instagram&apos;s algorithm immediately serves them to explore pages across India and global audiences.
              </p>
            </div>

            {/* Action CTA */}
            <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-300">
                Bundle includes all viral source MP4 files + audio hooks.
              </span>
              <button
                onClick={onBuyClick}
                className="neon-btn-primary px-6 py-3 rounded-xl text-xs font-black text-white cursor-pointer w-full sm:w-auto"
              >
                GET THIS EXACT BUNDLE (₹197)
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

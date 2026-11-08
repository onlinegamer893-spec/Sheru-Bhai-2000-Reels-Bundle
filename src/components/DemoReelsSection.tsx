import React, { useState, useEffect } from 'react';
import { DemoReel } from '../types';
import { Play, Pause, Volume2, VolumeX, Eye, Heart, Share2, Sparkles, ShoppingBag } from 'lucide-react';

interface DemoReelsSectionProps {
  demoReels: DemoReel[];
  onBuyClick: () => void;
}

export const DemoReelsSection: React.FC<DemoReelsSectionProps> = ({ demoReels, onBuyClick }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  // Simulated reel video progress loop when playing
  useEffect(() => {
    if (!playingId) return;
    const interval = setInterval(() => {
      setProgressMap((prev) => {
        const current = prev[playingId] || 0;
        const next = current >= 100 ? 0 : current + 2.5;
        return { ...prev, [playingId]: next };
      });
    }, 150);

    return () => clearInterval(interval);
  }, [playingId]);

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <section id="demos" className="py-20 relative bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>TESTED VIRAL CONTENT</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              DEMO REELS VIDEOS 🔥
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Preview the actual vertical 9:16 high-definition reel formats included in your download package.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
              <span>{isMuted ? 'Muted' : 'Sound FX On'}</span>
            </button>

            <button
              onClick={onBuyClick}
              className="neon-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>BUY ALL FOR ₹197</span>
            </button>
          </div>
        </div>

        {/* Demo Reels Horizontal Scroll / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoReels.map((reel) => {
            const isPlaying = playingId === reel.id;
            const progress = progressMap[reel.id] || 0;

            return (
              <div
                key={reel.id}
                className="relative group rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-2xl flex flex-col"
              >
                {/* 9:16 Video Frame Container */}
                <div className="relative aspect-[9/16] w-full bg-black overflow-hidden flex items-center justify-center">
                  
                  {/* Poster / Video Thumbnail */}
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isPlaying ? 'scale-105 filter brightness-105' : 'group-hover:scale-102'
                    }`}
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

                  {/* Playing Animation Effect */}
                  {isPlaying && (
                    <div className="absolute inset-0 border-2 border-purple-500/60 pointer-events-none animate-pulse" />
                  )}

                  {/* Top Bar on Reel */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-yellow-400 tracking-wider">
                      {reel.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-600/80 text-[10px] font-black text-white uppercase tracking-wider">
                      1080x1920 HD
                    </span>
                  </div>

                  {/* Center Play/Pause Trigger */}
                  <button
                    onClick={() => togglePlay(reel.id)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-110 shadow-2xl z-20"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    )}
                  </button>

                  {/* Right Action Icons (Instagram Style) */}
                  <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-10 text-white">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      </div>
                      <span className="text-[10px] font-bold mt-1 tabular-nums">{reel.likes}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        <Eye className="w-4 h-4 text-purple-300" />
                      </div>
                      <span className="text-[10px] font-bold mt-1 tabular-nums">{reel.views}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-blue-300" />
                      </div>
                      <span className="text-[10px] font-bold mt-1">Share</span>
                    </div>
                  </div>

                  {/* Bottom Video Meta & Pacing */}
                  <div className="absolute inset-x-4 bottom-4 z-10 text-left">
                    <h3 className="font-display font-bold text-white text-base leading-snug drop-shadow-md">
                      {reel.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1 drop-shadow-sm">
                      {reel.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-white/20 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-purple-500 h-full transition-all duration-150"
                        style={{ width: `${isPlaying ? progress : 0}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Bottom Card Footer */}
                <div className="p-4 bg-[#0e0c1a] border-t border-white/5 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    <span className="text-slate-200 font-semibold">Ready to Post</span> · Zero Watermark
                  </div>
                  <button
                    onClick={onBuyClick}
                    className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Get This Reel</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center text-xs text-slate-400">
          Showing 3 of 1,000+ curated viral reels included in the master bundle. All files delivered in high-bitrate MP4 with commercial license.
        </div>

      </div>
    </section>
  );
};

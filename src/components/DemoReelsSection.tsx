import React, { useState, useEffect } from 'react';
import { DemoReel } from '../types';
import { Play, Pause, Volume2, VolumeX, Eye, Heart, ShoppingBag } from 'lucide-react';

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
        const next = current >= 100 ? 0 : current + 3;
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
    <section id="demos" className="py-14 relative bg-gradient-to-b from-transparent via-purple-950/15 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Heading */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 text-center sm:text-left">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
              DEMO REELS VIDEOS 🔥
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Click any reel to play high-retention sample preview.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-yellow-400" />}
              <span>{isMuted ? 'Muted' : 'Sound FX'}</span>
            </button>
            <button
              onClick={onBuyClick}
              className="neon-btn-primary px-4 py-2 rounded-xl text-xs font-black text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>BUY ALL ₹197</span>
            </button>
          </div>
        </div>

        {/* 4 Vertical Video Thumbnails Side by Side (Horizontally scrollable on mobile) */}
        <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto no-scrollbar pb-3 md:pb-0 snap-x snap-mandatory">
          {demoReels.slice(0, 4).map((reel) => {
            const isPlaying = playingId === reel.id;
            const progress = progressMap[reel.id] || 0;

            return (
              <div
                key={reel.id}
                className="min-w-[260px] md:min-w-0 flex-1 snap-center relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-xl flex flex-col group"
              >
                {/* 9:16 Frame */}
                <div className="relative aspect-[9/16] w-full bg-black overflow-hidden flex items-center justify-center">
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isPlaying ? 'scale-105 brightness-105' : 'group-hover:scale-102'
                    }`}
                  />

                  {/* Dark vignette */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

                  {/* Top Tag */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-yellow-400">
                      {reel.category}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-600/80 text-[9px] font-bold text-white uppercase">
                      HD 9:16
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <button
                    onClick={() => togglePlay(reel.id)}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-110 shadow-2xl z-20"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    )}
                  </button>

                  {/* Right Action floating icons */}
                  <div className="absolute right-2.5 bottom-16 flex flex-col items-center gap-3 z-10 text-white">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      </div>
                      <span className="text-[9px] font-bold mt-0.5 tabular-nums">{reel.likes}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        <Eye className="w-3.5 h-3.5 text-purple-300" />
                      </div>
                      <span className="text-[9px] font-bold mt-0.5 tabular-nums">{reel.views}</span>
                    </div>
                  </div>

                  {/* Bottom title & progress */}
                  <div className="absolute inset-x-3 bottom-3 z-10 text-left">
                    <h3 className="font-display font-bold text-white text-xs leading-snug drop-shadow-md truncate">
                      {reel.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mt-2 w-full bg-white/20 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-purple-500 h-full transition-all duration-150"
                        style={{ width: `${isPlaying ? progress : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom card CTA */}
                <div className="p-2.5 bg-[#0e0c1a] border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Ready To Post</span>
                  <button
                    onClick={onBuyClick}
                    className="font-bold text-yellow-400 hover:text-yellow-300 cursor-pointer"
                  >
                    Get Reel →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

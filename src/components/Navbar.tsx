import React, { useState } from 'react';
import { ASSET_IMAGES } from '../constants';
import { ShieldCheck, Search, Lock, ShoppingBag, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout: () => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCheckout,
  onOpenTrack,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050509]/85 border-b border-white/10">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-blue-900/60 border-b border-purple-500/20 py-1.5 px-4 text-center">
        <p className="text-xs text-purple-200 font-medium tracking-wide flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>LIMITED TIME OFFER: Get 1,000+ Viral AI Reels for just <strong className="text-yellow-400 font-bold">₹197</strong> (84% OFF)</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand title & wordmark */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-yellow-500/40 p-0.5 bg-gradient-to-br from-yellow-500/20 via-purple-600/30 to-blue-600/20 shadow-lg group-hover:border-yellow-400 transition-colors">
              <img
                src={ASSET_IMAGES.avatarLogo}
                alt="Sheru Bhai Mascot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                SHERU BHAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">STORE</span>
              </span>
              <span className="text-[10px] tracking-widest text-yellow-400 font-semibold uppercase -mt-0.5">
                VIRAL REELS VAULT
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors whitespace-nowrap">
              Features
            </a>
            <a href="#demos" className="hover:text-white transition-colors whitespace-nowrap">
              Demo Reels 🔥
            </a>
            <a href="#instagram-proof" className="hover:text-white transition-colors whitespace-nowrap">
              Instagram Proof
            </a>
            <a href="#faqs" className="hover:text-white transition-colors whitespace-nowrap">
              FAQs
            </a>
            <button
              onClick={onOpenTrack}
              className="text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Search className="w-4 h-4 text-purple-400" />
              <span>Track Order</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action + Admin Entry */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCheckout}
              className="neon-btn-primary px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 cursor-pointer transition-transform"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="whitespace-nowrap">BUY NOW FOR ₹197</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Features
            </a>
            <a
              href="#demos"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Demo Reels 🔥
            </a>
            <a
              href="#instagram-proof"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Instagram Proof
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg"
            >
              FAQs
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrack();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-purple-500/30 text-purple-200 bg-purple-950/40 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Track Order / Download</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 px-4 rounded-xl border border-white/10 text-slate-400 text-xs font-medium flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

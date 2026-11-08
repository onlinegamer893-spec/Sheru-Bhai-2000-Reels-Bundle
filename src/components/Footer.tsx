import React from 'react';
import { ASSET_IMAGES } from '../constants';
import { ShieldCheck, MessageSquare, Lock, Heart } from 'lucide-react';

interface FooterProps {
  supportWhatsApp: string;
  onOpenLegal: (tab: 'terms' | 'privacy' | 'refund' | 'copyright') => void;
  onOpenAdmin: () => void;
  onOpenTrack: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  supportWhatsApp,
  onOpenLegal,
  onOpenAdmin,
  onOpenTrack,
}) => {
  return (
    <footer className="relative bg-[#040308] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-yellow-500/40 p-0.5 bg-gradient-to-br from-yellow-500/20 to-purple-600/30">
                <img
                  src={ASSET_IMAGES.avatarLogo}
                  alt="Sheru Bhai Mascot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                SHERU BHAI REELS STORE
              </span>
            </div>

            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              India&apos;s premier digital product store for ready-to-post AI Lion, Royal Lifestyle, and Luxury Supercar viral reels. High definition, copyright cleared, 100% watermark free.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Bank UPI Gateway · Instant Verification Queue</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 text-left space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenTrack}
                  className="hover:text-purple-300 transition-colors cursor-pointer"
                >
                  Track Order / Download Link
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${supportWhatsApp.replace(/\D/g, '')}?text=Hello%20Sheru%20Bhai%20Store%20Support`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: {supportWhatsApp}</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500">Support Hours: 9 AM - 11 PM IST (Daily)</span>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-4 text-left space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Policies & License
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('refund')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Refund Policy (Digital Products)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('copyright')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Copyright Information & Commercial License
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} SHERU BHAI REELS STORE. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

      </div>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={`https://wa.me/${supportWhatsApp.replace(/\D/g, '')}?text=Hi%20Sheru%20Bhai%20Team,%20I%20want%20to%20buy%20the%20reels%20bundle`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Sheru Bhai team on WhatsApp"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-emerald-500/30 group"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold transition-all duration-300">
          Chat with Us
        </span>
      </a>
    </footer>
  );
};

import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  tab: 'terms' | 'privacy' | 'refund' | 'copyright';
  onTabChange: (tab: 'terms' | 'privacy' | 'refund' | 'copyright') => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  tab,
  onTabChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0c0a18] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-yellow-400" />
            <h3 className="font-display font-extrabold text-lg text-white">
              Legal & Compliance Policies
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Tabs */}
        <div className="flex items-center gap-2 p-2 bg-white/[0.02] border-b border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onTabChange('terms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              tab === 'terms' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => onTabChange('privacy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              tab === 'privacy' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onTabChange('refund')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              tab === 'refund' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Refund Policy
          </button>
          <button
            onClick={() => onTabChange('copyright')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              tab === 'copyright' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Copyright & Commercial License
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-left text-xs text-slate-300 leading-relaxed">
          {tab === 'terms' && (
            <div>
              <h4 className="font-bold text-sm text-white mb-2">1. Terms of Digital Purchase</h4>
              <p className="mb-3">
                By purchasing the Sheru Bhai Viral Reels Bundle (single package priced at ₹197 INR), you agree to receive digital download links after payment verification. This is a one-time digital purchase with no recurring subscriptions.
              </p>
              <h4 className="font-bold text-sm text-white mb-2">2. Payment & Verification Protocol</h4>
              <p className="mb-3">
                Payments must be submitted with a genuine 12-digit UPI Transaction ID (UTR) and valid receipt screenshot. Orders are verified against official merchant bank records prior to download unlocking. Submitting fraudulent or duplicate UTR numbers will result in permanent order blacklisting.
              </p>
              <h4 className="font-bold text-sm text-white mb-2">3. Digital Delivery</h4>
              <p>
                Delivery occurs via secure, expiring signed URLs providing direct Google Drive Master folder access and packaged ZIP files.
              </p>
            </div>
          )}

          {tab === 'privacy' && (
            <div>
              <h4 className="font-bold text-sm text-white mb-2">Privacy & Data Handling</h4>
              <p className="mb-3">
                Sheru Bhai Reels Store values your privacy. We collect your Customer Name, Email Address, Mobile Number, and UTR solely for transaction fulfillment, payment reconciliation, and delivering digital access links.
              </p>
              <h4 className="font-bold text-sm text-white mb-2">Security</h4>
              <p>
                Payment screenshots and verification tokens are stored encrypted and accessed strictly by authorized administration staff. We do not sell or trade customer contact details with third-party advertisers.
              </p>
            </div>
          )}

          {tab === 'refund' && (
            <div>
              <h4 className="font-bold text-sm text-white mb-2">Digital Products Refund Policy</h4>
              <p className="mb-3">
                Because the Sheru Bhai Viral Reels Bundle is an instantly accessible, irrevocable digital download product (comprising 1,000+ high-definition video assets and strategy blueprints), all completed sales are final once download access is unlocked.
              </p>
              <h4 className="font-bold text-sm text-white mb-2">Duplicate Payment Guarantee</h4>
              <p>
                If an accidental duplicate deduction occurs from your bank account for the same order, contact our WhatsApp Support (+91-9876543210) with both bank transaction receipts for an immediate refund of the duplicate amount within 24 to 48 hours.
              </p>
            </div>
          )}

          {tab === 'copyright' && (
            <div>
              <h4 className="font-bold text-sm text-white mb-2">Authorized Distribution Rights & License</h4>
              <p className="mb-3">
                All video reels featuring the Sheru Bhai 3D AI character, lion king aesthetics, and supercars are produced and owned by Sheru Bhai Media. Upon successful purchase, each customer is granted a non-exclusive, worldwide, royalty-free commercial distribution license.
              </p>
              <h4 className="font-bold text-sm text-white mb-2">Allowed Uses:</h4>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Posting freely to Instagram Reels, YouTube Shorts, and Facebook.</li>
                <li>Monetizing social media channels using creator bonuses and brand deals.</li>
                <li>Adding your own handles, voiceovers, text captions, or logos.</li>
              </ul>
              <h4 className="font-bold text-sm text-white mb-2">Prohibited Uses:</h4>
              <p>
                Reselling the raw source Google Drive folder as a standalone competing reels store package is strictly prohibited.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};

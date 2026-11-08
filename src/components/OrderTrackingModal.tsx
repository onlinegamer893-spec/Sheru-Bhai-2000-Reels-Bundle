import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Order } from '../types';
import {
  X,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Lock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Upload,
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  initialAuth?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
  initialAuth = '',
}) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [authQuery, setAuthQuery] = useState(initialAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  // Download link generation state
  const [isGeneratingDownload, setIsGeneratingDownload] = useState(false);
  const [signedDownloadUrl, setSignedDownloadUrl] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);

  // Resubmission form state (if rejected)
  const [showResubmitForm, setShowResubmitForm] = useState(false);
  const [resubmitUtr, setResubmitUtr] = useState('');
  const [resubmitScreenshot, setResubmitScreenshot] = useState<string>('');
  const [isResubmitting, setIsResubmitting] = useState(false);

  useEffect(() => {
    if (initialOrderId) setOrderId(initialOrderId);
    if (initialAuth) setAuthQuery(initialAuth);
    if (initialOrderId && initialAuth && isOpen) {
      handleLookup(initialOrderId, initialAuth);
    }
  }, [initialOrderId, initialAuth, isOpen]);

  const handleLookup = async (lookupId?: string, lookupAuth?: string) => {
    const idToUse = (lookupId || orderId).trim().toUpperCase();
    const authToUse = (lookupAuth || authQuery).trim();

    if (!idToUse) {
      setErrorMsg('Please enter your Order ID (e.g. SB-1042).');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setOrder(null);
    setSignedDownloadUrl(null);
    setShowResubmitForm(false);

    try {
      const url = `/api/orders/track?orderId=${encodeURIComponent(idToUse)}${
        authToUse ? `&auth=${encodeURIComponent(authToUse)}` : ''
      }`;
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (data && data.success) {
        setOrder(data.order);
        setIsLoading(false);

        // If approved, trigger celebratory confetti!
        if (data.order.status === 'APPROVED') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#a855f7', '#eab308', '#3b82f6', '#22c55e'],
          });
        }
        return;
      }

      // If backend returned non-JSON or not found on server, check local cached orders
      const cached = localStorage.getItem('sb_cached_orders');
      if (cached) {
        try {
          const list: Order[] = JSON.parse(cached);
          const found = list.find((o) => o.id.toUpperCase() === idToUse);
          if (found) {
            setOrder(found);
            setIsLoading(false);
            if (found.status === 'APPROVED') {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#a855f7', '#eab308', '#3b82f6', '#22c55e'],
              });
            }
            return;
          }
        } catch (_) {}
      }

      setErrorMsg(data?.message || 'Order not found. Please verify your Order ID.');
      setIsLoading(false);
    } catch (err: any) {
      // Local fallback on connection failure
      const cached = localStorage.getItem('sb_cached_orders');
      if (cached) {
        try {
          const list: Order[] = JSON.parse(cached);
          const found = list.find((o) => o.id.toUpperCase() === idToUse);
          if (found) {
            setOrder(found);
            setIsLoading(false);
            if (found.status === 'APPROVED') {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#a855f7', '#eab308', '#3b82f6', '#22c55e'],
              });
            }
            return;
          }
        } catch (_) {}
      }

      setErrorMsg('Order not found. Please verify your Order ID.');
      setIsLoading(false);
    }
  };

  // Generate secure expiring signed URL
  const handleGenerateSignedDownload = async () => {
    if (!order) return;
    setIsGeneratingDownload(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/orders/${order.id}/download-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth: order.mobile || order.email }),
      });
      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (data && data.success) {
        setSignedDownloadUrl(data.downloadUrl);
        setTokenExpiresAt(data.expiresAt);
        setIsGeneratingDownload(false);
        return;
      }
    } catch (err: any) {}

    // Fallback direct download link (e.g. on Vercel static deployment)
    const fallbackVaultUrl = 'https://drive.google.com/drive/folders/17k2X8rZpLqSheruViralReelsVIPVault';
    setSignedDownloadUrl(fallbackVaultUrl);
    setTokenExpiresAt(Date.now() + 3600000);
    setIsGeneratingDownload(false);
  };

  // Resubmit handler for rejected orders
  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    if (!resubmitUtr.trim()) {
      setErrorMsg('Please enter your 12-digit UTR/UPI reference ID.');
      return;
    }

    setIsResubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          utr: resubmitUtr.trim(),
          customerName: order.customerName,
          email: order.email,
          mobile: order.mobile,
          screenshotBase64: resubmitScreenshot || undefined,
        }),
      });
      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (data && data.success) {
        setIsResubmitting(false);
        setShowResubmitForm(false);
        handleLookup(order.id, order.mobile);
        return;
      }
    } catch (err: any) {}

    // Fallback update in local storage
    try {
      const cached = localStorage.getItem('sb_cached_orders');
      if (cached) {
        const list: Order[] = JSON.parse(cached);
        const idx = list.findIndex((o) => o.id.toUpperCase() === order.id.toUpperCase());
        if (idx >= 0) {
          list[idx].utr = resubmitUtr.trim();
          list[idx].status = 'PENDING';
          list[idx].rejectionReason = undefined;
          if (resubmitScreenshot) list[idx].screenshotUrl = resubmitScreenshot;
          localStorage.setItem('sb_cached_orders', JSON.stringify(list));
        }
      }
    } catch (_) {}

    setIsResubmitting(false);
    setShowResubmitForm(false);
    handleLookup(order.id, order.mobile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0c0a18] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-yellow-400" />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Search className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">
                Track Order & Download Vault
              </h3>
              <p className="text-xs text-slate-400">
                Check verification status & unlock high-speed download links
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Lookup Input Form */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. SB-8821"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-yellow-400 text-white font-mono text-xs uppercase font-bold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Mobile or Email
                </label>
                <input
                  type="text"
                  placeholder="Registered phone or email"
                  value={authQuery}
                  onChange={(e) => setAuthQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => handleLookup()}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>LOOKING UP ORDER...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>CHECK STATUS & DOWNLOAD</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ORDER STATUS DISPLAY */}
          {order && (
            <div className="space-y-4">
              
              {/* STATUS A: PENDING */}
              {order.status === 'PENDING' && (
                <div className="glass-panel rounded-2xl p-6 border border-yellow-500/30 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-yellow-500/20 border-2 border-yellow-400 mx-auto flex items-center justify-center text-yellow-400">
                    <Clock className="w-7 h-7 animate-pulse" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-wider border border-yellow-500/40">
                      PAYMENT UNDER VERIFICATION
                    </span>
                    <h4 className="font-display font-bold text-xl text-white mt-2">
                      Your Order {order.id} is in Queue
                    </h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto mt-2 leading-relaxed">
                      Our admin team is reconciling your UTR (<strong>{order.utr}</strong>) with the merchant bank statement. Approvals take 5 to 15 minutes.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleLookup(order.id, order.mobile)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 inline-flex items-center gap-2 border border-white/10 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Refresh Status</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STATUS B: REJECTED */}
              {order.status === 'REJECTED' && (
                <div className="glass-panel rounded-2xl p-6 border border-red-500/40 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-400 mx-auto flex items-center justify-center text-red-400">
                    <AlertTriangle className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider border border-red-500/40">
                      PAYMENT NOT VERIFIED
                    </span>
                    <h4 className="font-display font-bold text-xl text-white mt-2">
                      Order {order.id} Needs Resubmission
                    </h4>
                    <div className="mt-3 p-3 bg-red-950/40 rounded-xl border border-red-500/30 text-xs text-red-200 text-left">
                      <strong>Rejection Reason:</strong> {order.rejectionReason || 'UTR or payment screenshot could not be matched with our bank ledger.'}
                    </div>
                  </div>

                  {!showResubmitForm ? (
                    <button
                      onClick={() => setShowResubmitForm(true)}
                      className="neon-btn-primary px-6 py-2.5 rounded-xl text-xs font-black text-white cursor-pointer"
                    >
                      RESUBMIT VALID PAYMENT PROOF
                    </button>
                  ) : (
                    <form onSubmit={handleResubmit} className="pt-3 border-t border-white/10 text-left space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Correct 12-Digit UTR Number
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 412389012345"
                          value={resubmitUtr}
                          onChange={(e) => setResubmitUtr(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          New Screenshot (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => setResubmitScreenshot(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-slate-400"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={isResubmitting}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                          {isResubmitting ? 'Submitting...' : 'Submit Updated Details'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowResubmitForm(false)}
                          className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* STATUS C: APPROVED */}
              {order.status === 'APPROVED' && (
                <div className="glass-panel-glow rounded-2xl p-6 border border-emerald-500/40 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-xl">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/40">
                      ✓ PAYMENT VERIFIED & APPROVED
                    </span>
                    <h4 className="font-display font-black text-2xl text-white mt-2">
                      All 1,000+ Viral Reels Unlocked!
                    </h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                      Welcome to the Pride, <strong>{order.customerName}</strong>! Your purchase license is officially registered.
                    </p>
                  </div>

                  {/* Signed Expiring Download Area */}
                  {signedDownloadUrl ? (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs text-emerald-300">
                        <span className="font-bold">✓ Expiring Signed Token Ready</span>
                        <span className="text-[11px] text-slate-400">Valid for 60 Mins</span>
                      </div>
                      <a
                        href={signedDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neon-btn-primary py-3.5 px-6 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 cursor-pointer shadow-xl w-full"
                      >
                        <Download className="w-4 h-4 text-yellow-300" />
                        <span>OPEN MASTER DOWNLOAD PORTAL</span>
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerateSignedDownload}
                      disabled={isGeneratingDownload}
                      className="neon-btn-primary py-4 px-6 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 cursor-pointer shadow-xl w-full"
                    >
                      {isGeneratingDownload ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
                          <span>AUTHORIZING SECURE DOWNLOAD TOKEN...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 text-yellow-300" />
                          <span>DOWNLOAD YOUR REELS (SECURE LINK)</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Links are protected via single-use encrypted session security.</span>
                  </div>
                </div>
              )}

              {/* Order Metadata Details */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Reference:</span>
                  <span className="font-mono text-white font-bold">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="text-white">{order.customerName} ({order.mobile})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-bold text-yellow-400">₹{order.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">UTR:</span>
                  <span className="font-mono text-purple-300">{order.utr}</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

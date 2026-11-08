import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { ASSET_IMAGES } from '../constants';
import {
  X,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Upload,
  AlertCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId: string;
  merchantName: string;
  onOrderSubmitted: (orderId: string, emailOrMobile: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  upiId,
  merchantName,
  onOrderSubmitted,
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'intent'>('qr');
  const [orderId, setOrderId] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [utr, setUtr] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');

  // Status & submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique order ID on open
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSubmittedOrder(null);
      // Fetch fresh unique order ID from server
      fetch('/api/orders/initiate', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.orderId) {
            setOrderId(data.orderId);
          } else {
            setOrderId(`SB-${Math.floor(1000 + Math.random() * 9000)}`);
          }
        })
        .catch(() => {
          setOrderId(`SB-${Math.floor(1000 + Math.random() * 9000)}`);
        });
    }
  }, [isOpen]);

  // Construct standard UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    merchantName
  )}&am=197&cu=INR&tn=${encodeURIComponent(`Order_${orderId}`)}`;

  // Generate QR Code data URL
  useEffect(() => {
    if (!orderId || !upiId) return;
    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1,
      color: {
        dark: '#050509',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [orderId, upiId, upiUri]);

  // Copy UPI ID handler
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Screenshot upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size too large. Maximum file size is 15MB.');
      return;
    }

    setScreenshotFileName(file.name);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Form submit handler
  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    const cleanUtr = utr.trim();
    if (cleanUtr.length < 6) {
      setErrorMsg('Please enter the 12-digit UTR or Transaction ID from your payment receipt.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          utr: cleanUtr,
          customerName: customerName.trim(),
          email: email.trim(),
          mobile: cleanMobile,
          screenshotBase64: screenshotBase64 || undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setErrorMsg(data.message || 'Payment submission failed.');
        setIsSubmitting(false);
        return;
      }

      setSubmittedOrder(data.order);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0c0a18] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500" />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                SHERU BHAI VIRAL REELS BUNDLE
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Unique Order ID:</span>
                <span className="font-mono font-bold text-yellow-400 px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20">
                  {orderId || 'GENERATING...'}
                </span>
                <span>· Total: <strong className="text-white">₹197</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submittedOrder ? (
            /* SUBMISSION CONFIRMATION SCREEN */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-400 mx-auto flex items-center justify-center text-yellow-400">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-wider">
                  STATUS: PENDING ADMIN APPROVAL
                </span>
                <h4 className="font-display font-black text-2xl text-white mt-3">
                  Payment Submitted Successfully!
                </h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                  Your payment is under verification. Please wait for admin approval. Our team usually approves orders within <strong>5 to 15 minutes</strong>.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="max-w-md mx-auto glass-panel rounded-2xl p-4 text-left text-xs space-y-2 border border-white/10">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono font-bold text-yellow-400">{submittedOrder.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-medium text-white">{submittedOrder.customerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">UTR / Ref Number:</span>
                  <span className="font-mono text-purple-300">{submittedOrder.utr}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-bold text-emerald-400">₹{submittedOrder.amount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOrderSubmitted(submittedOrder.id, submittedOrder.mobile || submittedOrder.email);
                  }}
                  className="neon-btn-primary px-6 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                >
                  <span>TRACK ORDER STATUS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors w-full sm:w-auto"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE PAYMENT & VERIFICATION FLOW */
            <div>
              {/* Payment Methods Tabs */}
              <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'qr'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>METHOD A: SCAN & PAY (QR)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('intent')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'intent'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>METHOD B: PAY WITH UPI APP</span>
                </button>
              </div>

              {/* METHOD A: SCAN & PAY */}
              {activeTab === 'qr' && (
                <div className="bg-[#121024] border border-white/10 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  {/* QR Image */}
                  <div className="relative p-2.5 bg-white rounded-2xl shadow-xl shrink-0">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="UPI Payment QR Code" className="w-44 h-44 rounded-lg" />
                    ) : (
                      <div className="w-44 h-44 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center text-slate-600 text-xs">
                        Loading QR...
                      </div>
                    )}
                    <div className="mt-1 text-center font-bold text-[10px] text-slate-800 tracking-wider">
                      SCAN WITH ANY UPI APP
                    </div>
                  </div>

                  {/* QR Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                        MERCHANT UPI DETAILS
                      </span>
                      <h4 className="font-display font-extrabold text-white text-base">
                        {merchantName}
                      </h4>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                      <div className="text-left overflow-hidden">
                        <span className="text-[10px] text-slate-400 block">Official UPI ID:</span>
                        <span className="font-mono font-bold text-yellow-400 text-xs truncate block">
                          {upiId}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyUpi}
                        className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy UPI</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <div>Amount: <strong className="text-yellow-400 text-sm">₹197</strong> (Exact)</div>
                      <p className="text-[11px] text-slate-400">
                        Open GPay, PhonePe, Paytm, or BHIM. Scan QR or transfer directly to the UPI ID.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD B: PAY DIRECTLY WITH UPI APP */}
              {activeTab === 'intent' && (
                <div className="bg-[#121024] border border-white/10 rounded-2xl p-5 mb-8 space-y-4">
                  <div className="text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                      FAST 1-CLICK MOBILE PAYMENT
                    </span>
                    <h4 className="font-display font-bold text-white text-base">
                      Launch Your Installed UPI App (Amount ₹197 pre-filled)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Clicking below opens your UPI app. Note: Opening the app does not automatically complete the order—you must return here and submit your 12-digit UTR receipt number.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <a
                      href={upiUri}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer group"
                    >
                      <span className="font-bold text-xs text-white group-hover:text-yellow-400">Google Pay</span>
                      <span className="text-[10px] text-slate-400">Auto ₹197</span>
                    </a>

                    <a
                      href={upiUri}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer group"
                    >
                      <span className="font-bold text-xs text-white group-hover:text-purple-400">PhonePe</span>
                      <span className="text-[10px] text-slate-400">Auto ₹197</span>
                    </a>

                    <a
                      href={upiUri}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer group"
                    >
                      <span className="font-bold text-xs text-white group-hover:text-blue-400">Paytm</span>
                      <span className="text-[10px] text-slate-400">Auto ₹197</span>
                    </a>

                    <a
                      href={upiUri}
                      className="p-3 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/40 flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer"
                    >
                      <span className="font-bold text-xs text-purple-200">Other UPI App</span>
                      <span className="text-[10px] text-purple-300">BHIM / Cred</span>
                    </a>
                  </div>
                </div>
              )}

              {/* PAYMENT VERIFICATION FORM */}
              <form onSubmit={handleSubmitVerification} className="space-y-4 text-left">
                <div className="border-t border-white/10 pt-5">
                  <h4 className="font-display font-bold text-white text-base flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <span>Submit Payment Verification Details</span>
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    After completing ₹197 payment, enter your details and the 12-digit UTR/UPI Ref number from your bank or UPI app.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Order ID (Read Only) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Order ID (Auto-generated)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={orderId}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-yellow-400 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  {/* UTR Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      12-Digit UTR / Transaction ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 412389012345"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-purple-500/30 focus:border-yellow-400 text-white font-mono text-xs focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Customer Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-400 text-white text-xs focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      10-Digit Mobile / WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-400 text-white text-xs focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address (for download delivery) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. creator@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-400 text-white text-xs focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Screenshot Uploader */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Payment Screenshot (Recommended for instant approval)
                  </label>
                  
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/15 hover:border-purple-500/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white/[0.01] hover:bg-white/[0.03]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {screenshotBase64 ? (
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={screenshotBase64}
                          alt="Uploaded payment proof preview"
                          className="w-12 h-12 object-cover rounded-lg border border-purple-500/40"
                        />
                        <div className="text-left text-xs">
                          <span className="text-emerald-400 font-bold block">✓ Screenshot Loaded</span>
                          <span className="text-slate-400 truncate max-w-xs block">{screenshotFileName}</span>
                          <span className="text-[10px] text-purple-300">Click to change image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                        <Upload className="w-5 h-5 text-purple-400" />
                        <span className="text-xs text-slate-300 font-medium">
                          Click to upload payment screenshot
                        </span>
                        <span className="text-[11px] text-slate-500">
                          PNG, JPG up to 15MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neon-btn-primary w-full py-4 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin text-yellow-400" />
                        <span>VERIFYING PAYMENT SUBMISSION...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-yellow-300" />
                        <span>SUBMIT PAYMENT DETAILS FOR APPROVAL</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2.5">
                    🔒 Duplicate UTR prevention enabled · Bank reconciliation runs 24/7
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

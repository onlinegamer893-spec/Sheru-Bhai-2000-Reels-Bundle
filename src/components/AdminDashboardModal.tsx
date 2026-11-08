import React, { useState, useEffect } from 'react';
import { Order, AdminStats, PublicStoreSettings } from '../types';
import {
  X,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  IndianRupee,
  Clock,
  ShieldAlert,
  Settings,
  RefreshCw,
  LogOut,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onSettingsUpdated,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('sb_admin_token') || null
  );
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected screenshot for full view modal
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  // Rejection modal state
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState(
    'UTR number mismatch with bank transaction. Please enter the correct 12-digit ref number from your UPI app receipt.'
  );

  // Settings tab state
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [merchantUpi, setMerchantUpi] = useState('sherubhai.reels@oksbi');
  const [merchantName, setMerchantName] = useState('SHERU BHAI MEDIA');
  const [supportWhatsApp, setSupportWhatsApp] = useState('+919876543210');
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

  // Load orders when authenticated
  const fetchOrders = async () => {
    if (!authToken) return;
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setOrders(data.orders);
      } else {
        // Token invalid
        setAuthToken(null);
        localStorage.removeItem('sb_admin_token');
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isOpen && authToken) {
      fetchOrders();
    }
  }, [isOpen, authToken]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        setLoginError(data.message || 'Incorrect password.');
        setIsLoggingIn(false);
        return;
      }

      setAuthToken(data.token);
      localStorage.setItem('sb_admin_token', data.token);
      setIsLoggingIn(false);
      setPasswordInput('');
    } catch (err: any) {
      setLoginError(err.message || 'Login connection failed.');
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('sb_admin_token');
  };

  // Approve payment
  const handleApprove = async (orderId: string) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  // Reject payment with reason
  const handleConfirmReject = async () => {
    if (!authToken || !rejectOrderId) return;
    try {
      const res = await fetch(`/api/admin/orders/${rejectOrderId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await res.json();
      if (data.success) {
        setRejectOrderId(null);
        fetchOrders();
      }
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  // Save admin settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upiId: merchantUpi,
          merchantName,
          supportWhatsApp,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccessMsg('Settings saved successfully!');
        onSettingsUpdated();
        setTimeout(() => setSettingsSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Settings save failed:', err);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'ALL' || order.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.email.toLowerCase().includes(q) ||
      order.mobile.includes(q) ||
      order.utr.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#0a0815] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <Lock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
                <span>SHERU BHAI STORE</span>
                <span className="text-xs px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                  ADMIN CONSOLE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manual payment reconciliation, order approvals & store management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authToken && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!authToken ? (
            /* LOGIN SCREEN */
            <div className="max-w-md mx-auto py-10 space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-300">
                <Lock className="w-8 h-8 text-yellow-400" />
              </div>

              <div>
                <h4 className="font-display font-bold text-2xl text-white">
                  Restricted Administrator Access
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Enter master security key to manage customer orders & payments.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Master Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter admin password (default: sheru2026)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white text-sm focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Default passkey: <code className="text-yellow-400 font-mono">sheru2026</code>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="neon-btn-primary w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <span>AUTHENTICATING...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-yellow-400" />
                      <span>UNLOCK ADMIN DASHBOARD</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ADMIN DASHBOARD CONSOLE */
            <div className="space-y-6">
              
              {/* Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'orders'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Order Management
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Store Settings & UPI</span>
                  </button>
                </div>

                <button
                  onClick={fetchOrders}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Refresh Orders"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin text-purple-400' : ''}`} />
                </button>
              </div>

              {activeTab === 'orders' && (
                <>
                  {/* METRICS ROW */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-4 rounded-2xl glass-panel border border-white/10 text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Total Orders
                      </span>
                      <span className="font-display font-black text-2xl text-white tabular-nums mt-1 block">
                        {stats?.totalOrders || 0}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl glass-panel border border-yellow-500/30 text-left bg-yellow-500/[0.02]">
                      <span className="text-[11px] font-semibold text-yellow-400 uppercase tracking-wider block">
                        Pending Verification
                      </span>
                      <span className="font-display font-black text-2xl text-yellow-400 tabular-nums mt-1 block">
                        {stats?.pendingOrders || 0}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 text-left bg-emerald-500/[0.02]">
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                        Approved Payments
                      </span>
                      <span className="font-display font-black text-2xl text-emerald-400 tabular-nums mt-1 block">
                        {stats?.approvedOrders || 0}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl glass-panel border border-red-500/30 text-left bg-red-500/[0.02]">
                      <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block">
                        Rejected
                      </span>
                      <span className="font-display font-black text-2xl text-red-400 tabular-nums mt-1 block">
                        {stats?.rejectedOrders || 0}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl glass-panel-glow border border-purple-500/30 text-left col-span-2 sm:col-span-1">
                      <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider block">
                        Confirmed Sales
                      </span>
                      <span className="font-display font-black text-2xl text-white tabular-nums mt-1 block">
                        ₹{(stats?.totalSales || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* SEARCH & FILTER CONTROLS */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Name, Mobile, Email, or UTR..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/10">
                      {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setStatusFilter(filter)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            statusFilter === filter
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ORDERS MANAGEMENT TABLE */}
                  <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider">
                            <th className="py-3.5 px-4 font-bold">Order ID</th>
                            <th className="py-3.5 px-4 font-bold">Customer</th>
                            <th className="py-3.5 px-4 font-bold">Amount</th>
                            <th className="py-3.5 px-4 font-bold">UTR / Ref</th>
                            <th className="py-3.5 px-4 font-bold">Screenshot</th>
                            <th className="py-3.5 px-4 font-bold">Status</th>
                            <th className="py-3.5 px-4 font-bold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-10 text-center text-slate-500">
                                No orders matching the selected filter.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                {/* Order ID */}
                                <td className="py-3.5 px-4 font-mono font-bold text-yellow-400">
                                  {order.id}
                                </td>

                                {/* Customer info */}
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-white">{order.customerName}</div>
                                  <div className="text-[11px] text-slate-400">{order.mobile}</div>
                                  <div className="text-[11px] text-purple-300 truncate max-w-[140px]">
                                    {order.email}
                                  </div>
                                </td>

                                {/* Amount */}
                                <td className="py-3.5 px-4 font-bold text-white tabular-nums">
                                  ₹{order.amount}
                                </td>

                                {/* UTR */}
                                <td className="py-3.5 px-4 font-mono text-slate-300">
                                  {order.utr}
                                </td>

                                {/* Screenshot thumbnail */}
                                <td className="py-3.5 px-4">
                                  {order.screenshotUrl ? (
                                    <button
                                      onClick={() => setPreviewScreenshotUrl(order.screenshotUrl)}
                                      className="relative group w-10 h-10 rounded-lg overflow-hidden border border-white/20 bg-black flex items-center justify-center cursor-pointer"
                                    >
                                      <img
                                        src={order.screenshotUrl}
                                        alt="Payment receipt thumbnail"
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Eye className="w-3.5 h-3.5 text-white" />
                                      </div>
                                    </button>
                                  ) : (
                                    <span className="text-slate-600 text-[11px]">No image</span>
                                  )}
                                </td>

                                {/* Status */}
                                <td className="py-3.5 px-4">
                                  {order.status === 'APPROVED' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>APPROVED</span>
                                    </span>
                                  )}
                                  {order.status === 'PENDING' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-bold text-[11px]">
                                      <Clock className="w-3 h-3" />
                                      <span>PENDING</span>
                                    </span>
                                  )}
                                  {order.status === 'REJECTED' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-[11px]">
                                      <XCircle className="w-3 h-3" />
                                      <span>REJECTED</span>
                                    </span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {order.status !== 'APPROVED' && (
                                      <button
                                        onClick={() => handleApprove(order.id)}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                                      >
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Approve</span>
                                      </button>
                                    )}

                                    {order.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => setRejectOrderId(order.id)}
                                        className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                                      >
                                        <XCircle className="w-3 h-3" />
                                        <span>Reject</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-left space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">
                      Store Payment & WhatsApp Configuration
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Change merchant UPI receiver and support numbers in real time.
                    </p>
                  </div>

                  {settingsSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs">
                      {settingsSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Merchant UPI ID (e.g. sherubhai@oksbi)
                      </label>
                      <input
                        type="text"
                        required
                        value={merchantUpi}
                        onChange={(e) => setMerchantUpi(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Merchant Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={merchantName}
                        onChange={(e) => setMerchantName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Customer Support WhatsApp (+91...)
                      </label>
                      <input
                        type="text"
                        required
                        value={supportWhatsApp}
                        onChange={(e) => setSupportWhatsApp(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="neon-btn-primary px-6 py-2.5 rounded-xl text-xs font-black text-white cursor-pointer"
                    >
                      SAVE CONFIGURATION
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* REJECTION REASON PROMPT MODAL */}
      {rejectOrderId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#131024] border border-red-500/40 rounded-2xl p-6 text-left space-y-4 shadow-2xl">
            <h4 className="font-display font-bold text-lg text-white">
              Reject Payment for {rejectOrderId}
            </h4>
            <p className="text-xs text-slate-400">
              Provide a clear reason for the customer so they can rectify their UTR or payment screenshot.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rejection Reason (Customer will see this)
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectOrderId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREENSHOT FULL PREVIEW LIGHTBOX */}
      {previewScreenshotUrl && (
        <div
          onClick={() => setPreviewScreenshotUrl(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-black rounded-2xl overflow-hidden p-2 border border-white/20">
            <img
              src={previewScreenshotUrl}
              alt="High-res payment receipt"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setPreviewScreenshotUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

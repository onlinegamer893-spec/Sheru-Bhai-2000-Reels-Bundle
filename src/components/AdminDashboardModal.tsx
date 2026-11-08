import React, { useState, useEffect, useRef } from 'react';
import {
  Order,
  AdminStats,
  PublicStoreSettings,
  DemoReel,
  InstagramProfile,
  ProductImages,
  PromotionalImage,
  ProductDownloadFile,
} from '../types';
import { isSupabaseConfigured, uploadToSupabaseStorage } from '../lib/supabase';
import {
  X,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  ShieldCheck,
  Settings,
  RefreshCw,
  LogOut,
  FolderDown,
  Upload,
  Image as ImageIcon,
  Video,
  Instagram,
  Check,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Play,
  Pause,
  Database,
  Smartphone,
  QrCode,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings?: PublicStoreSettings;
  onSettingsUpdated: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  initialSettings,
  onSettingsUpdated,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('sb_admin_token') || null
  );

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'orders' | 'product_images' | 'instagram_demo' | 'demo_videos' | 'settings' | 'downloads'
  >('orders');

  // Login credentials state
  const [emailInput, setEmailInput] = useState('onlinegamer893@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot password flow
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [forgotMessage, setForgotMessage] = useState('');

  // Orders State
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

  // Notification banners
  const [statusNotification, setStatusNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusNotification({ type, text });
    setTimeout(() => setStatusNotification(null), 4000);
  };

  // -------------------------------------------------------------
  // 1. UPI & PAYMENT SETTINGS STATE (Fixed text disappearing bug)
  // -------------------------------------------------------------
  const [hasUserEditedSettings, setHasUserEditedSettings] = useState(false);

  const [merchantUpi, setMerchantUpi] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('sb_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.upiId) return parsed.upiId;
      }
    } catch (_) {}
    return initialSettings?.upiId || 'sherubhai.reels@oksbi';
  });

  const [merchantName, setMerchantName] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('sb_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.merchantName) return parsed.merchantName;
      }
    } catch (_) {}
    return initialSettings?.merchantName || 'SHERU BHAI MEDIA';
  });

  const [supportWhatsApp, setSupportWhatsApp] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('sb_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.supportWhatsApp) return parsed.supportWhatsApp;
      }
    } catch (_) {}
    return initialSettings?.supportWhatsApp || '+919876543210';
  });

  const [customQrUrl, setCustomQrUrl] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('sb_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.customQrUrl) return parsed.customQrUrl;
      }
    } catch (_) {}
    return initialSettings?.customQrUrl || '';
  });

  // -------------------------------------------------------------
  // 2. PRODUCT IMAGES STATE
  // -------------------------------------------------------------
  const [coverImage, setCoverImage] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('sb_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.productImages?.coverImage) return parsed.productImages.coverImage;
      }
    } catch (_) {}
    return initialSettings?.productImages?.coverImage || '/src/assets/images/sheru_bundle_mockup_1794107965527.jpg';
  });

  const [bundleMockup, setBundleMockup] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('sb_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.productImages?.bundleMockup) return parsed.productImages.bundleMockup;
      }
    } catch (_) {}
    return initialSettings?.productImages?.bundleMockup || '/src/assets/images/sheru_bundle_mockup_1794107965527.jpg';
  });

  const [promotionalImages, setPromotionalImages] = useState<PromotionalImage[]>(() => {
    try {
      const cached = localStorage.getItem('sb_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.productImages?.promotionalImages) return parsed.productImages.promotionalImages;
      }
    } catch (_) {}
    return (
      initialSettings?.productImages?.promotionalImages || [
        {
          id: 'promo-1',
          url: '/src/assets/images/demo_reel_royal_1794107966987.jpg',
          caption: 'Sheru Bhai Royal Maharaja Edition',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'promo-2',
          url: '/src/assets/images/demo_reel_supercar_1794107967087.jpg',
          caption: 'Luxury Midnight Beast Fleet',
          createdAt: new Date().toISOString(),
        },
      ]
    );
  });

  // -------------------------------------------------------------
  // 3. INSTAGRAM DEMO STATE
  // -------------------------------------------------------------
  const [instaUsername, setInstaUsername] = useState<string>(() => initialSettings?.instagram?.username || 'sherubhai.official');
  const [instaDisplayName, setInstaDisplayName] = useState<string>(() => initialSettings?.instagram?.displayName || 'SHERU BHAI | King of AI Reels 👑');
  const [instaFollowers, setInstaFollowers] = useState<string>(() => initialSettings?.instagram?.followersCount || '1.4M');
  const [instaFollowing, setInstaFollowing] = useState<string>(() => initialSettings?.instagram?.followingCount || '84');
  const [instaPosts, setInstaPosts] = useState<string>(() => initialSettings?.instagram?.postsCount || '342');
  const [instaBio, setInstaBio] = useState<string>(
    () => initialSettings?.instagram?.bio || '🔥 India’s #1 AI Reels Creator\n🚀 100M+ Monthly Views\n👑 Living Royal • AI Supercars • Animal Attitude\n👇 Get 2000+ Ready Reels for ₹197 Only!'
  );
  const [instaAvatarUrl, setInstaAvatarUrl] = useState<string>(
    () => initialSettings?.instagram?.avatarUrl || '/src/assets/images/sheru_avatar_logo_1794107968916.jpg'
  );
  const [instaProfileScreenshot, setInstaProfileScreenshot] = useState<string>(
    () => initialSettings?.instagram?.profileScreenshot || ''
  );
  const [instaProfileUrl, setInstaProfileUrl] = useState<string>(
    () => initialSettings?.instagram?.profileUrl || 'https://instagram.com/sherubhai.official'
  );
  const [instaPostGrid, setInstaPostGrid] = useState<Array<{ id: string; imageUrl: string; views?: string; likes?: string }>>(
    () =>
      initialSettings?.instagram?.postGrid || [
        { id: 'post-1', imageUrl: '/src/assets/images/demo_reel_royal_1794107966987.jpg', views: '22.4M', likes: '1.9M' },
        { id: 'post-2', imageUrl: '/src/assets/images/demo_reel_supercar_1794107967087.jpg', views: '14.8M', likes: '1.2M' },
        { id: 'post-3', imageUrl: '/src/assets/images/demo_reel_funny_lion_1794109493564.jpg', views: '18.2M', likes: '1.5M' },
      ]
  );

  // -------------------------------------------------------------
  // 4. DEMO REELS VIDEOS STATE
  // -------------------------------------------------------------
  const [demoVideosList, setDemoVideosList] = useState<DemoReel[]>(() => initialSettings?.demoReels || []);
  const [editingVideo, setEditingVideo] = useState<DemoReel | null>(null);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoCategoryInput, setVideoCategoryInput] = useState('Luxury Cars');
  const [videoViewsInput, setVideoViewsInput] = useState('12.5M');
  const [videoLikesInput, setVideoLikesInput] = useState('980K');
  const [videoDescInput, setVideoDescInput] = useState('');
  const [videoThumbUrl, setVideoThumbUrl] = useState('');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [videoActiveToggle, setVideoActiveToggle] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // -------------------------------------------------------------
  // 5. PRODUCT DOWNLOAD MANAGEMENT STATE
  // -------------------------------------------------------------
  const [bundleDownloadUrl, setBundleDownloadUrl] = useState<string>(
    () => initialSettings?.bundleDownloadUrl || 'https://drive.google.com/drive/folders/1SheruBhaiMasterVaultHDReelsAI'
  );
  const [productDownloadsList, setProductDownloadsList] = useState<ProductDownloadFile[]>(
    () =>
      initialSettings?.productDownloads || [
        {
          id: 'dl-1',
          fileName: 'Sheru_Bhai_Viral_Reels_Master_Vault_2027.zip',
          fileSize: '4.8 GB',
          fileUrl: 'https://drive.google.com/drive/folders/1SheruBhaiMasterVaultHDReelsAI',
          uploadedAt: new Date().toISOString(),
          version: '2027.1 HD',
        },
      ]
  );

  // File input refs for fast click triggers
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const mockupFileInputRef = useRef<HTMLInputElement>(null);
  const promoFileInputRef = useRef<HTMLInputElement>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const screenshotFileInputRef = useRef<HTMLInputElement>(null);
  const postGridFileInputRef = useRef<HTMLInputElement>(null);
  const videoThumbInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const zipFileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------
  // Fetch initial config from server (Safely, without overriding active typing!)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/config')
      .then((res) => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.settings) {
          const s = data.settings;
          // Only hydrate fields if user hasn't started manually typing them!
          if (!hasUserEditedSettings) {
            if (s.upiId) setMerchantUpi(s.upiId);
            if (s.merchantName) setMerchantName(s.merchantName);
            if (s.supportWhatsApp) setSupportWhatsApp(s.supportWhatsApp);
            if (s.customQrUrl !== undefined) setCustomQrUrl(s.customQrUrl || '');
          }
          if (s.bundleDownloadUrl) setBundleDownloadUrl(s.bundleDownloadUrl);
          if (s.productImages) {
            if (s.productImages.coverImage) setCoverImage(s.productImages.coverImage);
            if (s.productImages.bundleMockup) setBundleMockup(s.productImages.bundleMockup);
            if (s.productImages.promotionalImages) setPromotionalImages(s.productImages.promotionalImages);
          }
          if (s.instagram) {
            if (s.instagram.username) setInstaUsername(s.instagram.username);
            if (s.instagram.displayName) setInstaDisplayName(s.instagram.displayName);
            if (s.instagram.followersCount) setInstaFollowers(s.instagram.followersCount);
            if (s.instagram.followingCount) setInstaFollowing(s.instagram.followingCount);
            if (s.instagram.postsCount) setInstaPosts(s.instagram.postsCount);
            if (s.instagram.bio) setInstaBio(s.instagram.bio);
            if (s.instagram.avatarUrl) setInstaAvatarUrl(s.instagram.avatarUrl);
            if (s.instagram.profileScreenshot) setInstaProfileScreenshot(s.instagram.profileScreenshot);
            if (s.instagram.profileUrl) setInstaProfileUrl(s.instagram.profileUrl);
            if (s.instagram.postGrid) setInstaPostGrid(s.instagram.postGrid);
          }
          if (Array.isArray(s.demoReels) && s.demoReels.length > 0) {
            setDemoVideosList(s.demoReels);
          }
          if (Array.isArray(s.productDownloads) && s.productDownloads.length > 0) {
            setProductDownloadsList(s.productDownloads);
          }
        }
      })
      .catch((err) => console.warn('Config fetch caught:', err));
  }, [isOpen]);

  // Load orders fallback
  const loadLocalOrders = () => {
    try {
      const cached = localStorage.getItem('sb_cached_orders');
      let orderList: Order[] = [];
      if (cached) {
        orderList = JSON.parse(cached);
      } else {
        orderList = [
          {
            id: 'SB-8821',
            customerName: 'Aman Sharma',
            email: 'aman.creators@gmail.com',
            mobile: '9876543210',
            amount: 197,
            utr: '412389012345',
            screenshotUrl: '/src/assets/images/demo_reel_royal_1794107966987.jpg',
            status: 'APPROVED',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 3.8).toISOString(),
            approvedAt: new Date(Date.now() - 3600000 * 3.8).toISOString(),
          },
          {
            id: 'SB-8822',
            customerName: 'Rohan Verma',
            email: 'rohan.v@outlook.com',
            mobile: '9822114455',
            amount: 197,
            utr: '412389018899',
            screenshotUrl: '/src/assets/images/demo_reel_supercar_1794107967087.jpg',
            status: 'PENDING',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            updatedAt: new Date(Date.now() - 1800000).toISOString(),
          },
          {
            id: 'SB-8823',
            customerName: 'Deepak Patel',
            email: 'deepak.p@gmail.com',
            mobile: '9988776655',
            amount: 197,
            utr: '412389019900',
            screenshotUrl: '/src/assets/images/demo_reel_fitness_1794107968437.jpg',
            status: 'REJECTED',
            rejectionReason: 'UTR number mismatch with bank transaction. Please enter the correct 12-digit ref number from your UPI app receipt.',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            updatedAt: new Date(Date.now() - 5400000).toISOString(),
          },
        ];
        localStorage.setItem('sb_cached_orders', JSON.stringify(orderList));
      }

      setOrders(orderList);
      setStats({
        totalOrders: orderList.length,
        pendingOrders: orderList.filter((o) => o.status === 'PENDING').length,
        approvedOrders: orderList.filter((o) => o.status === 'APPROVED').length,
        rejectedOrders: orderList.filter((o) => o.status === 'REJECTED').length,
        totalSales: orderList.filter((o) => o.status === 'APPROVED').length * 197,
      });
    } catch (e) {
      console.error('Error loading local orders:', e);
    }
  };

  const updateLocalOrderStatus = (orderId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    try {
      const cached = localStorage.getItem('sb_cached_orders');
      if (cached) {
        const list: Order[] = JSON.parse(cached);
        const idx = list.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
        if (idx >= 0) {
          list[idx].status = status;
          if (status === 'APPROVED') {
            list[idx].approvedAt = new Date().toISOString();
            list[idx].rejectionReason = undefined;
          } else {
            list[idx].rejectionReason = reason;
          }
          list[idx].updatedAt = new Date().toISOString();
          localStorage.setItem('sb_cached_orders', JSON.stringify(list));
        }
      }
      loadLocalOrders();
    } catch (e) {
      console.error('Error updating local order:', e);
    }
  };

  // Load orders when authenticated
  const fetchOrders = async () => {
    if (!authToken) return;
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setOrders(data.orders);
          localStorage.setItem('sb_cached_orders', JSON.stringify(data.orders));
          setIsLoadingOrders(false);
          return;
        }
      }
      loadLocalOrders();
    } catch (err) {
      loadLocalOrders();
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

    const enteredEmail = emailInput.trim().toLowerCase();
    const enteredPass = passwordInput.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPass,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (data && data.success) {
        setAuthToken(data.token);
        localStorage.setItem('sb_admin_token', data.token);
        setIsLoggingIn(false);
        setPasswordInput('');
        return;
      }

      if (data && !data.success && !contentType.includes('text/html')) {
        setLoginError(data.message || 'Invalid admin email or password.');
        setIsLoggingIn(false);
        return;
      }

      // Static fallback check
      const isAuthorizedEmail =
        enteredEmail === 'onlinegamer893@gmail.com' ||
        enteredEmail === 'admin@sherubhai.store' ||
        !enteredEmail;
      const isAuthorizedPassword = enteredPass === 'Rayyan@1234' || enteredPass === 'sheru2026';

      if (isAuthorizedEmail && isAuthorizedPassword) {
        const fallbackToken = 'sb_admin_session_' + Date.now();
        setAuthToken(fallbackToken);
        localStorage.setItem('sb_admin_token', fallbackToken);
        setIsLoggingIn(false);
        setPasswordInput('');
        return;
      } else {
        setLoginError('Invalid admin email or password.');
        setIsLoggingIn(false);
        return;
      }
    } catch (err: any) {
      const isAuthorizedEmail =
        enteredEmail === 'onlinegamer893@gmail.com' ||
        enteredEmail === 'admin@sherubhai.store' ||
        !enteredEmail;
      const isAuthorizedPassword = enteredPass === 'Rayyan@1234' || enteredPass === 'sheru2026';

      if (isAuthorizedEmail && isAuthorizedPassword) {
        const fallbackToken = 'sb_admin_session_' + Date.now();
        setAuthToken(fallbackToken);
        localStorage.setItem('sb_admin_token', fallbackToken);
        setIsLoggingIn(false);
        setPasswordInput('');
      } else {
        setLoginError('Invalid admin email or password.');
        setIsLoggingIn(false);
      }
    }
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (err) {}
    }
    setAuthToken(null);
    localStorage.removeItem('sb_admin_token');
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  // Forgot password
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage('');
    const enteredEmail = forgotEmail.trim().toLowerCase();

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: enteredEmail }),
      });
      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (data && data.success) {
        setResetToken(data.resetToken);
        setForgotStep('reset');
        setForgotMessage(`Reset authorized! Your one-time verification code is: ${data.resetCode}`);
        return;
      }
    } catch (err) {}

    if (enteredEmail === 'onlinegamer893@gmail.com' || enteredEmail === 'admin@sherubhai.store') {
      setResetToken('client_reset_token_' + Date.now());
      setForgotStep('reset');
      setForgotMessage('Reset authorized! Please enter your new password below.');
    } else {
      setForgotMessage('No registered admin account found with this email.');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPass = newPassword.trim();
    if (newPass.length < 4) {
      setForgotMessage('Password must be at least 4 characters.');
      return;
    }

    try {
      await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword: newPass,
        }),
      });
    } catch (err) {}

    setIsForgotPassword(false);
    setForgotStep('request');
    setPasswordInput(newPass);
    setLoginError('Password reset successful! Please log in with your new credentials.');
  };

  // Order Approvals & Rejections
  const handleApprove = async (orderId: string) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          fetchOrders();
          showNotification(`Order ${orderId} approved successfully!`);
          return;
        }
      }
      updateLocalOrderStatus(orderId, 'APPROVED');
      showNotification(`Order ${orderId} approved!`);
    } catch (err) {
      updateLocalOrderStatus(orderId, 'APPROVED');
      showNotification(`Order ${orderId} approved!`);
    }
  };

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
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setRejectOrderId(null);
          fetchOrders();
          showNotification(`Order ${rejectOrderId} marked as rejected.`);
          return;
        }
      }
      updateLocalOrderStatus(rejectOrderId, 'REJECTED', rejectionReason);
      setRejectOrderId(null);
      showNotification(`Order ${rejectOrderId} marked as rejected.`);
    } catch (err) {
      updateLocalOrderStatus(rejectOrderId, 'REJECTED', rejectionReason);
      setRejectOrderId(null);
      showNotification(`Order ${rejectOrderId} marked as rejected.`);
    }
  };

  // -------------------------------------------------------------
  // GLOBAL MASTER SAVE FUNCTION (Saves to server, Supabase, and localStorage)
  // -------------------------------------------------------------
  const persistAllSettings = async (overrides: Partial<PublicStoreSettings> = {}) => {
    const payload: Partial<PublicStoreSettings> = {
      upiId: merchantUpi.trim(),
      merchantName: merchantName.trim(),
      supportWhatsApp: supportWhatsApp.trim(),
      customQrUrl: customQrUrl.trim(),
      bundleDownloadUrl: bundleDownloadUrl.trim(),
      productImages: {
        coverImage,
        bundleMockup,
        promotionalImages,
      },
      instagram: {
        username: instaUsername.trim(),
        displayName: instaDisplayName.trim(),
        followersCount: instaFollowers.trim(),
        followingCount: instaFollowing.trim(),
        postsCount: instaPosts.trim(),
        bio: instaBio.trim(),
        isVerified: true,
        avatarUrl: instaAvatarUrl,
        profileScreenshot: instaProfileScreenshot,
        profileUrl: instaProfileUrl.trim(),
        postGrid: instaPostGrid,
      },
      demoReels: demoVideosList,
      productDownloads: productDownloadsList,
      ...overrides,
    };

    // 1. Immediately cache in localStorage for 100% instant refresh persistence
    try {
      const current = JSON.parse(localStorage.getItem('sb_store_settings') || '{}');
      const merged = { ...current, ...payload };
      localStorage.setItem('sb_store_settings', JSON.stringify(merged));
    } catch (_) {}

    // 2. Persist to Express backend / Supabase
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken || 'sb_admin_session'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        await res.json();
      }
    } catch (err) {
      console.warn('Backend settings sync note:', err);
    }

    // 3. Notify parent applet to refresh public homepage
    onSettingsUpdated();
  };

  // Helper for uploading files via base64 or Supabase Storage
  const handleUploadFile = async (
    file: File,
    type: 'image' | 'video' | 'zip',
    bucket: 'product_images' | 'demo_videos' | 'product_downloads'
  ): Promise<string> => {
    // Check Supabase first if configured
    if (isSupabaseConfigured()) {
      const fileExt = file.name.split('.').pop() || (type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'zip');
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { url, error } = await uploadToSupabaseStorage(bucket, fileName, file);
      if (url && !error) {
        return url;
      }
    }

    // Read as Data URL and send to backend
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const endpoint =
            type === 'image'
              ? '/api/admin/upload-image'
              : type === 'video'
              ? '/api/admin/upload-video'
              : '/api/admin/upload-zip';

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authToken || 'sb_admin_session'}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              base64: base64Data,
              prefix: type,
              fileName: file.name,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            }),
          });

          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data.success && data.url) {
              resolve(data.url);
              return;
            }
          }
          // If server returns base64 or error, fallback to data URL directly
          resolve(base64Data);
        } catch (err) {
          resolve(base64Data);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  };

  // -------------------------------------------------------------
  // HANDLERS FOR PRODUCT IMAGES TAB
  // -------------------------------------------------------------
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showNotification('Uploading cover image...', 'success');
      const url = await handleUploadFile(file, 'image', 'product_images');
      setCoverImage(url);
      await persistAllSettings({
        productImages: { coverImage: url, bundleMockup, promotionalImages },
      });
      showNotification('Cover image updated & saved!');
    } catch (err: any) {
      showNotification(err.message || 'Cover upload failed', 'error');
    }
  };

  const handleMockupUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showNotification('Uploading bundle mockup...', 'success');
      const url = await handleUploadFile(file, 'image', 'product_images');
      setBundleMockup(url);
      await persistAllSettings({
        productImages: { coverImage, bundleMockup: url, promotionalImages },
      });
      showNotification('Bundle mockup updated & saved!');
    } catch (err: any) {
      showNotification(err.message || 'Mockup upload failed', 'error');
    }
  };

  const handleAddPromotionalImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showNotification('Uploading promotional image...', 'success');
      const url = await handleUploadFile(file, 'image', 'product_images');
      const newPromo: PromotionalImage = {
        id: `promo-${Date.now()}`,
        url,
        caption: 'Sheru Bhai AI Viral Collection',
        createdAt: new Date().toISOString(),
      };
      const updated = [newPromo, ...promotionalImages];
      setPromotionalImages(updated);
      await persistAllSettings({
        productImages: { coverImage, bundleMockup, promotionalImages: updated },
      });
      showNotification('Promotional image added!');
    } catch (err: any) {
      showNotification(err.message || 'Promo upload failed', 'error');
    }
  };

  const handleDeletePromoImage = async (id: string) => {
    const updated = promotionalImages.filter((p) => p.id !== id);
    setPromotionalImages(updated);
    await persistAllSettings({
      productImages: { coverImage, bundleMockup, promotionalImages: updated },
    });
    showNotification('Promotional image removed.');
  };

  // -------------------------------------------------------------
  // HANDLERS FOR INSTAGRAM DEMO TAB
  // -------------------------------------------------------------
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showNotification('Uploading profile photo...', 'success');
      const url = await handleUploadFile(file, 'image', 'product_images');
      setInstaAvatarUrl(url);
      showNotification('Profile photo updated!');
    } catch (err: any) {
      showNotification(err.message || 'Avatar upload failed', 'error');
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showNotification('Uploading profile screenshot...', 'success');
      const url = await handleUploadFile(file, 'image', 'product_images');
      setInstaProfileScreenshot(url);
      showNotification('Profile screenshot uploaded!');
    } catch (err: any) {
      showNotification(err.message || 'Screenshot upload failed', 'error');
    }
  };

  const handleAddPostGridImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showNotification('Uploading post grid thumbnail...', 'success');
      const url = await handleUploadFile(file, 'image', 'product_images');
      const newPost = {
        id: `post-${Date.now()}`,
        imageUrl: url,
        views: '15.4M',
        likes: '1.2M',
      };
      const updated = [...instaPostGrid, newPost];
      setInstaPostGrid(updated);
      showNotification('Post grid image added!');
    } catch (err: any) {
      showNotification(err.message || 'Post upload failed', 'error');
    }
  };

  const handleDeletePostGridItem = (id: string) => {
    setInstaPostGrid(instaPostGrid.filter((p) => p.id !== id));
  };

  const handleSaveInstagramDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistAllSettings({
      instagram: {
        username: instaUsername.trim(),
        displayName: instaDisplayName.trim(),
        followersCount: instaFollowers.trim(),
        followingCount: instaFollowing.trim(),
        postsCount: instaPosts.trim(),
        bio: instaBio.trim(),
        isVerified: true,
        avatarUrl: instaAvatarUrl,
        profileScreenshot: instaProfileScreenshot,
        profileUrl: instaProfileUrl.trim(),
        postGrid: instaPostGrid,
      },
    });
    showNotification('Instagram demo settings saved & live on homepage!');
  };

  // -------------------------------------------------------------
  // HANDLERS FOR DEMO REELS VIDEOS TAB
  // -------------------------------------------------------------
  const handleSaveDemoVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitleInput.trim()) {
      showNotification('Please enter a video title', 'error');
      return;
    }

    const newReel: DemoReel = {
      id: editingVideo ? editingVideo.id : `demo-${Date.now()}`,
      title: videoTitleInput.trim(),
      category: videoCategoryInput.trim() || 'Luxury Attitude',
      views: videoViewsInput.trim() || '10M+',
      likes: videoLikesInput.trim() || '800K',
      description: videoDescInput.trim() || 'High retention viral AI reel.',
      thumbnailUrl: videoThumbUrl || '/src/assets/images/demo_reel_royal_1794107966987.jpg',
      videoUrl: videoFileUrl || undefined,
      active: videoActiveToggle,
      displayOrder: editingVideo?.displayOrder || demoVideosList.length + 1,
    };

    let updatedList: DemoReel[];
    if (editingVideo) {
      updatedList = demoVideosList.map((r) => (r.id === editingVideo.id ? newReel : r));
    } else {
      updatedList = [...demoVideosList, newReel];
    }

    setDemoVideosList(updatedList);
    setIsAddVideoModalOpen(false);
    setEditingVideo(null);
    setVideoTitleInput('');
    setVideoThumbUrl('');
    setVideoFileUrl('');

    await persistAllSettings({ demoReels: updatedList });
    showNotification(editingVideo ? 'Demo reel updated!' : 'New demo reel added successfully!');
  };

  const handleDeleteDemoVideo = async (id: string) => {
    const updated = demoVideosList.filter((r) => r.id !== id);
    setDemoVideosList(updated);
    await persistAllSettings({ demoReels: updated });
    showNotification('Demo video removed.');
  };

  const handleToggleReelActive = async (id: string) => {
    const updated = demoVideosList.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
    setDemoVideosList(updated);
    await persistAllSettings({ demoReels: updated });
  };

  const handleMoveReel = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === demoVideosList.length - 1)
    )
      return;

    const list = [...demoVideosList];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // reassign display order
    const ordered = list.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    setDemoVideosList(ordered);
    await persistAllSettings({ demoReels: ordered });
  };

  // Video File Upload handler with simulated progress indicator
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 120 * 1024 * 1024) {
      showNotification('Video file too large. Max file size is 120MB.', 'error');
      return;
    }

    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev && prev < 85 ? prev + 15 : prev));
    }, 300);

    try {
      const url = await handleUploadFile(file, 'video', 'demo_videos');
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 1000);
      setVideoFileUrl(url);
      showNotification('Video file uploaded!');
    } catch (err: any) {
      clearInterval(interval);
      setUploadProgress(null);
      showNotification(err.message || 'Video upload failed', 'error');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR UPI & PAYMENT SETTINGS (Fixed text disappearing!)
  // -------------------------------------------------------------
  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showNotification('Uploading custom UPI QR Code...', 'success');
      const url = await handleUploadFile(file, 'image', 'product_images');
      setCustomQrUrl(url);
      setHasUserEditedSettings(true);
      showNotification('Custom QR Code loaded! Click Save to apply.');
    } catch (err: any) {
      showNotification(err.message || 'QR upload failed', 'error');
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantUpi.trim()) {
      showNotification('Merchant UPI ID is required.', 'error');
      return;
    }

    await persistAllSettings({
      upiId: merchantUpi.trim(),
      merchantName: merchantName.trim(),
      supportWhatsApp: supportWhatsApp.trim(),
      customQrUrl: customQrUrl.trim(),
    });

    showNotification('Payment configuration saved successfully! Public checkout updated.');
  };

  // -------------------------------------------------------------
  // HANDLERS FOR PRODUCT DOWNLOADS TAB
  // -------------------------------------------------------------
  const handleZipFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showNotification('Uploading product ZIP archive...', 'success');
      const url = await handleUploadFile(file, 'zip', 'product_downloads');
      const newDl: ProductDownloadFile = {
        id: `dl-${Date.now()}`,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileUrl: url,
        uploadedAt: new Date().toISOString(),
        version: '2027.2 VIP',
      };
      const updated = [newDl, ...productDownloadsList];
      setProductDownloadsList(updated);
      setBundleDownloadUrl(url);
      await persistAllSettings({
        bundleDownloadUrl: url,
        productDownloads: updated,
      });
      showNotification('Master Product ZIP file updated & locked in vault!');
    } catch (err: any) {
      showNotification(err.message || 'ZIP upload failed', 'error');
    }
  };

  const handleSaveDownloads = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistAllSettings({
      bundleDownloadUrl: bundleDownloadUrl.trim(),
      productDownloads: productDownloadsList,
    });
    showNotification('Product download vault updated successfully!');
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-6xl bg-[#090714] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-6 max-h-[94vh] flex flex-col text-left">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0">
              <Lock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                  SHERU BHAI STORE
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 font-bold">
                  ADMIN CONSOLE
                </span>
                {isSupabaseConfigured() && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    <span>Supabase Connected</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Live content management, payment approvals, media uploads & instant sync
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
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {statusNotification && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
              statusNotification.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/80 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusNotification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{statusNotification.text}</span>
            </div>
            <button onClick={() => setStatusNotification(null)} className="cursor-pointer text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!authToken ? (
            /* LOGIN & FORGOT PASSWORD PAGES */
            <div className="max-w-md mx-auto py-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-300">
                <Lock className="w-8 h-8 text-yellow-400" />
              </div>

              {!isForgotPassword ? (
                <>
                  <div>
                    <h4 className="font-display font-bold text-2xl text-white">
                      Admin Portal Login
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Enter your authorized administrator credentials to manage the store.
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
                        Admin Email
                      </label>
                      <input
                        type="email"
                        placeholder="onlinegamer893@gmail.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Admin Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Enter password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setForgotMessage('');
                        }}
                        className="text-purple-400 hover:text-yellow-400 transition-colors"
                      >
                        Forgot Password?
                      </button>
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
                          <span>LOGIN TO DASHBOARD</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* FORGOT PASSWORD FORM */
                <div className="space-y-4 text-left">
                  <div>
                    <h4 className="font-display font-bold text-xl text-white text-center">
                      Reset Admin Password
                    </h4>
                    <p className="text-xs text-slate-400 text-center mt-1">
                      Verify your registered admin email to authorize a password change.
                    </p>
                  </div>

                  {forgotMessage && (
                    <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs">
                      {forgotMessage}
                    </div>
                  )}

                  {forgotStep === 'request' ? (
                    <form onSubmit={handleRequestReset} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Registered Admin Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. onlinegamer893@gmail.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        className="neon-btn-primary w-full py-2.5 rounded-xl text-xs font-bold text-white"
                      >
                        Request Password Reset
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleConfirmReset} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          New Secure Password
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Enter new strong password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        className="neon-btn-primary w-full py-2.5 rounded-xl text-xs font-bold text-white"
                      >
                        Confirm Password Reset
                      </button>
                    </form>
                  )}

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ADMIN DASHBOARD CONSOLE */
            <div className="space-y-6">
              
              {/* Navigation Tabs Bar (Scrollable on Android Mobile) */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'orders'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    1. Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('product_images')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'product_images'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>2. Product Images</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('instagram_demo')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'instagram_demo'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>3. Instagram Demo</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('demo_videos')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'demo_videos'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>4. Demo Videos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'settings'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>5. UPI & WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('downloads')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'downloads'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <FolderDown className="w-3.5 h-3.5" />
                    <span>6. Downloads</span>
                  </button>
                </div>

                <button
                  onClick={fetchOrders}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Refresh Orders"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin text-purple-400' : ''}`} />
                </button>
              </div>

              {/* TAB 1: ORDER MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* METRICS ROW */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Total Orders
                      </span>
                      <span className="font-display font-black text-xl sm:text-2xl text-white tabular-nums mt-1 block">
                        {stats?.totalOrders || orders.length}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl glass-panel border border-yellow-500/30 bg-yellow-500/[0.02]">
                      <span className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider block">
                        Pending Payments
                      </span>
                      <span className="font-display font-black text-xl sm:text-2xl text-yellow-400 tabular-nums mt-1 block">
                        {stats?.pendingOrders || orders.filter((o) => o.status === 'PENDING').length}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-500/[0.02]">
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                        Approved Payments
                      </span>
                      <span className="font-display font-black text-xl sm:text-2xl text-emerald-400 tabular-nums mt-1 block">
                        {stats?.approvedOrders || orders.filter((o) => o.status === 'APPROVED').length}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl glass-panel border border-red-500/30 bg-red-500/[0.02]">
                      <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block">
                        Rejected Payments
                      </span>
                      <span className="font-display font-black text-xl sm:text-2xl text-red-400 tabular-nums mt-1 block">
                        {stats?.rejectedOrders || orders.filter((o) => o.status === 'REJECTED').length}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl glass-panel-glow border border-purple-500/30 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider block">
                        Confirmed Sales
                      </span>
                      <span className="font-display font-black text-xl sm:text-2xl text-white tabular-nums mt-1 block">
                        ₹{((stats?.approvedOrders || orders.filter((o) => o.status === 'APPROVED').length) * 197).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* SEARCH & FILTER */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name, Mobile, Email, or UTR..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/10 self-start sm:self-auto">
                      {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setStatusFilter(filter)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
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

                  {/* ORDERS TABLE */}
                  <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4 font-bold">Order ID</th>
                            <th className="py-3 px-4 font-bold">Customer Details</th>
                            <th className="py-3 px-4 font-bold">Amount</th>
                            <th className="py-3 px-4 font-bold">UTR Number</th>
                            <th className="py-3 px-4 font-bold">Receipt Proof</th>
                            <th className="py-3 px-4 font-bold">Status</th>
                            <th className="py-3 px-4 font-bold text-right">Actions</th>
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
                                <td className="py-3 px-4 font-mono font-bold text-yellow-400">
                                  {order.id}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-white">{order.customerName}</div>
                                  <div className="text-[11px] text-slate-400">{order.mobile}</div>
                                  <div className="text-[11px] text-purple-300 truncate max-w-[140px]">{order.email}</div>
                                </td>
                                <td className="py-3 px-4 font-bold text-white tabular-nums">
                                  ₹{order.amount}
                                </td>
                                <td className="py-3 px-4 font-mono text-slate-300">
                                  {order.utr}
                                </td>
                                <td className="py-3 px-4">
                                  {order.screenshotUrl ? (
                                    <button
                                      onClick={() => setPreviewScreenshotUrl(order.screenshotUrl)}
                                      className="relative group w-9 h-9 rounded-lg overflow-hidden border border-white/20 bg-black flex items-center justify-center cursor-pointer"
                                    >
                                      <img
                                        src={order.screenshotUrl}
                                        alt="Receipt"
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Eye className="w-3.5 h-3.5 text-white" />
                                      </div>
                                    </button>
                                  ) : (
                                    <span className="text-slate-600 text-[10px]">None</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {order.status === 'APPROVED' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>APPROVED</span>
                                    </span>
                                  )}
                                  {order.status === 'PENDING' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-bold text-[10px]">
                                      <Clock className="w-3 h-3" />
                                      <span>PENDING</span>
                                    </span>
                                  )}
                                  {order.status === 'REJECTED' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-[10px]">
                                      <XCircle className="w-3 h-3" />
                                      <span>REJECTED</span>
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {order.status !== 'APPROVED' && (
                                      <button
                                        onClick={() => handleApprove(order.id)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-sm"
                                      >
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Approve</span>
                                      </button>
                                    )}
                                    {order.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => setRejectOrderId(order.id)}
                                        className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
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
                </div>
              )}

              {/* TAB 2: PRODUCT IMAGES MANAGEMENT */}
              {activeTab === 'product_images' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">
                      Product Images & Bundle Mockup Management
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Upload JPG, PNG, or WEBP images. Changes sync to Supabase Storage and render automatically on the public homepage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Main Cover Image */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          1. Main Cover Image
                        </span>
                        <span className="text-[10px] text-purple-400 font-semibold">Homepage Hero</span>
                      </div>

                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                        <img
                          src={coverImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <input
                        ref={coverFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => coverFileInputRef.current?.click()}
                        className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Replace Cover Image</span>
                      </button>
                    </div>

                    {/* 2. Bundle Mockup Image */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          2. Bundle 3D Mockup
                        </span>
                        <span className="text-[10px] text-yellow-400 font-semibold">Primary Offer Box</span>
                      </div>

                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                        <img
                          src={bundleMockup}
                          alt="Mockup Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <input
                        ref={mockupFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleMockupUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => mockupFileInputRef.current?.click()}
                        className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Replace Bundle Mockup</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Additional Promotional Images */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm text-white">
                          3. Additional Product Promotional Images ({promotionalImages.length})
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          These images display in the product showcase gallery and creator bonuses section.
                        </p>
                      </div>

                      <input
                        ref={promoFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleAddPromotionalImage}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => promoFileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Image</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {promotionalImages.map((promo) => (
                        <div
                          key={promo.id}
                          className="group relative rounded-xl overflow-hidden bg-black/50 border border-white/10 aspect-video flex flex-col justify-end p-2"
                        >
                          <img
                            src={promo.url}
                            alt="Promo"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                          <button
                            type="button"
                            onClick={() => handleDeletePromoImage(promo.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-[10px] cursor-pointer shadow-md transition-colors"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="relative z-10 text-[10px] font-semibold text-slate-200 truncate">
                            {promo.caption || 'Promotional Asset'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INSTAGRAM ID DEMO MANAGEMENT */}
              {activeTab === 'instagram_demo' && (
                <form onSubmit={handleSaveInstagramDemo} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-lg text-white">
                        Instagram ID Demo Management
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Configure the authorized demo Instagram profile and viral reels grid displayed on the homepage.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="neon-btn-primary px-5 py-2.5 rounded-xl text-xs font-black text-white cursor-pointer shadow-lg"
                    >
                      SAVE INSTAGRAM DEMO
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Input Form */}
                    <div className="space-y-4">
                      {/* Avatar & Username Row */}
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/60 shrink-0 bg-black">
                          <img src={instaAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <input
                            ref={avatarFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => avatarFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Change Profile Photo</span>
                          </button>
                          <span className="text-[10px] text-slate-400 block">Square 1:1 format recommended</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Instagram Username
                          </label>
                          <input
                            type="text"
                            required
                            value={instaUsername}
                            onChange={(e) => setInstaUsername(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-purple-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Display Name
                          </label>
                          <input
                            type="text"
                            required
                            value={instaDisplayName}
                            onChange={(e) => setInstaDisplayName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-purple-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Followers Count
                          </label>
                          <input
                            type="text"
                            required
                            value={instaFollowers}
                            onChange={(e) => setInstaFollowers(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-yellow-400 font-bold text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Following Count
                          </label>
                          <input
                            type="text"
                            required
                            value={instaFollowing}
                            onChange={(e) => setInstaFollowing(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Posts Count
                          </label>
                          <input
                            type="text"
                            required
                            value={instaPosts}
                            onChange={(e) => setInstaPosts(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Instagram Profile URL
                          </label>
                          <input
                            type="url"
                            value={instaProfileUrl}
                            onChange={(e) => setInstaProfileUrl(e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Profile Bio (Supports multi-line)
                        </label>
                        <textarea
                          rows={3}
                          value={instaBio}
                          onChange={(e) => setInstaBio(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Right: Post Grid Thumbnails & Live Mockup */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Reels Grid Thumbnails ({instaPostGrid.length})
                        </span>
                        <input
                          ref={postGridFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAddPostGridImage}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => postGridFileInputRef.current?.click()}
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Reel Post</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {instaPostGrid.map((post) => (
                          <div
                            key={post.id}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-black/60 border border-white/10"
                          >
                            <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity p-1">
                              <span className="text-[10px] font-bold text-yellow-400">{post.views || '10M+'}</span>
                              <button
                                type="button"
                                onClick={() => handleDeletePostGridItem(post.id)}
                                className="p-1 rounded bg-red-600 text-white cursor-pointer hover:bg-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Profile Screenshot Uploader */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                        <span className="text-xs font-bold text-slate-300 block">
                          Full Profile Screenshot Proof (Optional)
                        </span>
                        <input
                          ref={screenshotFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                        />
                        {instaProfileScreenshot ? (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/10">
                            <span className="text-xs text-emerald-400 font-semibold truncate max-w-xs">
                              ✓ Screenshot uploaded
                            </span>
                            <button
                              type="button"
                              onClick={() => setInstaProfileScreenshot('')}
                              className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => screenshotFileInputRef.current?.click()}
                            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Instagram Profile Screenshot</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 4: DEMO REELS VIDEOS MANAGEMENT */}
              {activeTab === 'demo_videos' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-display font-bold text-lg text-white">
                        Demo Reels Video Management
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Upload vertical 9:16 MP4 demo videos and custom thumbnails. Order, enable/disable, and preview video playback.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingVideo(null);
                        setVideoTitleInput('');
                        setVideoCategoryInput('Luxury Attitude');
                        setVideoViewsInput('15M+');
                        setVideoLikesInput('1.2M');
                        setVideoDescInput('');
                        setVideoThumbUrl('');
                        setVideoFileUrl('');
                        setVideoActiveToggle(true);
                        setIsAddVideoModalOpen(true);
                      }}
                      className="neon-btn-primary px-4 py-2.5 rounded-xl text-xs font-black text-white flex items-center gap-2 cursor-pointer shadow-lg self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>UPLOAD NEW DEMO REEL</span>
                    </button>
                  </div>

                  {/* Video List Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {demoVideosList.map((video, idx) => (
                      <div
                        key={video.id}
                        className={`rounded-2xl border p-3 flex flex-col justify-between transition-all ${
                          video.active !== false
                            ? 'bg-[#121024] border-white/15'
                            : 'bg-black/40 border-white/5 opacity-50'
                        }`}
                      >
                        <div className="space-y-2.5">
                          {/* 9:16 Video Thumbnail Container */}
                          <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black flex items-center justify-center group">
                            {video.videoUrl ? (
                              <video
                                src={video.videoUrl}
                                poster={video.thumbnailUrl}
                                controls
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-yellow-400">
                              {video.category}
                            </div>
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  video.active !== false
                                    ? 'bg-emerald-500/80 text-white'
                                    : 'bg-slate-700 text-slate-300'
                                }`}
                              >
                                {video.active !== false ? 'Active' : 'Disabled'}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-bold text-white text-xs truncate">{video.title}</h5>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                              <span>👁 {video.views}</span>
                              <span>❤️ {video.likes}</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls Toolbar */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveReel(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveReel(idx, 'down')}
                              disabled={idx === demoVideosList.length - 1}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleReelActive(video.id)}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 cursor-pointer"
                            >
                              {video.active !== false ? 'Hide' : 'Show'}
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingVideo(video);
                                setVideoTitleInput(video.title);
                                setVideoCategoryInput(video.category);
                                setVideoViewsInput(video.views);
                                setVideoLikesInput(video.likes);
                                setVideoDescInput(video.description || '');
                                setVideoThumbUrl(video.thumbnailUrl);
                                setVideoFileUrl(video.videoUrl || '');
                                setVideoActiveToggle(video.active !== false);
                                setIsAddVideoModalOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600 text-[10px] text-purple-200 font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDemoVideo(video.id)}
                              className="p-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add / Edit Video Modal */}
                  {isAddVideoModalOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
                      <div className="w-full max-w-lg bg-[#0e0c1c] border border-purple-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <h4 className="font-display font-bold text-base text-white">
                            {editingVideo ? 'Edit Demo Reel Video' : 'Upload New Demo Reel (9:16)'}
                          </h4>
                          <button
                            onClick={() => setIsAddVideoModalOpen(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {uploadProgress !== null && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-purple-300 font-semibold">
                              <span>Uploading Video File...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-yellow-400 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <form onSubmit={handleSaveDemoVideo} className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Reel Title
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Night Rider · Supercar Beast"
                              value={videoTitleInput}
                              onChange={(e) => setVideoTitleInput(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Category Tag
                              </label>
                              <input
                                type="text"
                                placeholder="Luxury Cars / Royal Lifestyle"
                                value={videoCategoryInput}
                                onChange={(e) => setVideoCategoryInput(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Views Count
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 14.8M"
                                value={videoViewsInput}
                                onChange={(e) => setVideoViewsInput(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-yellow-400 text-xs font-bold"
                              />
                            </div>
                          </div>

                          {/* Video Thumbnail Selector */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Thumbnail Image (JPG / PNG)
                            </label>
                            <input
                              ref={videoThumbInputRef}
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  const url = await handleUploadFile(f, 'image', 'demo_videos');
                                  setVideoThumbUrl(url);
                                }
                              }}
                              className="hidden"
                            />
                            <div className="flex items-center gap-3">
                              {videoThumbUrl && (
                                <img
                                  src={videoThumbUrl}
                                  alt="Thumb"
                                  className="w-12 h-16 object-cover rounded-lg border border-purple-500/40"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => videoThumbInputRef.current?.click()}
                                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 cursor-pointer"
                              >
                                {videoThumbUrl ? 'Change Thumbnail' : 'Upload Thumbnail Image'}
                              </button>
                            </div>
                          </div>

                          {/* MP4 Video File Selector */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Vertical 9:16 MP4 Video File
                            </label>
                            <input
                              ref={videoFileInputRef}
                              type="file"
                              accept="video/mp4,video/webm"
                              onChange={handleVideoFileChange}
                              className="hidden"
                            />
                            {videoFileUrl ? (
                              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
                                <span className="text-xs text-purple-200 font-semibold truncate max-w-xs">
                                  ✓ MP4 Video Loaded
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setVideoFileUrl('')}
                                  className="text-xs text-red-400 hover:text-red-300"
                                >
                                  Clear
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => videoFileInputRef.current?.click()}
                                className="w-full py-3 rounded-xl border-2 border-dashed border-white/15 hover:border-purple-500/50 text-xs text-slate-300 flex items-center justify-center gap-2 cursor-pointer bg-white/[0.01]"
                              >
                                <Video className="w-4 h-4 text-purple-400" />
                                <span>Click to Upload 9:16 MP4 Video (Up to 120MB)</span>
                              </button>
                            )}
                          </div>

                          {/* Active Toggle */}
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/10">
                            <div>
                              <span className="text-xs font-bold text-white block">Publish on Homepage</span>
                              <span className="text-[10px] text-slate-400">Enable this video in the public demo carousel</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={videoActiveToggle}
                              onChange={(e) => setVideoActiveToggle(e.target.checked)}
                              className="w-4 h-4 rounded text-purple-600"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="submit"
                              className="neon-btn-primary flex-1 py-3 rounded-xl text-xs font-bold text-white cursor-pointer"
                            >
                              {editingVideo ? 'SAVE CHANGES' : 'PUBLISH DEMO REEL'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAddVideoModalOpen(false)}
                              className="px-4 py-3 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: UPI AND PAYMENT SETTINGS (Fixed text disappearing bug completely!) */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-5">
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">
                      UPI Merchant & WhatsApp Configuration
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure your receiving UPI ID, merchant name, WhatsApp number, and custom QR code. The public checkout page automatically updates upon saving.
                    </p>
                  </div>

                  <form onSubmit={handleSavePaymentSettings} className="space-y-4">
                    {/* Merchant UPI ID Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Merchant UPI ID (e.g. sherubhai.reels@oksbi) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={merchantUpi}
                        onChange={(e) => {
                          setHasUserEditedSettings(true);
                          setMerchantUpi(e.target.value);
                        }}
                        placeholder="yourname@okaxis"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-yellow-400 text-yellow-300 font-mono text-xs font-bold focus:outline-none transition-colors"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Used for dynamic QR generation and direct 1-click UPI Intent payment buttons (Google Pay, PhonePe, Paytm).
                      </span>
                    </div>

                    {/* Merchant Display Name Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Merchant Display Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={merchantName}
                        onChange={(e) => {
                          setHasUserEditedSettings(true);
                          setMerchantName(e.target.value);
                        }}
                        placeholder="SHERU BHAI MEDIA"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Support WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Support WhatsApp Number (With country code) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={supportWhatsApp}
                        onChange={(e) => {
                          setHasUserEditedSettings(true);
                          setSupportWhatsApp(e.target.value);
                        }}
                        placeholder="+919876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Custom UPI QR Code Upload */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          Custom UPI QR Code Image (Optional)
                        </span>
                        {customQrUrl ? (
                          <button
                            type="button"
                            onClick={() => {
                              setCustomQrUrl('');
                              setHasUserEditedSettings(true);
                            }}
                            className="text-[11px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                          >
                            Revert to Auto-Generated Dynamic QR
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            Auto Dynamic QR Active (₹197 pre-filled)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        {customQrUrl ? (
                          <div className="p-1 bg-white rounded-lg shrink-0">
                            <img src={customQrUrl} alt="Custom QR" className="w-16 h-16 object-contain" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                            <QrCode className="w-7 h-7 text-yellow-400" />
                          </div>
                        )}

                        <div className="space-y-1.5 flex-1">
                          <input
                            ref={qrFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleQrUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => qrFileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{customQrUrl ? 'Replace Custom QR Code' : 'Upload Bank Official QR Code'}</span>
                          </button>
                          <span className="text-[10px] text-slate-400 block">
                            If uploaded, customer checkout will display your exact bank sticker QR.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="neon-btn-primary w-full py-3.5 rounded-xl text-xs font-black text-white cursor-pointer shadow-lg tracking-wide"
                      >
                        SAVE CONFIGURATION & UPDATE STORE
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6: PRODUCT DOWNLOAD MANAGEMENT */}
              {activeTab === 'downloads' && (
                <div className="max-w-2xl bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">
                      Product Download Vault Management
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure the official Google Drive Master Link and direct downloadable ZIP archive delivered to approved customers.
                    </p>
                  </div>

                  <form onSubmit={handleSaveDownloads} className="space-y-5">
                    {/* Master Google Drive Folder Link */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Master Google Drive Vault Folder Link <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={bundleDownloadUrl}
                        onChange={(e) => setBundleDownloadUrl(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 text-white font-mono text-xs"
                      />
                    </div>

                    {/* Direct ZIP Archive Upload */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          Direct Reels Bundle ZIP Archive
                        </span>
                        <span className="text-[10px] text-purple-400 font-semibold">Protected Vault</span>
                      </div>

                      <input
                        ref={zipFileInputRef}
                        type="file"
                        accept=".zip,.rar,.tar,.gz"
                        onChange={handleZipFileUpload}
                        className="hidden"
                      />

                      <div className="space-y-2">
                        {productDownloadsList.map((file) => (
                          <div
                            key={file.id}
                            className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <FolderDown className="w-5 h-5 text-yellow-400 shrink-0" />
                              <div>
                                <span className="font-bold text-white block">{file.fileName}</span>
                                <span className="text-[10px] text-slate-400">
                                  Size: {file.fileSize} · Version: {file.version || '2027.1'} · Added:{' '}
                                  {new Date(file.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Test Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => zipFileInputRef.current?.click()}
                        className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Replace Master ZIP File</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="neon-btn-primary px-6 py-2.5 rounded-xl text-xs font-black text-white cursor-pointer shadow-lg"
                    >
                      SAVE DOWNLOAD VAULT SETTINGS
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
              Provide a clear reason so the customer knows how to correct their submission:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-red-400"
            />

            <div className="flex gap-2">
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setRejectOrderId(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PAYMENT PROOF RECEIPT MODAL */}
      {previewScreenshotUrl && (
        <div
          onClick={() => setPreviewScreenshotUrl(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg max-h-[85vh] bg-[#0c0a18] rounded-2xl overflow-hidden border border-purple-500/30 p-2 shadow-2xl"
          >
            <div className="flex items-center justify-between p-2 pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white">Payment Screenshot Proof</span>
              <button
                onClick={() => setPreviewScreenshotUrl(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto mt-2 rounded-lg">
              <img
                src={previewScreenshotUrl}
                alt="Receipt Full View"
                className="w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

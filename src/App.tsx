/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DEFAULT_STORE_CONFIG } from './constants';
import { PublicStoreSettings } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DemoReelsSection } from './components/DemoReelsSection';
import { InstagramDemoSection } from './components/InstagramDemoSection';
import { CreatorSections } from './components/CreatorSections';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LegalModal } from './components/LegalModal';

export default function App() {
  const [storeConfig, setStoreConfig] = useState<PublicStoreSettings>(() => {
    try {
      const cached = localStorage.getItem('sb_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...DEFAULT_STORE_CONFIG, ...parsed };
      }
    } catch (_) {}
    return DEFAULT_STORE_CONFIG;
  });
  
  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | 'refund' | 'copyright'>('terms');

  // Tracking prefill from successful checkout submission
  const [trackingPrefill, setTrackingPrefill] = useState<{ orderId: string; auth: string }>({
    orderId: '',
    auth: '',
  });

  // Check URL on mount for /admin/login or /admin route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin/login' || path === '/admin') {
      setIsAdminOpen(true);
    }
  }, []);

  // Load live store config from backend
  const loadConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.settings) {
          setStoreConfig((prev) => {
            const updated = {
              ...prev,
              ...data.settings,
            };
            try {
              localStorage.setItem('sb_store_settings', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });
          return;
        }
      }
    } catch (err) {
      console.warn('Could not load remote config, using cache:', err);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleOrderSubmitted = (orderId: string, emailOrMobile: string) => {
    setTrackingPrefill({ orderId, auth: emailOrMobile });
    setIsTrackOpen(true);
  };

  const handleOpenLegal = (tab: 'terms' | 'privacy' | 'refund' | 'copyright') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  const handleOpenAdmin = () => {
    window.history.pushState({}, '', '/admin/login');
    setIsAdminOpen(true);
  };

  const handleCloseAdmin = () => {
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
    setIsAdminOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050509] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Flash Sale Announcement Bar & Header */}
      <Navbar
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      <main className="flex-1">
        {/* 1. Main Hero Section (2027 Edition, Cover on Left, 11 Bullets, Rating & ₹197 Offer Card) */}
        <HeroSection
          productImages={storeConfig.productImages}
          onBuyClick={() => setIsCheckoutOpen(true)}
          onExploreDemos={() => {
            const el = document.getElementById('demos');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Product Demo (DEMO REELS VIDEOS 🔥 - Thumbnails side-by-side, mobile scrollable) */}
        <DemoReelsSection
          demoReels={storeConfig.demoReels}
          onBuyClick={() => setIsCheckoutOpen(true)}
        />

        {/* 3. Instagram ID Demo (Profile Mockup & Reel Grid Side-by-Side) */}
        <InstagramDemoSection
          instagram={storeConfig.instagram}
          onBuyClick={() => setIsCheckoutOpen(true)}
        />

        {/* 4. Concise Creator Sections (Bonuses Worth ₹12K, Who Is It For, Where To Upload, How To Make Money) */}
        <CreatorSections onBuyClick={() => setIsCheckoutOpen(true)} />

        {/* 5. Customer Reviews (Clean Verified Proof) */}
        <TestimonialsSection />

        {/* 6. Simple FAQ Accordion */}
        <FaqSection supportWhatsApp={storeConfig.supportWhatsApp} />
      </main>

      {/* Footer with Policies, Contact Us, and Admin Login */}
      <Footer
        supportWhatsApp={storeConfig.supportWhatsApp}
        onOpenLegal={handleOpenLegal}
        onOpenAdmin={handleOpenAdmin}
        onOpenTrack={() => setIsTrackOpen(true)}
      />

      {/* Dedicated Checkout Modal (UPI QR + Intent + Verification Form) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        upiId={storeConfig.upiId}
        merchantName={storeConfig.merchantName}
        customQrUrl={storeConfig.customQrUrl}
        onOrderSubmitted={handleOrderSubmitted}
      />

      {/* Customer Order Tracking & Download System */}
      <OrderTrackingModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        initialOrderId={trackingPrefill.orderId}
        initialAuth={trackingPrefill.auth}
      />

      {/* Admin Dashboard / Login Page (/admin/login) */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        initialSettings={storeConfig}
        onSettingsUpdated={loadConfig}
      />

      {/* Legal & Compliance Policies Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        tab={legalTab}
        onTabChange={setLegalTab}
      />
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DEFAULT_STORE_CONFIG } from './constants';
import { PublicStoreSettings } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { DemoReelsSection } from './components/DemoReelsSection';
import { InstagramDemoSection } from './components/InstagramDemoSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LegalModal } from './components/LegalModal';

export default function App() {
  const [storeConfig, setStoreConfig] = useState<PublicStoreSettings>(DEFAULT_STORE_CONFIG);
  
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

  // Load live store config from backend
  const loadConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.success && data.settings) {
        setStoreConfig((prev) => ({
          ...prev,
          ...data.settings,
        }));
      }
    } catch (err) {
      console.warn('Could not load remote config, using defaults:', err);
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

  return (
    <div className="min-h-screen bg-[#050509] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navigation Top Bar */}
      <Navbar
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        {/* 1. Hero Section with 3D Bundle Mockup & ₹197 CTA */}
        <HeroSection
          onBuyClick={() => setIsCheckoutOpen(true)}
          onExploreDemos={() => {
            const el = document.getElementById('demos');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Product Features & Content Breakdown */}
        <FeaturesSection onBuyClick={() => setIsCheckoutOpen(true)} />

        {/* 3. Demo Reels Section with Vertical 9:16 Cards */}
        <DemoReelsSection
          demoReels={storeConfig.demoReels}
          onBuyClick={() => setIsCheckoutOpen(true)}
        />

        {/* 4. Instagram Profile & Engagement Proof (Side-by-Side) */}
        <InstagramDemoSection
          instagram={storeConfig.instagram}
          onBuyClick={() => setIsCheckoutOpen(true)}
        />

        {/* 5. Quality Comparison (Sheru Bhai vs Others) */}
        <WhyChooseUsSection onBuyClick={() => setIsCheckoutOpen(true)} />

        {/* 6. Creator Testimonials */}
        <TestimonialsSection />

        {/* 7. FAQs & WhatsApp Help */}
        <FaqSection supportWhatsApp={storeConfig.supportWhatsApp} />
      </main>

      {/* Footer & Floating WhatsApp */}
      <Footer
        supportWhatsApp={storeConfig.supportWhatsApp}
        onOpenLegal={handleOpenLegal}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTrack={() => setIsTrackOpen(true)}
      />

      {/* Dedicated Checkout Modal (UPI QR + Intent + Verification Form) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        upiId={storeConfig.upiId}
        merchantName={storeConfig.merchantName}
        onOrderSubmitted={handleOrderSubmitted}
      />

      {/* Customer Order Tracking & Download System */}
      <OrderTrackingModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        initialOrderId={trackingPrefill.orderId}
        initialAuth={trackingPrefill.auth}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
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

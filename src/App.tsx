/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Juegos Y Sonrisas Daycare - Mattapan, MA
 */

import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutAmelia } from './components/AboutAmelia';
import { OurSpace } from './components/OurSpace';
import { ProgramsTuition } from './components/ProgramsTuition';
import { DailyRhythm } from './components/DailyRhythm';
import { SafetyTrust } from './components/SafetyTrust';
import { EnrollmentForm } from './components/EnrollmentForm';
import { GalleryLightbox } from './components/GalleryLightbox';
import { ParentVoices } from './components/ParentVoices';
import { FAQAccordion } from './components/FAQAccordion';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { TourModal } from './components/TourModal';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { DAYCARE_INFO } from './data/translations';

import { AdminProvider } from './context/AdminContext';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

function MainAppContent() {
  const [language, setLanguage] = useState<Language>('en');
  const [isTourModalOpen, setIsTourModalOpen] = useState<boolean>(false);
  const [preselectedProgramId, setPreselectedProgramId] = useState<string>('preschool-ready');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Simple client-side URL route state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin/login')) return '/admin/login';
      if (path.startsWith('/admin')) return '/admin';
      if (window.location.hash === '#admin') return '/admin';
    }
    return '/';
  });

  // Scroll Progress tracker
  useEffect(() => {
    if (currentRoute !== '/') return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin/login')) setCurrentRoute('/admin/login');
      else if (path.startsWith('/admin') || window.location.hash === '#admin') setCurrentRoute('/admin');
      else setCurrentRoute('/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
  };

  const handleSelectProgramForEnrollment = (programId: string) => {
    setPreselectedProgramId(programId);
    const formEl = document.getElementById('enrollment');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Route 1: Admin Login
  if (currentRoute === '/admin/login') {
    return (
      <AdminLogin
        onLoginSuccess={() => navigateTo('/admin')}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // Route 2: Admin Dashboard
  if (currentRoute === '/admin') {
    const isAdmin = typeof localStorage !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      return (
        <AdminLogin
          onLoginSuccess={() => navigateTo('/admin')}
          onNavigateHome={() => navigateTo('/')}
        />
      );
    }
    return (
      <AdminDashboard
        onLogout={() => {
          localStorage.removeItem('isAdmin');
          navigateTo('/admin/login');
        }}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // Route 3: Public Daycare Website
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E7] text-[#1A237E] font-sans antialiased selection:bg-[#FFD60A] selection:text-[#1A237E]">
      {/* Fixed Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-[4px] bg-gradient-to-r from-[#2D6A4F] to-[#FF6B6B] z-[100] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Top Bar / Navigation */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenTourModal={() => setIsTourModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="grow">
        {/* Section 2: Hero */}
        <Hero
          language={language}
          onOpenTourModal={() => setIsTourModalOpen(true)}
        />

        {/* Section 3: About Amelia */}
        <AboutAmelia language={language} />

        {/* Section 4: Gallery & Lightbox (Our Learning Sanctuary) */}
        <GalleryLightbox language={language} />

        {/* Section 5: Our Space */}
        <OurSpace language={language} />

        {/* Section 6: Programs & Tuition */}
        <ProgramsTuition
          language={language}
          onSelectProgramForEnrollment={handleSelectProgramForEnrollment}
          onOpenTourModal={() => setIsTourModalOpen(true)}
        />

        {/* Section 7: Daily Rhythm Timeline */}
        <DailyRhythm language={language} />

        {/* Section 8: Safety & Trust Certification Wall */}
        <SafetyTrust language={language} />

        {/* Section 9: Enrollment Booking Form */}
        <EnrollmentForm
          language={language}
          preselectedProgramId={preselectedProgramId}
        />

        {/* Section 10: Parent Voices / Testimonials */}
        <ParentVoices language={language} />

        {/* Section 11: FAQ Accordion */}
        <FAQAccordion language={language} />

        {/* Section 12: Location & Contact */}
        <LocationContact
          language={language}
          onOpenTourModal={() => setIsTourModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Interactive Tour Booking Modal */}
      <TourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        language={language}
      />

      {/* Floating Bottom Quick Contact Bar (Mobile & Desktop Accessible) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {/* Fixed Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full bg-[#1A237E] hover:bg-[#283593] text-[#FFD60A] shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-3 duration-300 cursor-pointer"
            aria-label="Back to top"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        <a
          href={DAYCARE_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          aria-label="Chat on WhatsApp with Amelia"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        <a
          href={`tel:${DAYCARE_INFO.phoneRaw}`}
          className="hidden sm:flex items-center gap-2 bg-[#1A237E] hover:bg-[#283593] text-white text-xs font-bold px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Direct Phone Call"
        >
          <Phone className="w-4 h-4 text-[#FFD60A]" />
          <span className="tabular-nums">{DAYCARE_INFO.phone}</span>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <MainAppContent />
    </AdminProvider>
  );
}

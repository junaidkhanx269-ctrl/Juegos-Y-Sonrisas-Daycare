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
import { Phone, MessageCircle } from 'lucide-react';
import { DAYCARE_INFO } from './data/translations';

import { AdminProvider } from './context/AdminContext';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

function MainAppContent() {
  const [language, setLanguage] = useState<Language>('en');
  const [isTourModalOpen, setIsTourModalOpen] = useState<boolean>(false);
  const [preselectedProgramId, setPreselectedProgramId] = useState<string>('preschool-ready');

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

        {/* Section 4: Our Space */}
        <OurSpace language={language} />

        {/* Section 5: Programs & Tuition */}
        <ProgramsTuition
          language={language}
          onSelectProgramForEnrollment={handleSelectProgramForEnrollment}
          onOpenTourModal={() => setIsTourModalOpen(true)}
        />

        {/* Section 6: Daily Rhythm Timeline */}
        <DailyRhythm language={language} />

        {/* Section 7: Safety & Trust Certification Wall */}
        <SafetyTrust language={language} />

        {/* Section 8: Enrollment Booking Form */}
        <EnrollmentForm
          language={language}
          preselectedProgramId={preselectedProgramId}
        />

        {/* Section 9: Gallery & Lightbox */}
        <GalleryLightbox language={language} />

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

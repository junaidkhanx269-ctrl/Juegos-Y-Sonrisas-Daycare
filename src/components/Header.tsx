import React, { useState, useEffect } from 'react';
import { Phone, Globe, Calendar, Menu, X, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { DAYCARE_INFO } from '../data/translations';
import { SmileyFace, BuildingBlocksIcon } from './Doodles';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenTourModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenTourModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', labelEn: 'About Amelia', labelEs: 'Sobre Amelia' },
    { href: '#programs', labelEn: 'Programs', labelEs: 'Programas' },
    { href: '#daily-rhythm', labelEn: 'Daily Rhythm', labelEs: 'Ritmo Diario' },
    { href: '#our-space', labelEn: 'Our Space', labelEs: 'Nuestro Espacio' },
    { href: '#tuition', labelEn: 'Tuition', labelEs: 'Tarifas' },
    { href: '#faq', labelEn: 'FAQ', labelEs: 'Preguntas' },
    { href: '#location', labelEn: 'Contact', labelEs: 'Contacto' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFF8E7]/90 backdrop-blur-md shadow-sm border-b border-[#1A237E]/10 py-3'
          : 'bg-[#FFF8E7]/60 backdrop-blur-xs py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Wordmark (Zone 1) */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-[#1A237E] group transition-transform active:scale-95"
            aria-label="Juegos Y Sonrisas Daycare Home"
          >
            <div className="flex items-center gap-1">
              <BuildingBlocksIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              <div className="flex items-baseline">
                <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-[#1A237E] group-hover:text-[#FF6B6B] transition-colors">
                  juegos y s
                </span>
                <span className="inline-flex items-center -mx-0.5">
                  <SmileyFace className="w-5 h-5 sm:w-6 sm:h-6 inline-block" />
                </span>
                <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-[#1A237E] group-hover:text-[#FF6B6B] transition-colors">
                  nrisas
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links (Zone 2) */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-semibold text-[#1A237E]/80"
            aria-label="Primary Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#FF6B6B] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FF6B6B] hover:after:w-full after:transition-all after:duration-200"
              >
                {language === 'en' ? link.labelEn : link.labelEs}
              </a>
            ))}
          </nav>

          {/* Right Action Zone (Zone 3) */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Direct Phone Call Link */}
            <a
              href={`tel:${DAYCARE_INFO.phoneRaw}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#1A237E] hover:text-[#FF6B6B] px-3 py-1.5 transition-colors"
              title="Call Juegos Y Sonrisas Daycare"
            >
              <Phone className="w-4 h-4 text-[#FF6B6B]" />
              <span className="tabular-nums">{DAYCARE_INFO.phone}</span>
            </a>

            {/* Bilingual Language Switcher EN | ES */}
            <div className="flex items-center border border-[#1A237E]/20 bg-white/70 rounded-full p-0.5 text-xs font-bold text-[#1A237E]">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-[#1A237E] text-white shadow-xs'
                    : 'text-[#1A237E]/70 hover:text-[#1A237E]'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('es')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'es'
                    ? 'bg-[#1A237E] text-white shadow-xs'
                    : 'text-[#1A237E]/70 hover:text-[#1A237E]'
                }`}
                aria-label="Cambiar a Español"
              >
                ES
              </button>
            </div>

            {/* Primary CTA Button "Schedule Tour" */}
            <button
              type="button"
              onClick={onOpenTourModal}
              className="inline-flex items-center gap-1.5 bg-[#1A237E] hover:bg-[#283593] text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>{language === 'en' ? 'Schedule Tour' : 'Agendar Visita'}</span>
            </button>

            {/* Admin Panel Quick Access Button */}
            <a
              href="/admin/login"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/admin/login');
                window.dispatchEvent(new Event('popstate'));
              }}
              className="hidden md:inline-flex items-center gap-1.5 bg-[#8B4513] hover:bg-[#5D2E0C] text-[#FFF8DC] text-xs font-bold px-3 py-2 rounded-full shadow-xs hover:shadow transition-all hover:scale-105 border border-[#8B4513]/20"
              title="Admin Panel Login"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Admin</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1A237E] hover:bg-[#1A237E]/5 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-white/95 rounded-2xl shadow-xl border border-[#1A237E]/10 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-semibold text-base text-[#1A237E] hover:text-[#FF6B6B] py-1.5 px-2 rounded-lg hover:bg-[#FFF8E7]/50 transition-colors"
                >
                  {language === 'en' ? link.labelEn : link.labelEs}
                </a>
              ))}
              <div className="pt-3 border-t border-[#1A237E]/10 flex flex-col gap-2.5">
                <a
                  href={`tel:${DAYCARE_INFO.phoneRaw}`}
                  className="flex items-center gap-2 text-sm font-bold text-[#1A237E] py-2 px-2"
                >
                  <Phone className="w-4 h-4 text-[#FF6B6B]" />
                  <span>{DAYCARE_INFO.phone}</span>
                </a>
                <a
                  href="/admin/login"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    window.history.pushState({}, '', '/admin/login');
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#8B4513] text-[#FFF8DC] font-bold py-2.5 rounded-xl border border-[#8B4513]/20"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFD60A]" />
                  <span>Admin Panel Login</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTourModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#FFD60A] text-[#1A237E] font-bold py-2.5 rounded-xl"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'en' ? 'Schedule a Tour' : 'Agendar Visita'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

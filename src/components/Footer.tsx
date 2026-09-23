import React, { useState } from 'react';
import { Mail, Check, Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Language } from '../types';
import { DAYCARE_INFO } from '../data/translations';
import { SmileyFace, BuildingBlocksIcon } from './Doodles';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#1A237E] text-white pt-16 pb-12 border-t-4 border-[#FFD60A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <BuildingBlocksIcon className="w-8 h-8" />
              <div className="flex items-baseline">
                <span className="font-display font-bold text-2xl tracking-tight text-white">
                  juegos y s
                </span>
                <span className="inline-flex items-center -mx-0.5">
                  <SmileyFace className="w-6 h-6 inline-block" />
                </span>
                <span className="font-display font-bold text-2xl tracking-tight text-white">
                  nrisas
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              {language === 'en'
                ? 'Where Learning is Full of Games & Smiles. Licensed home preschool & infant sanctuary in Roslindale, Boston MA. Guided with love by licensed educator Amelia M Vargas.'
                : 'Donde Aprender es Juego y Sonrisas. Preescolar y santuario infantil con licencia en Roslindale, Boston MA. Guiado con cariño y vocación por la educadora Amelia M Vargas.'}
            </p>

            <div className="pt-2 text-xs text-white/60 space-y-1 font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#A8E6CF]" />
                <span>{DAYCARE_INFO.licenseState} #{DAYCARE_INFO.licenseNumber}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-display font-bold text-sm text-[#FFD60A] uppercase tracking-wider">
              {language === 'en' ? 'Explore' : 'Navegación'}
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <a href="#about" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'About Amelia' : 'Sobre Amelia'}
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'Programs' : 'Programas'}
                </a>
              </li>
              <li>
                <a href="#our-space" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'Our Space' : 'Nuestro Espacio'}
                </a>
              </li>
              <li>
                <a href="#daily-rhythm" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'Daily Rhythm' : 'Ritmo Diario'}
                </a>
              </li>
              <li>
                <a href="#tuition" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'Tuition Rates' : 'Colegiaturas'}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'FAQ' : 'Preguntas'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-display font-bold text-sm text-[#FFD60A] uppercase tracking-wider">
              {language === 'en' ? 'Programs' : 'Programas'}
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <a href="#tuition" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'Infants (3mo–2y)' : 'Bebés (3m–2a)'}
                </a>
              </li>
              <li>
                <a href="#tuition" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'Preschool (2y–5y)' : 'Preescolar (2a–5a)'}
                </a>
              </li>
              <li>
                <a href="#tuition" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'School Age (5y)' : 'Edad Escolar (5a)'}
                </a>
              </li>
              <li>
                <a href="#tuition" className="hover:text-[#FFD60A] transition-colors">
                  {language === 'en' ? 'Extended Care' : 'Horario Extendido'}
                </a>
              </li>
              <li>
                <a href="#enrollment" className="hover:text-[#FFD60A] transition-colors text-[#A8E6CF]">
                  {language === 'en' ? 'Child Care Subsidies' : 'Vales y Subsidios'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="font-display font-bold text-sm text-[#FFD60A] uppercase tracking-wider">
              {language === 'en' ? 'Stay In Touch' : 'Manténgase Informado'}
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                <span>{DAYCARE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFD60A] shrink-0" />
                <a href={`tel:${DAYCARE_INFO.phoneRaw}`} className="hover:underline tabular-nums">
                  {DAYCARE_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A8E6CF] shrink-0" />
                <span>{language === 'en' ? DAYCARE_INFO.hoursEn : DAYCARE_INFO.hoursEs}</span>
              </div>
            </div>

            {/* Newsletter input */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-white/90 mb-1.5">
                {language === 'en' ? 'Get parenting tips & enrollment updates:' : 'Reciba consejos de crianza y noticias:'}
              </div>

              {subscribed ? (
                <div className="p-3 bg-[#2D6A4F] text-white rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{language === 'en' ? 'Thank you! You are subscribed.' : '¡Gracias! Se ha suscrito con éxito.'}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder={language === 'en' ? 'Enter parent email...' : 'Correo del padre...'}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-white/10 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#FFD60A] grow"
                  />
                  <button
                    type="submit"
                    className="bg-[#FFD60A] hover:bg-[#ffe14d] text-[#1A237E] font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Join' : 'Unirse'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} {DAYCARE_INFO.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>{DAYCARE_INFO.licenseState} #{DAYCARE_INFO.licenseNumber}</span>
            <span>·</span>
            <span>Roslindale, MA 02131</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

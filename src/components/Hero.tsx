import React from 'react';
import { ShieldCheck, HeartPulse, CheckCircle2, Phone, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { DAYCARE_INFO } from '../data/translations';
import { SunshineDoodle, HandDrawnArrow, WavyUnderline, StarSparkle } from './Doodles';

import heroClassroom from '../assets/images/hero_montessori_classroom_1790135121726.jpg';
import backyardPlay from '../assets/images/daycare_backyard_play_1790135141749.jpg';
import readingNook from '../assets/images/reading_nook_cozy_1790135186078.jpg';
import kidsArt from '../assets/images/kids_art_sensory_station_1790135171821.jpg';

interface HeroProps {
  language: Language;
  onOpenTourModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onOpenTourModal }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24 bg-grain">
      {/* Background soft ambient blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#FFD60A]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#A8E6CF]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: 60% (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Top eyebrow trust notice */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1A237E]/90 bg-white/80 border border-[#1A237E]/10 rounded-full px-4 py-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              <span>{language === 'en' ? 'Roslindale, MA · Infant to 5 Years Home Preschool' : 'Roslindale, MA · Preescolar en el Hogar de Lactantes a 5 Años'}</span>
              <span className="text-[#1A237E]/30">|</span>
              <span className="font-bold text-[#FF6B6B]">{language === 'en' ? 'Enrolling for 2026' : 'Inscripciones Abiertas'}</span>
            </div>

            {/* Giant Heading with Wavy underline & Doodles */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 hidden sm:block">
                <SunshineDoodle className="w-12 h-12 text-[#FFD60A]" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[#1A237E] tracking-tight leading-[1.08] text-balance">
                {language === 'en' ? (
                  <>
                    Games, Smiles & <br className="hidden sm:inline" />
                    <span className="relative inline-block text-[#1A237E]">
                      Big Dreams
                      <WavyUnderline className="absolute -bottom-2.5 left-0 w-full h-3" />
                    </span>{' '}
                    Start Here.
                  </>
                ) : (
                  <>
                    Juegos, Sonrisas y <br className="hidden sm:inline" />
                    <span className="relative inline-block text-[#1A237E]">
                      Grandes Sueños
                      <WavyUnderline className="absolute -bottom-2.5 left-0 w-full h-3" />
                    </span>{' '}
                    Comienzan Aquí.
                  </>
                )}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#1A237E]/80 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Licensed home preschool in Roslindale for infants to 5 years. Nurturing psychological, emotional, social & cognitive growth through intentional play. Certified in Early Childhood Education, First Aid & CPR.'
                : 'Preescolar en el hogar con licencia en Roslindale para bebés hasta 5 años. Nutriendo el desarrollo emocional, social y cognitivo a través del juego intencional. Certificada en Educación Temprana, Primeros Auxilios y RCP.'}
            </p>

            {/* Trust Row: 3 verified badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2.5 bg-white/90 p-3 rounded-2xl border border-[#1A237E]/10 shadow-xs">
                <div className="p-2 rounded-xl bg-[#A8E6CF]/30 text-[#2D6A4F] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A237E]">{language === 'en' ? 'MA Licensed' : 'Licencia Oficial MA'}</div>
                  <div className="text-[11px] text-[#1A237E]/70 font-mono">#{DAYCARE_INFO.licenseNumber}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/90 p-3 rounded-2xl border border-[#1A237E]/10 shadow-xs">
                <div className="p-2 rounded-xl bg-[#FF6B6B]/20 text-[#FF6B6B] shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A237E]">{language === 'en' ? 'CPR & First Aid' : 'RCP y 1ros Auxilios'}</div>
                  <div className="text-[11px] text-[#1A237E]/70">{language === 'en' ? 'Pediatric Certified' : 'Certificación Vigente'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/90 p-3 rounded-2xl border border-[#1A237E]/10 shadow-xs">
                <div className="p-2 rounded-xl bg-[#FFD60A]/30 text-[#E07A5F] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A237E]">{language === 'en' ? 'Child Care Subsidies' : 'Aceptamos Subsidios'}</div>
                  <div className="text-[11px] text-[#1A237E]/70">{language === 'en' ? 'State Vouchers OK' : 'Vales Estatales de MA'}</div>
                </div>
              </div>
            </div>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenTourModal}
                className="inline-flex items-center justify-center gap-2.5 bg-[#1A237E] hover:bg-[#283593] text-white text-base font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-[#FFD60A]" />
                <span>{language === 'en' ? 'Schedule a Tour' : 'Agendar una Visita'}</span>
              </button>

              <a
                href={`tel:${DAYCARE_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FFF8E7] text-[#1A237E] border-2 border-[#1A237E] text-base font-bold px-6 py-3 rounded-full transition-all hover:shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#FF6B6B]" />
                <span>{language === 'en' ? 'Call (857) 361-8923' : 'Llamar (857) 361-8923'}</span>
              </a>
            </div>

            {/* Address kicker */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1A237E]/70 pt-1">
              <MapPin className="w-4 h-4 text-[#E07A5F] shrink-0" />
              <span>{DAYCARE_INFO.address} · Roslindale, Boston</span>
            </div>
          </div>

          {/* Right Column: 40% (5 cols on lg) - Asymmetrical Image Stack */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            
            {/* Hand-drawn arrow note */}
            <div className="absolute -top-10 right-4 sm:right-10 z-20 flex items-center gap-2 pointer-events-none">
              <span className="font-display font-semibold text-xs sm:text-sm text-[#E07A5F] bg-white/90 px-3 py-1 rounded-full shadow-xs border border-[#E07A5F]/20">
                {language === 'en' ? 'Our little world at 136 Mount Hope St' : 'Nuestro espacio en 136 Mount Hope St'}
              </span>
              <HandDrawnArrow className="w-12 h-7 text-[#E07A5F]" />
            </div>

            {/* Main Primary Image */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform transition-transform hover:scale-[1.01] duration-300">
              <img
                src={heroClassroom}
                alt="Montessori classroom and art learning area at Juegos Y Sonrisas Daycare"
                className="w-full h-80 sm:h-96 object-cover"
                loading="eager"
              />
              <div className="absolute bottom-3 left-3 bg-[#1A237E]/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                {language === 'en' ? '✨ Light-filled Montessori Atelier' : '✨ Atelier Montessori Luminoso'}
              </div>
            </div>

            {/* Floating Polaroid 1: Backyard (Top Left Offset) */}
            <div className="absolute -bottom-8 -left-6 sm:-left-10 z-20 w-44 sm:w-52 polaroid-frame transform -rotate-4 hover:rotate-0 transition-transform duration-300">
              <img
                src={backyardPlay}
                alt="Enclosed green backyard outdoor play space in Roslindale"
                className="w-full h-28 sm:h-32 object-cover rounded-md"
                loading="lazy"
              />
              <div className="pt-2 text-center">
                <span className="font-display text-xs font-bold text-[#1A237E]">
                  {language === 'en' ? '🌿 Fenced Backyard Play' : '🌿 Jardín Seguro'}
                </span>
              </div>
            </div>

            {/* Floating Polaroid 2: Cozy Reading Nook (Top Right Offset) */}
            <div className="absolute -top-8 -right-4 sm:-right-8 z-20 w-36 sm:w-44 polaroid-frame transform rotate-6 hover:rotate-0 transition-transform duration-300 hidden sm:block">
              <img
                src={readingNook}
                alt="Cozy reading nook with children books"
                className="w-full h-24 sm:h-28 object-cover rounded-md"
                loading="lazy"
              />
              <div className="pt-1.5 text-center">
                <span className="font-display text-[11px] font-bold text-[#1A237E]">
                  {language === 'en' ? '📖 Cozy Story Nook' : '📖 Rincón de Cuentos'}
                </span>
              </div>
            </div>

            {/* Small decorative stamp */}
            <div className="absolute -bottom-10 right-4 z-20 bg-[#FFD60A] text-[#1A237E] font-display font-bold text-xs p-3 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1.5 rotate-3">
              <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
              <span>{language === 'en' ? 'Bilingual Daily' : '100% Bilingüe'}</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

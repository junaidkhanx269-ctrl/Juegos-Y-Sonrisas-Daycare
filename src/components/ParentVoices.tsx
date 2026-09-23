import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Language } from '../types';
import { TESTIMONIALS } from '../data/translations';

interface ParentVoicesProps {
  language: Language;
}

export const ParentVoices: React.FC<ParentVoicesProps> = ({ language }) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const prev = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const next = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <section className="py-16 md:py-24 bg-[#FFF8E7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#FF6B6B] uppercase font-mono">
            {language === 'en' ? 'Community Trust' : 'Voces de Nuestra Comunidad'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-4">
            {language === 'en' ? 'What Boston Families Say' : 'Lo Que Dicen Nuestras Familias'}
          </h2>
          <p className="text-base text-[#1A237E]/75 leading-relaxed">
            {language === 'en'
              ? 'Real words from parents in Mattapan, Dorchester, and Boston whose little ones grew up at Juegos Y Sonrisas.'
              : 'Testimonios reales de padres de Mattapan, Dorchester y Boston cuyos pequeños crecieron en Juegos Y Sonrisas.'}
          </p>
        </div>

        {/* Featured Testimonial Big Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#1A237E]/10 shadow-lg relative">
            <Quote className="w-12 h-12 text-[#FFD60A] absolute top-6 right-8 opacity-40" />

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FFD60A] text-[#FFD60A]" />
              ))}
              <span className="ml-2 text-xs font-bold text-[#1A237E]/70 font-mono">5.0 Star Parent Rating</span>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-lg sm:text-xl text-[#1A237E] font-medium leading-relaxed mb-8">
              “{language === 'en' ? TESTIMONIALS[activeIdx].quote : TESTIMONIALS[activeIdx].quoteEs}”
            </blockquote>

            {/* Author Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#1A237E]/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#A8E6CF]/40 text-[#2D6A4F] flex items-center justify-center font-display font-bold text-lg">
                  {TESTIMONIALS[activeIdx].author.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-bold text-base text-[#1A237E]">
                    {TESTIMONIALS[activeIdx].author}
                  </div>
                  <div className="text-xs text-[#1A237E]/70">
                    {language === 'en' ? TESTIMONIALS[activeIdx].relation : TESTIMONIALS[activeIdx].relationEs} ·{' '}
                    <span className="text-[#E07A5F] font-semibold">{TESTIMONIALS[activeIdx].neighborhood}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className="p-2.5 rounded-full bg-[#FFF8E7] hover:bg-[#FFD60A] text-[#1A237E] transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono font-bold text-[#1A237E]/60 px-1">
                  {activeIdx + 1} / {TESTIMONIALS.length}
                </span>
                <button
                  type="button"
                  onClick={next}
                  className="p-2.5 rounded-full bg-[#FFF8E7] hover:bg-[#FFD60A] text-[#1A237E] transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Testimonial Thumbnail Pills */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  activeIdx === idx ? 'w-8 bg-[#1A237E]' : 'w-2.5 bg-[#1A237E]/20 hover:bg-[#1A237E]/40'
                }`}
                aria-label={`Jump to review by ${t.author}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

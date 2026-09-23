import React, { useState, useEffect } from 'react';
import {
  Sun,
  Music,
  Palette,
  Trees,
  Utensils,
  Moon,
  Apple,
  HeartHandshake,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Language, RhythmItem } from '../types';
import { DAILY_RHYTHM } from '../data/translations';

interface DailyRhythmProps {
  language: Language;
}

export const DailyRhythm: React.FC<DailyRhythmProps> = ({ language }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Icon mapping helper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return Sun;
      case 'Music':
        return Music;
      case 'Palette':
        return Palette;
      case 'Trees':
        return Trees;
      case 'Utensils':
        return Utensils;
      case 'Moon':
        return Moon;
      case 'Apple':
        return Apple;
      case 'HeartHandshake':
        return HeartHandshake;
      default:
        return Sun;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="daily-rhythm" className="py-16 md:py-24 bg-[#FFF8E7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#2D6A4F] uppercase font-mono">
              {language === 'en' ? 'Predictable & Loving Structure' : 'Estructura Predecible y Amorosa'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-3">
              {language === 'en' ? 'Our Daily Rhythm & Flow' : 'El Ritmo de Nuestro Día'}
            </h2>
            <p className="text-base text-[#1A237E]/75 leading-relaxed">
              {language === 'en'
                ? 'Children thrive when they know what comes next. Our day balances energetic outdoor play with calm focus, healthy meals, and joyful discovery.'
                : 'Los niños crecen seguros cuando anticipan lo que viene. Nuestro día equilibra el juego al aire libre, momentos de calma, alimentación sana y exploración alegre.'}
            </p>
          </div>

          {/* Navigation arrow buttons for horizontal scroll */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <div className="text-xs text-[#1A237E]/60 font-semibold mr-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FF6B6B]" />
              <span>8:00 AM – 5:00 PM</span>
            </div>
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full bg-white border border-[#1A237E]/10 hover:bg-[#FFD60A] text-[#1A237E] shadow-xs transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full bg-white border border-[#1A237E]/10 hover:bg-[#FFD60A] text-[#1A237E] shadow-xs transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Timeline */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {DAILY_RHYTHM.map((item, index) => {
            const Icon = getIcon(item.icon);
            const isSelected = selectedIdx === index;
            
            return (
              <div
                key={index}
                onClick={() => setSelectedIdx(index)}
                className={`snap-center shrink-0 w-[280px] sm:w-[320px] p-6 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white border-2 border-[#1A237E] shadow-lg -translate-y-1'
                    : 'bg-white/80 border-[#1A237E]/10 shadow-xs hover:bg-white hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar with Time & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-bold text-lg text-[#1A237E] tabular-nums bg-[#FFF8E7] px-3 py-1 rounded-xl border border-[#1A237E]/10">
                      {item.time}
                    </span>
                    <div
                      className={`p-2.5 rounded-2xl ${
                        index % 4 === 0
                          ? 'bg-[#FFD60A]/30 text-[#1A237E]'
                          : index % 4 === 1
                          ? 'bg-[#A8E6CF]/40 text-[#2D6A4F]'
                          : index % 4 === 2
                          ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                          : 'bg-[#E07A5F]/20 text-[#E07A5F]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="mb-2">
                    <span className="text-[11px] font-bold text-[#E07A5F] tracking-wide uppercase font-mono">
                      {language === 'en' ? item.badge : item.badgeEs}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg text-[#1A237E] mb-2 leading-snug">
                    {language === 'en' ? item.title : item.titleEs}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#1A237E]/75 leading-relaxed">
                    {language === 'en' ? item.description : item.descriptionEs}
                  </p>
                </div>

                {/* Step indicator in card footer */}
                <div className="mt-6 pt-4 border-t border-[#1A237E]/10 flex items-center justify-between text-xs text-[#1A237E]/50">
                  <span className="font-mono">Block {index + 1} of 8</span>
                  {isSelected && (
                    <span className="text-xs font-bold text-[#1A237E] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FFD60A]" />
                      <span>{language === 'en' ? 'Selected' : 'Detalle'}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Block Quick Spotlight Card */}
        <div className="mt-8 p-6 bg-white rounded-3xl border border-[#1A237E]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD60A] text-[#1A237E] flex items-center justify-center font-display font-bold text-lg shrink-0">
              #{selectedIdx + 1}
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A237E]/70 font-mono">
                {DAILY_RHYTHM[selectedIdx].time} · {language === 'en' ? DAILY_RHYTHM[selectedIdx].badge : DAILY_RHYTHM[selectedIdx].badgeEs}
              </div>
              <div className="font-display font-bold text-base sm:text-lg text-[#1A237E]">
                {language === 'en' ? DAILY_RHYTHM[selectedIdx].title : DAILY_RHYTHM[selectedIdx].titleEs}
              </div>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-[#1A237E]/80 max-w-lg sm:text-right">
            {language === 'en' ? DAILY_RHYTHM[selectedIdx].description : DAILY_RHYTHM[selectedIdx].descriptionEs}
          </div>
        </div>

      </div>
    </section>
  );
};

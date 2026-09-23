import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { FAQS, DAYCARE_INFO } from '../data/translations';

interface FAQAccordionProps {
  language: Language;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ language }) => {
  const [openIds, setOpenIds] = useState<string[]>(['hours', 'license']);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white/70 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#2D6A4F] uppercase font-mono">
            {language === 'en' ? 'Got Questions?' : 'Preguntas Frecuentes'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-4">
            {language === 'en' ? 'Frequently Asked Questions' : 'Todo lo que Necesita Saber'}
          </h2>
          <p className="text-base text-[#1A237E]/75 leading-relaxed">
            {language === 'en'
              ? 'Clear answers regarding licensing, daily routines, tuition subsidies, meals, and enrollment policies.'
              : 'Respuestas claras sobre nuestra licencia, rutinas diarias, subsidios, comidas y proceso de inscripción.'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#1A237E]/10 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FFF8E7]/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-base sm:text-lg text-[#1A237E] text-balance">
                    {language === 'en' ? faq.question : faq.questionEs}
                  </span>
                  <div
                    className={`p-1.5 rounded-full bg-[#FFF8E7] text-[#1A237E] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#FFD60A]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#1A237E]/80 leading-relaxed border-t border-[#1A237E]/5 animate-in fade-in duration-200">
                    <p>{language === 'en' ? faq.answer : faq.answerEs}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 bg-[#FFF8E7] rounded-3xl border border-[#1A237E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#FF6B6B] flex items-center justify-center shadow-2xs shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm sm:text-base text-[#1A237E]">
                {language === 'en' ? 'Have a specific question for Amelia?' : '¿Tiene alguna otra duda para Amelia?'}
              </div>
              <div className="text-xs text-[#1A237E]/70">
                {language === 'en'
                  ? 'We are happy to explain our care routines or schedule details.'
                  : 'Con gusto le explicamos nuestras rutinas y adaptaciones especiales.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${DAYCARE_INFO.phoneRaw}`}
              className="inline-flex items-center gap-1.5 bg-[#1A237E] hover:bg-[#283593] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>(857) 361-8923</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

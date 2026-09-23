import React, { useState } from 'react';
import { Check, Star, Calculator, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { PROGRAMS } from '../data/translations';
import { useAdmin } from '../context/AdminContext';

interface ProgramsTuitionProps {
  language: Language;
  onSelectProgramForEnrollment: (programId: string) => void;
  onOpenTourModal: () => void;
}

export const ProgramsTuition: React.FC<ProgramsTuitionProps> = ({
  language,
  onSelectProgramForEnrollment,
  onOpenTourModal,
}) => {
  const { siteContent } = useAdmin();
  const [selectedCalcTier, setSelectedCalcTier] = useState<string>('preschool-ready');
  const [calcExtendedCare, setCalcExtendedCare] = useState<boolean>(false);
  const [billingPeriod, setBillingPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const getPrice = (id: string) => {
    if (id === 'infants-toddlers') return siteContent.infantRate;
    if (id === 'preschool-ready') return siteContent.preschoolRate;
    if (id === 'school-age') return siteContent.schoolAgeRate;
    return 464;
  };

  const weeklyBase = getPrice(selectedCalcTier);
  const weeklyExtended = calcExtendedCare ? siteContent.extendedCareRate : 0;
  const weeklyTotal = weeklyBase + weeklyExtended;
  const monthlyTotal = Math.round((weeklyTotal * 52) / 12);

  return (
    <section id="tuition" className="py-16 md:py-24 bg-white/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#E07A5F] uppercase font-mono">
            {language === 'en' ? 'Transparent Family Tuition' : 'Tarifas Claras y Transparentes'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-4">
            {language === 'en' ? 'Programs Designed for Every Milestone' : 'Programas para Cada Etapa del Desarrollo'}
          </h2>
          <p className="text-base text-[#1A237E]/75 leading-relaxed">
            {language === 'en'
              ? 'All programs include full days (8am–5pm), fresh organic meals, snacks, daily photo tracking, and comprehensive bilingual curriculum. $0 registration fee.'
              : 'Todos los programas incluyen jornada completa (8am–5pm), alimentación orgánica casera, reportes diarios por app y currículo bilingüe. Matrícula a $0.'}
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {PROGRAMS.map((program) => {
            const isHighlight = program.highlight;
            return (
              <div
                key={program.id}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isHighlight
                    ? 'bg-[#FFF8E7] border-2 border-[#FFD60A] shadow-xl hover:-translate-y-1'
                    : 'bg-white border border-[#1A237E]/10 shadow-soft hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Popular Pill Marker */}
                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFD60A] text-[#1A237E] font-display font-bold text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#1A237E]" />
                    <span>{language === 'en' ? 'Most Popular' : 'Más Solicitado'}</span>
                  </div>
                )}

                <div>
                  {/* Age Range & Program Name */}
                  <div className="text-xs font-bold text-[#E07A5F] uppercase tracking-wider font-mono">
                    {language === 'en' ? program.ageRange : program.ageRangeEs}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-[#1A237E] mt-1 mb-2">
                    {language === 'en' ? program.name : program.nameEs}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1A237E]/75 leading-relaxed mb-6">
                    {language === 'en' ? program.description : program.descriptionEs}
                  </p>

                  {/* Price Block */}
                  <div className="py-4 border-y border-[#1A237E]/10 my-4 flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-display font-bold text-[#1A237E] tabular-nums">
                          ${getPrice(program.id)}
                        </span>
                        <span className="text-xs sm:text-sm text-[#1A237E]/70 font-semibold">
                          /{language === 'en' ? 'week' : 'sem'}
                        </span>
                      </div>
                      <div className="text-xs text-[#2D6A4F] font-bold mt-1">
                        {language === 'en' ? program.schedule : program.scheduleEs}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#A8E6CF]/30 text-[#2D6A4F]">
                        {language === 'en' ? 'Meals Included' : 'Comidas Inc.'}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-2 mb-8">
                    <div className="text-xs font-bold text-[#1A237E] uppercase tracking-wide">
                      {language === 'en' ? "What's Included:" : 'Beneficios Incluidos:'}
                    </div>
                    {(language === 'en' ? program.features : program.featuresEs).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1A237E]/80">
                        <div className="w-4 h-4 rounded-full bg-[#A8E6CF]/40 text-[#2D6A4F] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectProgramForEnrollment(program.id)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isHighlight
                        ? 'bg-[#1A237E] hover:bg-[#283593] text-white shadow-md'
                        : 'bg-[#FFF8E7] hover:bg-[#FFD60A] text-[#1A237E] border border-[#1A237E]/20'
                    }`}
                  >
                    <span>{language === 'en' ? 'Enroll in this Program' : 'Inscribirse en este Programa'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onOpenTourModal}
                    className="w-full text-center text-xs font-semibold text-[#1A237E]/70 hover:text-[#1A237E] py-1"
                  >
                    {language === 'en' ? 'Book a tour first' : 'Agendar visita previa'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add-ons & State Subsidy Callout Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <div className="p-4 bg-[#FFF8E7] rounded-2xl border border-[#1A237E]/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#2D6A4F] flex items-center justify-center font-bold text-base shadow-2xs">
              $0
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A237E]">
                {language === 'en' ? 'Registration Fee' : 'Costo de Matrícula'}
              </div>
              <div className="text-[11px] text-[#1A237E]/70">
                {language === 'en' ? 'Free onboarding & paperwork' : 'Inscripción totalmente gratuita'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FFF8E7] rounded-2xl border border-[#1A237E]/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#E07A5F] flex items-center justify-center font-bold text-base shadow-2xs">
              $25
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A237E]">
                {language === 'en' ? 'Reservation Deposit' : 'Depósito de Reserva'}
              </div>
              <div className="text-[11px] text-[#1A237E]/70">
                {language === 'en' ? 'Applied toward 1st week tuition' : 'Acreditado a su primera semana'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FFF8E7] rounded-2xl border border-[#1A237E]/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1A237E] flex items-center justify-center font-bold text-base shadow-2xs">
              $104
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A237E]">
                {language === 'en' ? 'Extended Care Option' : 'Horario Extendido Opcional'}
              </div>
              <div className="text-[11px] text-[#1A237E]/70">
                {language === 'en' ? 'Early 7:30am or late 5:30pm/wk' : 'Entrada temprana o salida tardía'}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tuition Calculator */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FFF8E7] to-white rounded-3xl border border-[#1A237E]/15 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left Calculator Controls */}
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                <Calculator className="w-4 h-4 text-[#FF6B6B]" />
                <span>{language === 'en' ? 'Interactive Tuition Estimator' : 'Calculadora de Colegiatura'}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-display font-bold text-[#1A237E]">
                {language === 'en' ? 'Calculate Your Family’s Investment' : 'Calcule la Inversión para su Familia'}
              </h4>

              {/* Program Picker */}
              <div className="flex flex-wrap gap-2 pt-1">
                {PROGRAMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedCalcTier(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCalcTier === p.id
                        ? 'bg-[#1A237E] text-white shadow-xs'
                        : 'bg-white text-[#1A237E] border border-[#1A237E]/15 hover:bg-[#FFF8E7]'
                    }`}
                  >
                    {language === 'en' ? p.name : p.nameEs}
                  </button>
                ))}
              </div>

              {/* Extended Care Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer pt-1 select-none">
                <input
                  type="checkbox"
                  checked={calcExtendedCare}
                  onChange={(e) => setCalcExtendedCare(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1A237E] focus:ring-[#FFD60A] border-gray-300"
                />
                <span className="text-xs sm:text-sm text-[#1A237E]/90 font-medium">
                  {language === 'en'
                    ? 'Add Extended Care (+ $104 / week for 7:30am drop-off or 5:30pm pick-up)'
                    : 'Agregar Horario Extendido (+ $104 / semana para entrega a las 7:30am o recogida 5:30pm)'}
                </span>
              </label>
            </div>

            {/* Right Result Display */}
            <div className="bg-white p-6 rounded-2xl border border-[#1A237E]/10 shadow-sm flex flex-col items-center sm:items-end justify-center min-w-[240px]">
              
              {/* Period toggle */}
              <div className="flex items-center bg-[#FFF8E7] rounded-lg p-1 text-xs font-bold text-[#1A237E] mb-3">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('weekly')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    billingPeriod === 'weekly' ? 'bg-[#1A237E] text-white shadow-2xs' : 'text-[#1A237E]/70'
                  }`}
                >
                  {language === 'en' ? 'Weekly' : 'Semanal'}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    billingPeriod === 'monthly' ? 'bg-[#1A237E] text-white shadow-2xs' : 'text-[#1A237E]/70'
                  }`}
                >
                  {language === 'en' ? 'Monthly Avg' : 'Prom. Mensual'}
                </button>
              </div>

              <div className="text-3xl sm:text-4xl font-display font-bold text-[#1A237E] tabular-nums">
                ${billingPeriod === 'weekly' ? weeklyTotal : monthlyTotal}
              </div>
              <div className="text-xs text-[#1A237E]/70 mt-1">
                {billingPeriod === 'weekly'
                  ? language === 'en'
                    ? 'billed weekly · meals included'
                    : 'facturación semanal · comidas incluidas'
                  : language === 'en'
                    ? 'approx. monthly investment'
                    : 'inversión mensual estimada'}
              </div>

              <div className="mt-3 pt-3 border-t border-[#1A237E]/10 w-full text-center sm:text-right">
                <span className="text-[11px] text-[#2D6A4F] font-semibold">
                  {language === 'en' ? '✓ Child Care Subsidies Accepted' : '✓ Aceptamos Vales Estatales'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

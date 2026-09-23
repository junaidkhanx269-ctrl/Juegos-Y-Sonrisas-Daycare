import React from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  UtensilsCrossed,
  Camera,
  Users2,
  KeyRound,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';
import { DAYCARE_INFO } from '../data/translations';

interface SafetyTrustProps {
  language: Language;
}

export const SafetyTrust: React.FC<SafetyTrustProps> = ({ language }) => {
  const trustCards = [
    {
      icon: ShieldCheck,
      color: 'bg-[#A8E6CF]/30 text-[#2D6A4F]',
      titleEn: 'Official MA EEC State License',
      titleEs: 'Licencia Oficial del Estado de MA',
      descEn: `Massachusetts Department of Early Education and Care (EEC) License #${DAYCARE_INFO.licenseNumber}. Subject to rigorous annual safety audits, background CORI/SORI checks, and building inspections.`,
      descEs: `Licencia #${DAYCARE_INFO.licenseNumber} otorgada por el Dept. de Educación y Cuidado Temprano de MA. Sujeta a inspecciones periódicas, verificación de antecedentes penales (CORI/SORI) e inspección física.`,
    },
    {
      icon: Users2,
      color: 'bg-[#FFD60A]/30 text-[#1A237E]',
      titleEn: 'Intimate Small Group Sizes',
      titleEs: 'Grupos Reducidos y Atención Personal',
      descEn: 'Low caregiver-to-child ratio ensures your baby or toddler receives individual eye contact, affectionate guidance, and immediate emotional support throughout every hour.',
      descEs: 'Proporción reducida de niños por educadora que garantiza contacto visual, afecto continuo y atención personalizada a cada necesidad en todo momento.',
    },
    {
      icon: UtensilsCrossed,
      color: 'bg-[#FF6B6B]/20 text-[#FF6B6B]',
      titleEn: 'Nutritious & Fresh Meals Included',
      titleEs: 'Comidas Orgánicas y Frescas Incluidas',
      descEn: 'Hot balanced lunch and two healthy snacks prepared fresh daily. Follows strict USDA child nutrition standards. Peanut-aware facility accommodating all allergies.',
      descEs: 'Almuerzos calientes y dos meriendas nutritivas al día. Siguiendo lineamientos nutricionales del USDA. Instalación libre de maní con manejo estricto de alergias.',
    },
    {
      icon: Sparkles,
      color: 'bg-[#A8E6CF]/30 text-[#2D6A4F]',
      titleEn: 'Medical-Grade Sanitization & HEPA Air',
      titleEs: 'Desinfección Diaria y Filtros HEPA',
      descEn: 'Daily disinfection of toys and surfaces with non-toxic, child-safe botanicals. Medical-grade HEPA air purifiers keep breathing zones clean and allergens low.',
      descEs: 'Desinfección meticulosa diaria de juguetes y superficies con productos botánicos seguros. Purificadores de aire con filtro HEPA continuo.',
    },
    {
      icon: Camera,
      color: 'bg-[#E07A5F]/20 text-[#E07A5F]',
      titleEn: 'Real-Time Daily Photo Updates',
      titleEs: 'Reportes y Fotos Diarias en Tiempo Real',
      descEn: 'Never miss a developmental milestone. Parents receive real-time photo journals, nap logs, feeding details, and joyful moments straight to their phone.',
      descEs: 'No se pierda ningún hito del desarrollo. Los padres reciben fotos diarias, registro de siestas, comidas y notas de bienestar directamente en su celular.',
    },
    {
      icon: KeyRound,
      color: 'bg-[#FFD60A]/30 text-[#1A237E]',
      titleEn: 'Secure Entry & Enclosed Grounds',
      titleEs: 'Entrada Segura y Perímetro Cerrado',
      descEn: 'Secure double-gated backyard, keyless authorized entry, and dedicated off-street driveway for safe, curbside drop-offs away from street traffic.',
      descEs: 'Patio cerrado con doble portón, acceso controlado con cerradura segura y estacionamiento privado para que los niños nunca bajen al tráfico.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#FF6B6B] uppercase font-mono">
            {language === 'en' ? 'Uncompromising Safety' : 'Seguridad Sin Concesiones'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-4">
            {language === 'en' ? 'Built on Trust, Licensed with Care' : 'Construido con Confianza, Licenciado con Amor'}
          </h2>
          <p className="text-base text-[#1A237E]/75 leading-relaxed">
            {language === 'en'
              ? 'Leaving your child in someone else’s care requires complete peace of mind. Here is how we safeguard your family’s most precious treasure.'
              : 'Confiar el cuidado de su hijo requiere tranquilidad absoluta. Así protegemos y cuidamos al tesoro más grande de su hogar.'}
          </p>
        </div>

        {/* License Verification Hero Callout */}
        <div className="mb-12 p-6 sm:p-8 bg-gradient-to-r from-[#FFF8E7] via-white to-[#FFF8E7] rounded-3xl border border-[#1A237E]/15 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileCheck2 className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Commonwealth of Massachusetts · EEC' : 'Estado de Massachusetts · EEC'}
                </div>
                <div className="text-xl sm:text-2xl font-display font-bold text-[#1A237E] mt-0.5">
                  {DAYCARE_INFO.licenseState} #{DAYCARE_INFO.licenseNumber}
                </div>
                <div className="text-xs text-[#1A237E]/70 mt-1">
                  {language === 'en'
                    ? 'Director: Amelia M Vargas · Active & In Good Standing with EEC Boston Region'
                    : 'Directora: Amelia M Vargas · Licencia Activa y al Día con el Departamento EEC de Boston'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:8573618923"
                className="inline-flex items-center gap-2 bg-[#1A237E] hover:bg-[#283593] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-xs"
              >
                <span>{language === 'en' ? 'Verify with Amelia' : 'Consultar con Amelia'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 6 Feature Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="p-6 bg-white rounded-3xl border border-[#1A237E]/10 shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#1A237E]">
                  {language === 'en' ? card.titleEn : card.titleEs}
                </h3>
                <p className="text-xs sm:text-sm text-[#1A237E]/75 leading-relaxed">
                  {language === 'en' ? card.descEn : card.descEs}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Award, GraduationCap, Heart, Sparkles, BookOpen, ShieldCheck, Check } from 'lucide-react';
import { Language } from '../types';
import { DAYCARE_INFO } from '../data/translations';
import ameliaPortrait from '../assets/images/amelia_educator_portrait_1790135158738.jpg';

interface AboutAmeliaProps {
  language: Language;
}

export const AboutAmelia: React.FC<AboutAmeliaProps> = ({ language }) => {
  const credentials = [
    {
      icon: ShieldCheck,
      titleEn: 'MA EEC Licensed Educator',
      titleEs: 'Educadora con Licencia EEC de MA',
      detailEn: 'License #9142647 · Family Child Care Provider',
      detailEs: 'Licencia #9142647 · Proveedora Certificada',
    },
    {
      icon: Heart,
      titleEn: 'Pediatric CPR & First Aid Certified',
      titleEs: 'Certificada en RCP y Primeros Auxilios',
      detailEn: 'American Heart Association · Bi-annual renewal',
      detailEs: 'Asociación Americana del Corazón · Renovación constante',
    },
    {
      icon: GraduationCap,
      titleEn: 'Early Childhood Education',
      titleEs: 'Educación Infantil Temprana',
      detailEn: 'Specialized in Montessori & Intentional Play Methods',
      detailEs: 'Especializada en Método Montessori y Juego Intencional',
    },
    {
      icon: Sparkles,
      titleEn: 'Native Bilingual Immersion',
      titleEs: 'Inmersión Bilingüe Nativa',
      detailEn: 'Fluent Spanish & English language development',
      detailEs: 'Desarrollo integral fluido en español e inglés',
    },
  ];

  const pillars = [
    {
      titleEn: 'Fun (Diversión)',
      titleEs: 'Diversión (Fun)',
      color: 'bg-[#FFD60A]/30 text-[#1A237E]',
      descEn: 'Laughter is the foundation of engagement. When children delight in the process, curiosity thrives naturally.',
      descEs: 'La risa es el cimiento del aprendizaje. Cuando los niños disfrutan el proceso, la curiosidad florece espontáneamente.',
    },
    {
      titleEn: 'Discovery (Descubrimiento)',
      titleEs: 'Descubrimiento (Discovery)',
      color: 'bg-[#A8E6CF]/40 text-[#2D6A4F]',
      descEn: 'Hands-on tactile materials, nature investigation in our yard, and open-ended questions empower young minds.',
      descEs: 'Materiales táctiles, investigación de la naturaleza en nuestro jardín y preguntas abiertas que empoderan.',
    },
    {
      titleEn: 'Learning (Aprendizaje)',
      titleEs: 'Aprendizaje (Learning)',
      color: 'bg-[#FF6B6B]/20 text-[#FF6B6B]',
      descEn: 'Intentional cognitive stepping stones: language, early numeracy, social empathy, and school readiness routines.',
      descEs: 'Pasos cognitivos intencionales: lenguaje, primeros números, empatía social y hábitos para la escuela.',
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white/70 border-y border-[#1A237E]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#E07A5F] uppercase font-mono">
            {language === 'en' ? 'Meet Your Child’s Educator' : 'Conozca a la Educadora'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-4">
            {language === 'en' ? 'Amelia M Vargas' : 'Amelia M Vargas'}
          </h2>
          <p className="text-base text-[#1A237E]/75 leading-relaxed">
            {language === 'en'
              ? 'A loving Boston educator dedicated to nurturing infants, toddlers, and preschoolers in a warm, family-centered environment at 136 Mount Hope Street.'
              : 'Una educadora apasionada de Boston dedicada a brindar amor, seguridad y estimulación a bebés y niños en un ambiente familiar en 136 Mount Hope Street.'}
          </p>
        </div>

        {/* Featured Quote Callout */}
        <div className="mb-14 p-6 sm:p-8 md:p-10 bg-[#FFF8E7] rounded-3xl border border-[#1A237E]/10 shadow-xs relative">
          <div className="text-4xl text-[#FF6B6B] font-serif leading-none absolute -top-4 left-8 bg-[#FFF8E7] px-2 select-none">
            “
          </div>
          <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-[#1A237E] italic leading-relaxed text-center max-w-4xl mx-auto pt-2">
            {language === 'en'
              ? '“With my professional experience and certifications in First Aid, CPR, teaching, and Early Childhood Education, I’m highly accomplished in teaching both educational and intentional play activities.”'
              : '“Con mi experiencia profesional y certificaciones en Primeros Auxilios, RCP, docencia y Educación Temprana, estoy altamente capacitada para guiar actividades educativas y de juego intencional llenas de cariño.”'}
          </blockquote>
          <div className="text-center mt-4">
            <span className="font-display font-bold text-sm text-[#1A237E]">— Amelia M Vargas</span>
            <span className="text-xs text-[#1A237E]/70 ml-2">({DAYCARE_INFO.licenseState} #{DAYCARE_INFO.licenseNumber})</span>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Portrait & Verification Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Outer decorative card */}
              <div className="polaroid-frame bg-white shadow-xl rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src={ameliaPortrait}
                  alt="Amelia M Vargas - Licensed Childcare Director in Roslindale, Boston"
                  className="w-full h-80 sm:h-96 object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="pt-4 text-center">
                  <div className="font-display font-bold text-base text-[#1A237E]">Amelia M Vargas</div>
                  <div className="text-xs text-[#1A237E]/70 mt-0.5">
                    {language === 'en' ? 'Licensed Provider & Early Childhood Director' : 'Directora y Proveedora de Cuidado Infantil Licenciada'}
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-white border border-[#1A237E]/10 rounded-2xl p-3 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A8E6CF]/30 flex items-center justify-center text-[#2D6A4F]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A237E]">
                    {language === 'en' ? 'Commonwealth of MA' : 'Estado de Massachusetts'}
                  </div>
                  <div className="text-[11px] text-[#2D6A4F] font-semibold">
                    {language === 'en' ? 'Active Verified License' : 'Licencia Activa Verificada'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Credentials & 3 Pillars */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Biography Text */}
            <div className="space-y-4 text-base text-[#1A237E]/85 leading-relaxed">
              <p>
                {language === 'en'
                  ? 'Welcome to Juegos Y Sonrisas! I founded this daycare with a clear conviction: children learn best when they feel deeply secure, emotionally seen, and inspired by joyful curiosity. My home preschool at 136 Mount Hope Street was thoughtfully planned from the ground up to offer the intimacy and warmth of a family home paired with the educational rigor of a top-tier Montessori classroom.'
                  : '¡Bienvenidos a Juegos Y Sonrisas! Fundé este hogar educativo con una convicción clara: los niños aprenden mejor cuando se sienten seguros, amados y motivados por una curiosidad alegre. Nuestro centro en 136 Mount Hope Street combina la calidez y el cariño de un hogar familiar con la estructura y excelencia de un preescolar Montessori de primer nivel.'}
              </p>
              <p>
                {language === 'en'
                  ? 'As a Latina educator serving Boston families, I cherish giving our children the gift of bilingualism. Through conversational storytelling, sensory art, and everyday interactions in both English and Spanish, our children build neural agility that benefits them for life.'
                  : 'Como educadora hispanohablante al servicio de las familias de Boston, amo brindar a los niños el valioso regalo del bilingüismo. A través de cuentos, arte sensorial e intercambios diarios en inglés y español, fomentamos una flexibilidad mental que los acompañará por siempre.'}
              </p>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {credentials.map((cred, idx) => {
                const IconComponent = cred.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FFF8E7] rounded-2xl border border-[#1A237E]/10 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-white shadow-2xs text-[#1A237E] shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4 text-[#FF6B6B]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A237E]">
                        {language === 'en' ? cred.titleEn : cred.titleEs}
                      </div>
                      <div className="text-[11px] text-[#1A237E]/70 mt-0.5">
                        {language === 'en' ? cred.detailEn : cred.detailEs}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Philosophy 3 Pillars: Fun, Discovery, Learning */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                {language === 'en' ? 'Our Educational Pillars' : 'Nuestros Pilares Educativos'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pillars.map((pillar, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white border border-[#1A237E]/10 shadow-xs space-y-1.5"
                  >
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${pillar.color}`}>
                      {language === 'en' ? pillar.titleEn : pillar.titleEs}
                    </span>
                    <p className="text-xs text-[#1A237E]/80 leading-snug">
                      {language === 'en' ? pillar.descEn : pillar.descEs}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

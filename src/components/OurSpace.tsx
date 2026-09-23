import React, { useState } from 'react';
import { Car, Trees, Palette, BookOpen, MapPin, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { Language, Hotspot } from '../types';
import { SPACE_HOTSPOTS } from '../data/translations';
import heroClassroom from '../assets/images/hero_montessori_classroom_1790135121726.jpg';
import backyardPlay from '../assets/images/daycare_backyard_play_1790135141749.jpg';
import readingNook from '../assets/images/reading_nook_cozy_1790135186078.jpg';
import kidsArt from '../assets/images/kids_art_sensory_station_1790135171821.jpg';

interface OurSpaceProps {
  language: Language;
}

export const OurSpace: React.FC<OurSpaceProps> = ({ language }) => {
  const [activeHotspotId, setActiveHotspotId] = useState<string>('driveway');
  const [activeTab, setActiveTab] = useState<'classroom' | 'backyard' | 'reading' | 'art'>('classroom');

  const activeHotspot = SPACE_HOTSPOTS.find((h) => h.id === activeHotspotId) || SPACE_HOTSPOTS[0];

  const features = [
    {
      icon: Car,
      titleEn: 'Dedicated Off-Street Driveway',
      titleEs: 'Entrada y Estacionamiento Privado',
      descEn: 'Private off-street driveway parking right in front of the door. Zero double parking hassles on busy Boston mornings.',
      descEs: 'Estacionamiento privado frente a la entrada. Olvídese de estacionar en doble fila en las mañanas apresuradas.',
    },
    {
      icon: Trees,
      titleEn: 'Secure Fenced Green Backyard',
      titleEs: 'Patio Verde Completamente Cercado',
      descEn: 'Direct access to our safe, private outdoor sanctuary with wooden climbing structures, sand/water tables, and garden flowers.',
      descEs: 'Acceso directo a patio cerrado con estructuras de madera, mesas sensoriales y plantas aptas para niños.',
    },
    {
      icon: Palette,
      titleEn: 'Montessori Art & Clay Atelier',
      titleEs: 'Atelier de Arte y Arcilla Montessori',
      descEn: 'Low shelves stocked with non-toxic gouache, natural beeswax crayons, sensory bins, and process-art supplies.',
      descEs: 'Estanterías bajas con témperas no tóxicas, crayones de cera, bandejas sensoriales y materiales de proceso artístico.',
    },
    {
      icon: BookOpen,
      titleEn: 'Cozy Bilingual Reading Nook',
      titleEs: 'Rincón de Lectura Bilingüe Acogedor',
      descEn: 'Plush cushions, warm natural light, and forward-facing display of culturally rich books in English and Spanish.',
      descEs: 'Cojines confortables, iluminación cálida y estanterías con literatura infantil diversa en inglés y español.',
    },
    {
      icon: MapPin,
      titleEn: 'Quiet Roslindale Residential Setting',
      titleEs: 'Tranquilo Entorno Residencial',
      descEn: 'Located at 136 Mount Hope St. Steps from Healey Field, Charles Sumner Elementary, and quiet neighborhood streets.',
      descEs: 'Situado en 136 Mount Hope St. A pasos del parque Healey Field y la escuela Charles Sumner en un vecindario pacífico.',
    },
  ];

  return (
    <section id="our-space" className="py-16 md:py-24 bg-[#FFF8E7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#2D6A4F] uppercase font-mono">
            {language === 'en' ? 'Environment As The Third Teacher' : 'El Entorno como Tercer Maestro'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-4">
            {language === 'en' ? 'Our Loving Space at 136 Mount Hope' : 'Nuestro Espacio en 136 Mount Hope'}
          </h2>
          <p className="text-base text-[#1A237E]/75 leading-relaxed">
            {language === 'en'
              ? 'Thoughtfully arranged with natural woods, open daylight, child-height furnishings, and off-street parking designed for peaceful learning.'
              : 'Diseñado meticulosamente con maderas naturales, luz natural, mobiliario a la altura del niño y estacionamiento privado para un día sin estrés.'}
          </p>
        </div>

        {/* Interactive Hotspot Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left: Interactive Image with clickable Hotspots */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 group">
            
            {/* View Selector Tabs */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('classroom')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'classroom' ? 'bg-[#FFD60A] text-[#1A237E]' : 'text-white/80 hover:text-white'
                }`}
              >
                {language === 'en' ? 'Classroom' : 'Aula'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('backyard')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'backyard' ? 'bg-[#FFD60A] text-[#1A237E]' : 'text-white/80 hover:text-white'
                }`}
              >
                {language === 'en' ? 'Backyard' : 'Jardín'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reading')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'reading' ? 'bg-[#FFD60A] text-[#1A237E]' : 'text-white/80 hover:text-white'
                }`}
              >
                {language === 'en' ? 'Reading Nook' : 'Rincón de Cuentos'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('art')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'art' ? 'bg-[#FFD60A] text-[#1A237E]' : 'text-white/80 hover:text-white'
                }`}
              >
                {language === 'en' ? 'Art Atelier' : 'Arte'}
              </button>
            </div>

            {/* Displayed Image based on tab */}
            <div className="relative aspect-video sm:aspect-16/10 w-full overflow-hidden">
              <img
                src={
                  activeTab === 'classroom'
                    ? heroClassroom
                    : activeTab === 'backyard'
                    ? backyardPlay
                    : activeTab === 'reading'
                    ? readingNook
                    : kidsArt
                }
                alt="Juegos Y Sonrisas Daycare space view"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Dark subtle gradient scrim for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Hotspot Pins (Interactive overlay) */}
              {SPACE_HOTSPOTS.map((hotspot) => {
                const isSelected = activeHotspotId === hotspot.id;
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => setActiveHotspotId(hotspot.id)}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin transition-transform focus:outline-none`}
                    aria-label={`Hotspot: ${hotspot.title}`}
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isSelected ? 'bg-[#FFD60A]' : 'bg-white'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center text-xs font-bold shadow-md transition-all ${
                          isSelected
                            ? 'bg-[#FFD60A] text-[#1A237E] scale-125 border-2 border-[#1A237E]'
                            : 'bg-white text-[#1A237E] hover:scale-110'
                        }`}
                      >
                        +
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom banner for active tab */}
            <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-white text-xs">
              <span className="bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full">
                {language === 'en' ? '📍 Click pulse points to discover features' : '📍 Toque los puntos interactivos'}
              </span>
              <span className="bg-[#2D6A4F] px-3 py-1 rounded-full font-bold">
                {language === 'en' ? '136 Mount Hope St' : 'Roslindale, MA'}
              </span>
            </div>

          </div>

          {/* Right: Active Hotspot Card Details */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#1A237E]/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-[#A8E6CF]/40 text-[#2D6A4F] text-xs font-bold rounded-full">
                {language === 'en' ? activeHotspot.tag : activeHotspot.tagEs}
              </span>
              <span className="text-xs font-mono text-[#1A237E]/50">
                Feature {SPACE_HOTSPOTS.findIndex((h) => h.id === activeHotspotId) + 1} of {SPACE_HOTSPOTS.length}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#1A237E]">
              {language === 'en' ? activeHotspot.title : activeHotspot.titleEs}
            </h3>

            <p className="text-sm text-[#1A237E]/80 leading-relaxed">
              {language === 'en' ? activeHotspot.description : activeHotspot.descriptionEs}
            </p>

            <div className="pt-2 border-t border-[#1A237E]/10">
              <div className="text-xs font-bold text-[#1A237E] mb-2 uppercase tracking-wider font-mono">
                {language === 'en' ? 'Quick Jump' : 'Explorar Puntos'}:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SPACE_HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveHotspotId(h.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                      activeHotspotId === h.id
                        ? 'bg-[#1A237E] text-white font-bold'
                        : 'bg-[#FFF8E7] text-[#1A237E] hover:bg-[#1A237E]/10'
                    }`}
                  >
                    {language === 'en' ? h.tag : h.tagEs}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#FFF8E7] rounded-xl text-xs text-[#1A237E]/85 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#FF6B6B] shrink-0 mt-0.5" />
              <span>
                {language === 'en'
                  ? 'All indoor spaces are vacuumed with HEPA filters daily, shoe-free, and sanitized with child-safe botanicals.'
                  : 'Todos los espacios interiores se limpian a diario con filtros HEPA, sin calzado de calle y desinfectantes naturales.'}
              </span>
            </div>
          </div>

        </div>

        {/* Feature List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-5 bg-white rounded-2xl border border-[#1A237E]/10 shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-xl bg-[#FFF8E7] text-[#FF6B6B] shrink-0 border border-[#FF6B6B]/20">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-[#1A237E]">
                    {language === 'en' ? feat.titleEn : feat.titleEs}
                  </h4>
                  <p className="text-xs text-[#1A237E]/75 mt-1 leading-relaxed">
                    {language === 'en' ? feat.descEn : feat.descEs}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

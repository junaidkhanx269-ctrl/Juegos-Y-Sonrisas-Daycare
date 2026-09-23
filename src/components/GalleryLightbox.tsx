import React, { useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Language } from '../types';

import heroClassroom from '../assets/images/hero_montessori_classroom_1790135121726.jpg';
import backyardPlay from '../assets/images/daycare_backyard_play_1790135141749.jpg';
import readingNook from '../assets/images/reading_nook_cozy_1790135186078.jpg';
import kidsArt from '../assets/images/kids_art_sensory_station_1790135171821.jpg';
import ameliaPortrait from '../assets/images/amelia_educator_portrait_1790135158738.jpg';

interface GalleryLightboxProps {
  language: Language;
}

interface GalleryItem {
  id: string;
  category: 'classroom' | 'backyard' | 'art' | 'reading';
  src: string;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  tagEn: string;
  tagEs: string;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ language }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      category: 'classroom',
      src: heroClassroom,
      titleEn: 'Montessori Sunlit Classroom & Low Shelves',
      titleEs: 'Aula Montessori Iluminada y Estantes Bajos',
      descEn: 'Natural honey wood tables, accessible wooden puzzles, and floor rugs creating independent learning zones.',
      descEs: 'Mesitas de madera natural, rompecabezas accesibles y alfombras para zonas de aprendizaje independiente.',
      tagEn: 'Classroom',
      tagEs: 'Aula',
    },
    {
      id: '2',
      category: 'backyard',
      src: backyardPlay,
      titleEn: 'Enclosed Safe Backyard & Nature Play Area',
      titleEs: 'Jardín Protegido y Juegos en la Naturaleza',
      descEn: 'Lush grass, toddler climbing structure, herb garden boxes, and sensory tables for outdoor development.',
      descEs: 'Césped fresco, estructura de trepa para niños pequeños, huerto de hierbas y mesas sensoriales.',
      tagEn: 'Backyard',
      tagEs: 'Jardín',
    },
    {
      id: '3',
      category: 'art',
      src: kidsArt,
      titleEn: 'Sensory Atelier & Child-Safe Watercolor Trays',
      titleEs: 'Atelier Sensorial y Acuarelas No Tóxicas',
      descEn: 'Tactile non-toxic paints, beeswax crayons, modeling clay, and eco-friendly collage materials.',
      descEs: 'Pinturas al agua no tóxicas, ceras de abejas, plastilina natural y materiales de modelado.',
      tagEn: 'Art & Sensory',
      tagEs: 'Arte y Sensorial',
    },
    {
      id: '4',
      category: 'reading',
      src: readingNook,
      titleEn: 'Cozy Bilingual Story & Nap Nook',
      titleEs: 'Rincón Acogedor de Cuentos Bilingües y Descanso',
      descEn: 'Plush cushions and forward-facing book displays celebrating diverse dual-language literature.',
      descEs: 'Cojines confortables y estantes frontales con literatura infantil diversa en inglés y español.',
      tagEn: 'Reading',
      tagEs: 'Lectura',
    },
    {
      id: '5',
      category: 'classroom',
      src: ameliaPortrait,
      titleEn: 'Loving, Certified Guidance with Amelia',
      titleEs: 'Acompañamiento Amoroso y Certificado con Amelia',
      descEn: 'Over a decade of early education experience, pediatric CPR certified, providing maternal warmth daily.',
      descEs: 'Más de una década de experiencia en educación temprana y calidez maternal diaria en Roslindale.',
      tagEn: 'Educator',
      tagEs: 'Educadora',
    },
  ];

  const filteredItems =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => {
    setSelectedImageIdx(index);
  };

  const closeLightbox = () => {
    setSelectedImageIdx(null);
  };

  const nextImage = () => {
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#E07A5F] uppercase font-mono">
            {language === 'en' ? 'A Glimpse Inside' : 'Un Vistazo a Nuestro Mundo'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-4">
            {language === 'en' ? 'Our Learning Sanctuary' : 'Nuestro Refugio de Aprendizaje'}
          </h2>
          <p className="text-base text-[#1A237E]/75 leading-relaxed">
            {language === 'en'
              ? 'Explore our sunlit indoor classrooms, cozy reading nooks, and private green yard at 136 Mount Hope St, Roslindale.'
              : 'Explore nuestras aulas luminosas, acogedores rincones de lectura y amplio jardín en 136 Mount Hope St, Roslindale.'}
          </p>
        </div>

        {/* Filter Controls (Segmented Tabs) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', labelEn: 'All Spaces', labelEs: 'Todos' },
            { id: 'classroom', labelEn: 'Classroom', labelEs: 'Aula' },
            { id: 'backyard', labelEn: 'Backyard', labelEs: 'Jardín' },
            { id: 'art', labelEn: 'Art & Sensory', labelEs: 'Arte' },
            { id: 'reading', labelEn: 'Reading Nook', labelEs: 'Lectura' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#1A237E] text-white shadow-sm'
                  : 'bg-[#FFF8E7] text-[#1A237E] hover:bg-[#FFD60A]'
              }`}
            >
              {language === 'en' ? tab.labelEn : tab.labelEs}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-3xl overflow-hidden bg-white border border-[#1A237E]/10 shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-[#FFF8E7]">
                <img
                  src={item.src}
                  alt={language === 'en' ? item.titleEn : item.titleEs}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-[#1A237E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/95 text-[#1A237E] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <ZoomIn className="w-4 h-4 text-[#FF6B6B]" />
                  <span>{language === 'en' ? 'View Photo' : 'Ver Foto'}</span>
                </span>
              </div>

              {/* Bottom Card Meta */}
              <div className="p-4 bg-white">
                <span className="text-[11px] font-bold text-[#2D6A4F] uppercase tracking-wider font-mono">
                  {language === 'en' ? item.tagEn : item.tagEs}
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base text-[#1A237E] mt-0.5 line-clamp-1">
                  {language === 'en' ? item.titleEn : item.titleEs}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImageIdx !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation arrows */}
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#1A237E] p-2.5 rounded-full shadow-lg transition-transform hover:scale-110"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#1A237E] p-2.5 rounded-full shadow-lg transition-transform hover:scale-110"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Modal Image */}
              <div className="aspect-16/10 w-full bg-black flex items-center justify-center">
                <img
                  src={filteredItems[selectedImageIdx].src}
                  alt={language === 'en' ? filteredItems[selectedImageIdx].titleEn : filteredItems[selectedImageIdx].titleEs}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              </div>

              {/* Modal Caption */}
              <div className="p-6 bg-white space-y-1">
                <div className="flex items-center justify-between text-xs text-[#1A237E]/60 font-mono">
                  <span>
                    {language === 'en'
                      ? filteredItems[selectedImageIdx].tagEn
                      : filteredItems[selectedImageIdx].tagEs}
                  </span>
                  <span>
                    {selectedImageIdx + 1} / {filteredItems.length}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#1A237E]">
                  {language === 'en'
                    ? filteredItems[selectedImageIdx].titleEn
                    : filteredItems[selectedImageIdx].titleEs}
                </h3>
                <p className="text-xs sm:text-sm text-[#1A237E]/80">
                  {language === 'en'
                    ? filteredItems[selectedImageIdx].descEn
                    : filteredItems[selectedImageIdx].descEs}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

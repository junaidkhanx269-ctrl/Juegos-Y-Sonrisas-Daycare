import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Car,
  Navigation,
  ExternalLink,
  MessageCircle,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { DAYCARE_INFO } from '../data/translations';

interface LocationContactProps {
  language: Language;
  onOpenTourModal: () => void;
}

export const LocationContact: React.FC<LocationContactProps> = ({
  language,
  onOpenTourModal,
}) => {
  const [isOpenNow, setIsOpenNow] = useState<boolean>(false);

  useEffect(() => {
    // Check if currently within Monday-Friday 8:00 AM - 5:00 PM Boston Time (ET)
    const checkOpenStatus = () => {
      try {
        const now = new Date();
        // Convert to Boston time
        const bostonTimeString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
        const bostonDate = new Date(bostonTimeString);
        const day = bostonDate.getDay(); // 0 is Sun, 6 is Sat
        const hour = bostonDate.getHours();
        const minute = bostonDate.getMinutes();
        const timeInMinutes = hour * 60 + minute;

        // Mon-Fri: 8:00 AM (480) to 5:00 PM (1020)
        const isWeekday = day >= 1 && day <= 5;
        const isDuringHours = timeInMinutes >= 480 && timeInMinutes < 1020;

        setIsOpenNow(isWeekday && isDuringHours);
      } catch (e) {
        setIsOpenNow(false);
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="location" className="py-16 md:py-24 bg-[#FFF8E7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#E07A5F] uppercase font-mono">
            {language === 'en' ? 'Visit Our Neighborhood' : 'En el Corazón de Roslindale'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-4">
            {language === 'en' ? 'Location & Directions' : 'Ubicación y Contacto'}
          </h2>
          <p className="text-base text-[#1A237E]/75 leading-relaxed">
            {language === 'en'
              ? 'Conveniently located at 136 Mount Hope Street in quiet residential Roslindale with private driveway parking.'
              : 'Convenientemente ubicado en 136 Mount Hope Street, en una tranquila calle residencial de Roslindale con estacionamiento privado.'}
          </p>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Map & Neighborhood Details (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#1A237E]/10 shadow-sm flex flex-col justify-between space-y-6">
            
            {/* Interactive Google Map Embed */}
            <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#1A237E]/10 bg-slate-100 shadow-inner">
              <iframe
                title="Juegos Y Sonrisas Daycare Map Location"
                src="https://maps.google.com/maps?q=136%20Mount%20Hope%20Street,%20Roslindale,%20MA%2002131&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-xs text-xs font-bold text-[#1A237E] flex items-center gap-1.5 border border-[#1A237E]/10">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span>136 Mount Hope St, Roslindale, MA 02131</span>
              </div>
            </div>

            {/* Neighborhood Highlights */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-[#1A237E]">
                {language === 'en' ? 'Neighborhood & Parking Features' : 'Ventajas del Barrio y Estacionamiento'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#1A237E]/80">
                <div className="p-3 bg-[#FFF8E7] rounded-xl flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1A237E]">
                      {language === 'en' ? 'Private Driveway' : 'Entrada Privada'}
                    </strong>
                    <span>
                      {language === 'en'
                        ? 'Pull right in for safe curbside child handoff'
                        : 'Estacione frente a la puerta sin peligro de tráfico'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF8E7] rounded-xl flex items-start gap-2.5">
                  <Navigation className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1A237E]">
                      {language === 'en' ? 'Family Community' : 'Comunidad Familiar'}
                    </strong>
                    <span>
                      {language === 'en'
                        ? 'Near Healey Playground & Charles Sumner School'
                        : 'A minutos del parque Healey y la escuela Charles Sumner'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={DAYCARE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1A237E] hover:bg-[#283593] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all"
                >
                  <Navigation className="w-4 h-4 text-[#FFD60A]" />
                  <span>{language === 'en' ? 'Open in Google Maps' : 'Abrir en Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>

          </div>

          {/* Right: Contact Card & Live Hours (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#1A237E]/10 shadow-sm flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Card Header with Live Status */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1A237E]/10">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#1A237E]">
                    {language === 'en' ? 'Direct Contact' : 'Contacto Directo'}
                  </h3>
                  <div className="text-xs text-[#1A237E]/70 mt-0.5">
                    {language === 'en' ? 'Amelia M Vargas · Director' : 'Amelia M Vargas · Directora'}
                  </div>
                </div>

                {/* Live Open/Closed Status Indicator */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isOpenNow
                      ? 'bg-[#A8E6CF]/40 text-[#2D6A4F] border border-[#2D6A4F]/20'
                      : 'bg-[#FFF8E7] text-[#1A237E]/80 border border-[#1A237E]/15'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOpenNow ? 'bg-[#2D6A4F] animate-pulse' : 'bg-[#E07A5F]'
                    }`}
                  />
                  <span>
                    {isOpenNow
                      ? language === 'en'
                        ? 'Open Now'
                        : 'Abierto Ahora'
                      : language === 'en'
                        ? 'Closed (Opens 8 AM)'
                        : 'Cerrado (Abre 8 AM)'}
                  </span>
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="space-y-4">
                
                {/* Phone */}
                <a
                  href={`tel:${DAYCARE_INFO.phoneRaw}`}
                  className="p-3.5 rounded-2xl bg-[#FFF8E7] hover:bg-[#FFD60A]/30 transition-colors flex items-center gap-3.5 group border border-[#1A237E]/5"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-[#FF6B6B] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#1A237E]/70 font-mono font-bold uppercase">
                      {language === 'en' ? 'Call or Text Directly' : 'Llamada o Mensaje de Texto'}
                    </div>
                    <div className="text-base font-bold text-[#1A237E] tabular-nums">
                      {DAYCARE_INFO.phone}
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={DAYCARE_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors flex items-center gap-3.5 group border border-[#25D366]/20"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#2D6A4F] font-mono font-bold uppercase">
                      {language === 'en' ? 'Instant WhatsApp Chat' : 'Chat Inmediato por WhatsApp'}
                    </div>
                    <div className="text-sm font-bold text-[#1A237E]">
                      {language === 'en' ? 'Message Amelia on WhatsApp' : 'Escribir a Amelia por WhatsApp'}
                    </div>
                  </div>
                </a>

                {/* Email */}
                <div className="p-3.5 rounded-2xl bg-[#FFF8E7] flex items-center gap-3.5 border border-[#1A237E]/5">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#1A237E] flex items-center justify-center shadow-2xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#1A237E]/70 font-mono font-bold uppercase">
                      {language === 'en' ? 'Official Inquiries' : 'Consultas por Correo'}
                    </div>
                    <div className="text-sm font-bold text-[#1A237E]">
                      {DAYCARE_INFO.email}
                    </div>
                  </div>
                </div>

              </div>

              {/* Operating Hours Table */}
              <div className="p-4 bg-[#FFF8E7]/60 rounded-2xl border border-[#1A237E]/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>{language === 'en' ? 'Hours of Care' : 'Horarios de Atención'}</span>
                </div>
                <div className="space-y-1 text-xs text-[#1A237E]/80">
                  <div className="flex justify-between py-0.5">
                    <span>{language === 'en' ? 'Monday – Friday' : 'Lunes a Viernes'}:</span>
                    <span className="font-bold text-[#1A237E]">8:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-[#1A237E]/60">
                    <span>{language === 'en' ? 'Extended Care (Optional)' : 'Horario Extendido'}:</span>
                    <span>7:30 AM or until 5:30 PM</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-[#1A237E]/50">
                    <span>{language === 'en' ? 'Saturday – Sunday' : 'Sábado y Domingo'}:</span>
                    <span>{language === 'en' ? 'Closed (Family Time)' : 'Cerrado'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Schedule Tour Big Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenTourModal}
                className="w-full py-3.5 px-4 bg-[#FFD60A] hover:bg-[#ffd000] text-[#1A237E] font-bold text-sm rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#1A237E]" />
                <span>{language === 'en' ? 'Book In-Person Tour' : 'Agendar Visita en Persona'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

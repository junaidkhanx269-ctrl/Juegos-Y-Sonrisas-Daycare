import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Phone, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { DAYCARE_INFO } from '../data/translations';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TourModal: React.FC<TourModalProps> = ({ isOpen, onClose, language }) => {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [childAge, setChildAge] = useState('');
  const [tourType, setTourType] = useState<'in-person' | 'virtual'>('in-person');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('9:30 AM');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const timeSlots = [
    '9:00 AM',
    '9:30 AM',
    '10:15 AM',
    '1:30 PM (Nap/Quiet Observation)',
    '4:00 PM',
    '5:15 PM (After Hours)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !phone || !selectedDate) {
      setError(
        language === 'en'
          ? 'Please fill in your name, phone number, and preferred date.'
          : 'Por favor complete su nombre, teléfono y fecha preferida.'
      );
      return;
    }

    setError('');
    setSubmitted(true);

    // Call backend API to send confirmation email to parent and notification to admin
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'tour',
        parentName,
        parentEmail: email,
        phone,
        childAge,
        selectedDate,
        selectedTime,
        tourType,
      }),
    }).catch((err) => console.warn('Tour email notification notice:', err));

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#FFD60A', '#FF6B6B', '#A8E6CF', '#1A237E'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setParentName('');
    setPhone('');
    setEmail('');
    setSelectedDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-[#1A237E]/10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FFF8E7] hover:bg-[#FFD60A] text-[#1A237E] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-[#A8E6CF]/40 text-[#2D6A4F] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-2xl text-[#1A237E]">
                {language === 'en' ? 'Tour Request Confirmed!' : '¡Visita Solicitada con Éxito!'}
              </h3>
              <p className="text-sm text-[#1A237E]/80 max-w-sm mx-auto">
                {language === 'en'
                  ? `Thank you, ${parentName}. Amelia will confirm your visit on ${selectedDate} at ${selectedTime}.`
                  : `Gracias, ${parentName}. Amelia confirmará su visita el ${selectedDate} a las ${selectedTime}.`}
              </p>
            </div>

            <div className="p-4 bg-[#FFF8E7] rounded-2xl text-xs text-[#1A237E]/85 space-y-2 text-left">
              <div className="flex items-center gap-2 font-bold text-[#1A237E]">
                <MapPin className="w-4 h-4 text-[#FF6B6B]" />
                <span>48 Hazelton St, Mattapan, MA 02126</span>
              </div>
              <p className="text-[11px] text-[#1A237E]/70 pl-6">
                {language === 'en'
                  ? 'Feel free to park directly in the private driveway when you arrive.'
                  : 'Puede estacionar su vehículo directamente en la entrada privada al llegar.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={DAYCARE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grow inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-bold py-3 px-4 rounded-xl"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Confirmation</span>
              </a>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="grow bg-[#1A237E] text-white text-xs font-bold py-3 px-4 rounded-xl"
              >
                {language === 'en' ? 'Done' : 'Listo'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#E07A5F] uppercase font-mono">
                {language === 'en' ? 'Personal Visit' : 'Visita Personal'}
              </span>
              <h3 className="font-display font-bold text-2xl text-[#1A237E]">
                {language === 'en' ? 'Schedule a Tour with Amelia' : 'Agendar una Visita con Amelia'}
              </h3>
              <p className="text-xs text-[#1A237E]/70 mt-1">
                {language === 'en'
                  ? 'Experience our Montessori spaces and meet Amelia in person at 48 Hazelton St.'
                  : 'Conozca nuestras instalaciones Montessori y converse con Amelia en 48 Hazelton St.'}
              </p>
            </div>

            {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}

            {/* Tour Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#FFF8E7] rounded-xl text-xs font-bold text-[#1A237E]">
              <button
                type="button"
                onClick={() => setTourType('in-person')}
                className={`py-2 rounded-lg transition-all ${
                  tourType === 'in-person' ? 'bg-[#1A237E] text-white shadow-xs' : 'text-[#1A237E]/70'
                }`}
              >
                {language === 'en' ? 'In-Person Tour' : 'Visita en Persona'}
              </button>
              <button
                type="button"
                onClick={() => setTourType('virtual')}
                className={`py-2 rounded-lg transition-all ${
                  tourType === 'virtual' ? 'bg-[#1A237E] text-white shadow-xs' : 'text-[#1A237E]/70'
                }`}
              >
                {language === 'en' ? 'Virtual Video Tour' : 'Videollamada'}
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A237E] uppercase font-mono mb-1">
                    {language === 'en' ? 'Your Name *' : 'Su Nombre *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Elena Thorne"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-xs sm:text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A237E] uppercase font-mono mb-1">
                    {language === 'en' ? 'Email Address *' : 'Correo Electrónico *'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-xs sm:text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A237E] uppercase font-mono mb-1">
                    {language === 'en' ? 'Phone Number *' : 'Teléfono *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(857) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-xs sm:text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A237E] uppercase font-mono mb-1">
                    {language === 'en' ? 'Child’s Age / Due Date' : 'Edad del Niño / Fecha'}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'e.g. 18 months' : 'ej. 18 meses'}
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-xs sm:text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A237E] uppercase font-mono mb-1">
                    {language === 'en' ? 'Preferred Date *' : 'Fecha Preferida *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-xs sm:text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A237E] uppercase font-mono mb-1">
                    {language === 'en' ? 'Preferred Time' : 'Hora de Preferencia'}
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-xs sm:text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#1A237E] hover:bg-[#283593] text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#FFD60A]" />
                <span>{language === 'en' ? 'Confirm Tour Appointment' : 'Confirmar Cita para Visita'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

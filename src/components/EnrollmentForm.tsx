import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Send,
  CheckCircle,
  Phone,
  MessageSquare,
  Calendar,
  Sparkles,
  Shield,
  HelpCircle,
  X,
  Mail,
} from 'lucide-react';
import { Language, EnrollmentFormData } from '../types';
import { DAYCARE_INFO, PROGRAMS } from '../data/translations';

interface EnrollmentFormProps {
  language: Language;
  preselectedProgramId?: string;
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  language,
  preselectedProgramId,
}) => {
  const [formData, setFormData] = useState<EnrollmentFormData>({
    childName: '',
    childDob: '',
    program: preselectedProgramId || 'preschool-ready',
    parentName: '',
    phone: '',
    email: '',
    startDate: '',
    languagePreference: 'bilingual',
    needsSubsidy: false,
    needsExtendedCare: false,
    message: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedProgramId) {
      setFormData((prev) => ({ ...prev, program: preselectedProgramId }));
    }
  }, [preselectedProgramId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.childName.trim()) {
      newErrors.childName = language === 'en' ? "Please enter your child's name" : 'Por favor ingrese el nombre del niño';
    }

    if (!formData.parentName.trim()) {
      newErrors.parentName = language === 'en' ? 'Please enter parent/guardian name' : 'Por favor ingrese el nombre del padre o tutor';
    }

    // Phone validation
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      newErrors.phone = language === 'en' ? 'Please enter a valid 10-digit phone number' : 'Ingrese un teléfono válido de 10 dígitos';
    }

    // Email validation
    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = language === 'en' ? 'Please enter a valid email address' : 'Ingrese un correo electrónico válido';
    }

    if (!formData.startDate) {
      newErrors.startDate = language === 'en' ? 'Please select a preferred start date' : 'Seleccione una fecha estimada de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam honeypot
    if (honeypot) {
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Call backend API to send confirmation email to parent and notification to admin
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'enrollment',
        parentName: formData.parentName,
        parentEmail: formData.email,
        phone: formData.phone,
        childName: formData.childName,
        childAge: formData.childDob,
        program: formData.program,
        startDate: formData.startDate,
        needsSubsidy: formData.needsSubsidy,
        needsExtendedCare: formData.needsExtendedCare,
        message: formData.message,
      }),
    }).catch((err) => console.warn('Enrollment email notification notice:', err));

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setShowToast(true);

      // Hide toast automatically after 6 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 6000);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD60A', '#FF6B6B', '#A8E6CF', '#1A237E', '#E07A5F'],
        });
      } catch (err) {
        // graceful fallback if canvas-confetti is not loaded
      }
    }, 600);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      childName: '',
      childDob: '',
      program: 'preschool-ready',
      parentName: '',
      phone: '',
      email: '',
      startDate: '',
      languagePreference: 'bilingual',
      needsSubsidy: false,
      needsExtendedCare: false,
      message: '',
    });
  };

  return (
    <section id="enrollment" className="py-16 md:py-24 bg-[#FFF8E7] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#2D6A4F] uppercase font-mono">
            {language === 'en' ? 'Limited Spots Available' : 'Cupos Limitados Disponibles'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#1A237E] mt-2 mb-4">
            {language === 'en' ? "Start Your Child's Journey" : 'Comience el Viaje de su Hijo'}
          </h2>
          <p className="text-base text-[#1A237E]/75 leading-relaxed">
            {language === 'en'
              ? 'Request detailed enrollment information, tuition assistance options, or schedule your family’s private tour of 48 Hazelton St.'
              : 'Solicite información detallada de inscripción, opciones de subsidio o agende una visita privada para conocer nuestro espacio en 48 Hazelton St.'}
          </p>
        </div>

        {/* Success Confirmation State */}
        {submitted ? (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#A8E6CF] shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-[#A8E6CF]/30 text-[#2D6A4F] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#1A237E]">
                {language === 'en' ? 'Thank You! We Received Your Request' : '¡Muchas Gracias! Hemos Recibido su Solicitud'}
              </h3>
              <p className="text-sm sm:text-base text-[#1A237E]/80 max-w-lg mx-auto">
                {language === 'en'
                  ? `Amelia will personally review ${formData.childName}’s application and contact you at ${formData.phone} within 24 hours.`
                  : `Amelia revisará personalmente la solicitud de ${formData.childName} y se comunicará con usted al ${formData.phone} en menos de 24 horas.`}
              </p>
            </div>

            {/* Quick Contact buttons to fast-track */}
            <div className="p-4 bg-[#FFF8E7] rounded-2xl max-w-lg mx-auto border border-[#1A237E]/10 space-y-3">
              <div className="text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                {language === 'en' ? 'Want an immediate answer?' : '¿Desea una respuesta inmediata?'}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`tel:${DAYCARE_INFO.phoneRaw}`}
                  className="inline-flex items-center justify-center gap-2 bg-[#1A237E] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#283593] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#FFD60A]" />
                  <span>{language === 'en' ? 'Call Amelia Now' : 'Llamar a Amelia'}</span>
                </a>
                <a
                  href={DAYCARE_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#20ba59] transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[#1A237E]/60 hover:text-[#1A237E] underline"
            >
              {language === 'en' ? 'Submit another inquiry' : 'Enviar otra consulta'}
            </button>
          </div>
        ) : (
          /* Enrollment Form Card */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white p-7 sm:p-10 rounded-3xl border border-[#1A237E]/10 shadow-lg space-y-6"
          >
            {/* Honeypot field (hidden from humans, catches bots) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_bot_trap"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Child's Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                  {language === 'en' ? "Child's Full Name *" : 'Nombre Completo del Niño *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'en' ? 'e.g. Leo Thorne' : 'ej. Leo Martínez'}
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1A237E] placeholder:text-[#1A237E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A237E] ${
                    errors.childName ? 'border-red-500 bg-red-50/50' : 'border-[#1A237E]/20 bg-[#FFF8E7]/30'
                  }`}
                />
                {errors.childName && <p className="text-xs text-red-600">{errors.childName}</p>}
              </div>

              {/* Child's Date of Birth */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                  {language === 'en' ? "Child's Date of Birth or Due Date" : 'Fecha de Nacimiento o Estimada'}
                </label>
                <input
                  type="date"
                  value={formData.childDob}
                  onChange={(e) => setFormData({ ...formData, childDob: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                />
              </div>

              {/* Program Interested Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Program Interested *' : 'Programa de Interés *'}
                </label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                >
                  <option value="infants-toddlers">
                    {language === 'en' ? 'Infants & Toddlers (3mo–2y) · $503/wk' : 'Bebés y Primeros Pasos (3m–2a) · $503/sem'}
                  </option>
                  <option value="preschool-ready">
                    {language === 'en' ? 'Preschool Ready (2y–5y) · $464/wk' : 'Preparatoria Preescolar (2a–5a) · $464/sem'}
                  </option>
                  <option value="school-age">
                    {language === 'en' ? 'School Age Care (5y) · $361/wk' : 'Edad Escolar (5a) · $361/sem'}
                  </option>
                </select>
              </div>

              {/* Parent / Guardian Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Parent / Guardian Name *' : 'Nombre del Padre o Tutor *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'en' ? 'e.g. Elena Thorne' : 'ej. Elena Martínez'}
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1A237E] placeholder:text-[#1A237E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A237E] ${
                    errors.parentName ? 'border-red-500 bg-red-50/50' : 'border-[#1A237E]/20 bg-[#FFF8E7]/30'
                  }`}
                />
                {errors.parentName && <p className="text-xs text-red-600">{errors.parentName}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Phone Number *' : 'Teléfono de Contacto *'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(857) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1A237E] placeholder:text-[#1A237E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A237E] ${
                    errors.phone ? 'border-red-500 bg-red-50/50' : 'border-[#1A237E]/20 bg-[#FFF8E7]/30'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Email Address *' : 'Correo Electrónico *'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1A237E] placeholder:text-[#1A237E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A237E] ${
                    errors.email ? 'border-red-500 bg-red-50/50' : 'border-[#1A237E]/20 bg-[#FFF8E7]/30'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Preferred Start Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Desired Start Date *' : 'Fecha Estimada de Inicio *'}
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E] ${
                    errors.startDate ? 'border-red-500 bg-red-50/50' : 'border-[#1A237E]/20 bg-[#FFF8E7]/30'
                  }`}
                />
                {errors.startDate && <p className="text-xs text-red-600">{errors.startDate}</p>}
              </div>

              {/* Language Preference */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Family Language Preference' : 'Preferencia de Idioma del Hogar'}
                </label>
                <select
                  value={formData.languagePreference}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      languagePreference: e.target.value as 'bilingual' | 'english' | 'spanish',
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-sm text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                >
                  <option value="bilingual">
                    {language === 'en' ? 'Bilingual (English & Spanish)' : 'Bilingüe (Inglés y Español)'}
                  </option>
                  <option value="english">{language === 'en' ? 'English Primary' : 'Principalmente Inglés'}</option>
                  <option value="spanish">{language === 'en' ? 'Spanish Primary' : 'Principalmente Español'}</option>
                </select>
              </div>

            </div>

            {/* Checkboxes: Subsidies & Extended Care */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-[#FFF8E7]/50 border border-[#1A237E]/10 select-none">
                <input
                  type="checkbox"
                  checked={formData.needsSubsidy}
                  onChange={(e) => setFormData({ ...formData, needsSubsidy: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-[#1A237E] focus:ring-[#FFD60A] border-gray-300"
                />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#1A237E]">
                    {language === 'en'
                      ? 'I am applying with or interested in Child Care Subsidies / Vouchers'
                      : 'Cuento con o estoy interesado en Vales o Subsidios Estatales de Cuidado Infantil'}
                  </div>
                  <div className="text-xs text-[#1A237E]/70 mt-0.5">
                    {language === 'en'
                      ? 'We accept Child Care Circuit, ABCD, and MA EEC subsidies. We guide you through paperwork.'
                      : 'Aceptamos subsidios de Child Care Circuit, ABCD y del EEC. Le ayudamos con el proceso.'}
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-[#FFF8E7]/50 border border-[#1A237E]/10 select-none">
                <input
                  type="checkbox"
                  checked={formData.needsExtendedCare}
                  onChange={(e) => setFormData({ ...formData, needsExtendedCare: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-[#1A237E] focus:ring-[#FFD60A] border-gray-300"
                />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#1A237E]">
                    {language === 'en'
                      ? 'I may need Extended Hours Care (+$104/wk for 7:30am drop-off or 5:30pm pick-up)'
                      : 'Podría necesitar Horario Extendido (+$104/sem para entrega 7:30am o recogida 5:30pm)'}
                  </div>
                </div>
              </label>
            </div>

            {/* Message / Questions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
                {language === 'en'
                  ? 'Questions or Special Notes for Amelia (Diet, Allergies, Nap Habits)'
                  : 'Preguntas o Notas Especiales para Amelia (Dietas, Alergias, Hábitos)'}
              </label>
              <textarea
                rows={3}
                placeholder={
                  language === 'en'
                    ? 'Tell us about your child, questions regarding routines, or preferred tour days...'
                    : 'Cuéntenos sobre su niño, dudas sobre rutinas o qué días prefiere para visitar...'
                }
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#1A237E]/20 bg-[#FFF8E7]/30 text-sm text-[#1A237E] placeholder:text-[#1A237E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#1A237E] hover:bg-[#283593] text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block animate-spin mr-2">⌛</span>
                ) : (
                  <Send className="w-5 h-5 text-[#FFD60A]" />
                )}
                <span>
                  {language === 'en' ? 'Request Enrollment Information' : 'Solicitar Información de Inscripción'}
                </span>
              </button>
            </div>

            <div className="text-center text-xs text-[#1A237E]/60 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>
                {language === 'en'
                  ? 'No spam ever. Direct contact with licensed director Amelia M Vargas.'
                  : 'Cero spam. Contacto directo y confidencial con la directora Amelia M Vargas.'}
              </span>
            </div>

          </form>
        )}

      </div>

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border-2 border-[#A8E6CF] p-4 transition-all duration-500 ease-out flex items-start gap-3 ${
          showToast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
            {language === 'en' ? 'Submission Received' : 'Solicitud Recibida'}
          </h4>
          <p className="text-xs text-[#8B4513] leading-relaxed">
            {language === 'en'
              ? 'Success! Amelia and parents have both been notified by email.'
              : '¡Éxito! Amelia y los padres han sido notificados por correo electrónico.'}
          </p>
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="p-1 text-[#1A237E]/40 hover:text-[#1A237E]/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

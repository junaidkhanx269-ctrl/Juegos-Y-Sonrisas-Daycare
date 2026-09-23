export type Language = 'en' | 'es';

export interface ProgramTier {
  id: string;
  name: string;
  nameEs: string;
  ageRange: string;
  ageRangeEs: string;
  pricePerWeek: number;
  schedule: string;
  scheduleEs: string;
  highlight?: boolean;
  description: string;
  descriptionEs: string;
  features: string[];
  featuresEs: string[];
}

export interface RhythmItem {
  time: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  badge: string;
  badgeEs: string;
}

export interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  tag: string;
  tagEs: string;
}

export interface Testimonial {
  id: string;
  author: string;
  relation: string;
  relationEs: string;
  childAge: string;
  childAgeEs: string;
  quote: string;
  quoteEs: string;
  rating: number;
  neighborhood: string;
}

export interface FAQItem {
  id: string;
  question: string;
  questionEs: string;
  answer: string;
  answerEs: string;
  category: 'general' | 'tuition' | 'care';
}

export interface EnrollmentFormData {
  childName: string;
  childDob: string;
  program: string;
  parentName: string;
  phone: string;
  email: string;
  startDate: string;
  languagePreference: 'bilingual' | 'english' | 'spanish';
  needsSubsidy: boolean;
  needsExtendedCare: boolean;
  message: string;
}

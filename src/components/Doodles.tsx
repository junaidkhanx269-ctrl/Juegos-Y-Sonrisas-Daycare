import React from 'react';

export const SmileyFace: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="20" cy="20" r="18" fill="#FFD60A" stroke="#1A237E" strokeWidth="2.5" />
    <circle cx="14" cy="16" r="2.5" fill="#1A237E" />
    <circle cx="26" cy="16" r="2.5" fill="#1A237E" />
    <path
      d="M13 24C15 28 25 28 27 24"
      stroke="#1A237E"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="11" cy="22" r="2" fill="#FF6B6B" opacity="0.6" />
    <circle cx="29" cy="22" r="2" fill="#FF6B6B" opacity="0.6" />
  </svg>
);

export const SunshineDoodle: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="30" cy="30" r="14" fill="#FFD60A" stroke="#1A237E" strokeWidth="2" />
    <path d="M30 6V12" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M30 48V54" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M6 30H12" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M48 30H54" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M13 13L17.5 17.5" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M42.5 42.5L47 47" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M13 47L17.5 42.5" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M42.5 17.5L47 13" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const BuildingBlocksIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Base left block */}
    <rect x="5" y="20" width="14" height="14" rx="3" fill="#A8E6CF" stroke="#1A237E" strokeWidth="2" />
    <text x="12" y="31" fontSize="10" fontWeight="bold" fill="#1A237E" textAnchor="middle">A</text>
    {/* Base right block */}
    <rect x="21" y="20" width="14" height="14" rx="3" fill="#FF6B6B" stroke="#1A237E" strokeWidth="2" />
    <text x="28" y="31" fontSize="10" fontWeight="bold" fill="#FFF8E7" textAnchor="middle">B</text>
    {/* Top center block */}
    <rect x="13" y="5" width="14" height="14" rx="3" fill="#FFD60A" stroke="#1A237E" strokeWidth="2" />
    <text x="20" y="16" fontSize="10" fontWeight="bold" fill="#1A237E" textAnchor="middle">1</text>
  </svg>
);

export const HandDrawnArrow: React.FC<{ className?: string }> = ({ className = 'w-16 h-8' }) => (
  <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 25 C 35 10, 60 45, 85 20"
      stroke="#E07A5F"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="1 0"
    />
    <path
      d="M75 14 L86 19 L81 30"
      stroke="#E07A5F"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WavyUnderline: React.FC<{ className?: string }> = ({ className = 'w-32 h-3' }) => (
  <svg viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M2 7C20 2 30 11 50 6C70 1 80 11 100 6C120 1 130 10 138 7"
      stroke="#FFD60A"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const StarSparkle: React.FC<{ className?: string; color?: string }> = ({ className = 'w-5 h-5', color = '#FFD60A' }) => (
  <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

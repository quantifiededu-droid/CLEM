import React from 'react';

interface LogoProps {
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showText?: boolean;
  textClassName?: string;
}

export const ClemLogoIcon: React.FC<{ className?: string, size?: number }> = ({ className = '', size = 56 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none filter drop-shadow-md ${className}`}
    >
      <defs>
        {/* --- PREMIUM METALLIC GRADIENTS --- */}
        {/* Luxury Gold for Hexagon Edges and Bezels */}
        <linearGradient id="clemGoldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#efc15f" />
          <stop offset="25%" stopColor="#fdf1c0" />
          <stop offset="50%" stopColor="#d3a042" />
          <stop offset="75%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#9a6e1a" />
        </linearGradient>

        <linearGradient id="clemGoldInner" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="35%" stopColor="#d3a042" />
          <stop offset="70%" stopColor="#b4832c" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>

        {/* Polished Silver/Platinum for the Wide Engraved Ring */}
        <linearGradient id="clemSilverRing" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="20%" stopColor="#f1f5f9" />
          <stop offset="40%" stopColor="#cbd5e1" />
          <stop offset="60%" stopColor="#f8fafc" />
          <stop offset="80%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Sapphire Blue Gradient for the Base band */}
        <linearGradient id="clemSapphireBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Brilliant Gem-Stud Spot Light Gradient */}
        <radialGradient id="clemGemStud" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#93c5fd" />
          <stop offset="60%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>

        {/* Realistic Metallic Copper-Bronze for Texts & Lines */}
        <linearGradient id="clemCopper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b77651" />
          <stop offset="30%" stopColor="#fceee6" />
          <stop offset="50%" stopColor="#dfa785" />
          <stop offset="85%" stopColor="#7c4220" />
          <stop offset="100%" stopColor="#54230c" />
        </linearGradient>

        {/* Soft Shadow Filter for Bevels */}
        <filter id="clemBevelShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.75" />
        </filter>

        <filter id="clemCoreGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* --- GEOMETRIC HEXAGONAL EMBLEM SYSTEM --- */}
      {/* 1. Outer Gold Hexagonal Plate */}
      <path
        d="M 62,12 L 158,12 L 206,94 L 158,176 L 62,176 L 14,94 Z"
        fill="url(#clemGoldOuter)"
        stroke="#4a370e"
        strokeWidth="1.5"
        strokeLinejoin="round"
        filter="url(#clemBevelShadow)"
      />

      {/* 2. Silver Ring Plate with High-Fidelity Engravings */}
      <path
        d="M 68,20 L 152,20 L 194,94 L 152,168 L 68,168 L 26,94 Z"
        fill="url(#clemSilverRing)"
        stroke="#334155"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Intricate Art Deco Silver Chevron Hatching Engravings (Matches attached image) */}
      <g stroke="#475569" strokeWidth="0.8" opacity="0.65" strokeLinecap="round">
        {/* Top-left silver area lines */}
        <path d="M 66,20 L 52,38 M 74,20 L 60,38 M 82,20 L 68,38 M 90,20 L 76,38 M 98,20 L 84,38" />
        {/* Top-right silver area lines */}
        <path d="M 154,20 L 168,38 M 146,20 L 160,38 M 138,20 L 152,38 M 130,20 L 144,38 M 122,20 L 136,38" />
        {/* Bottom-left silver area lines */}
        <path d="M 66,168 L 52,150 M 74,168 L 60,150 M 82,168 L 68,150 M 90,168 L 76,150 M 98,168 L 84,150" />
        {/* Bottom-right silver area lines */}
        <path d="M 154,168 L 168,150 M 146,168 L 160,150 M 138,168 L 152,150 M 130,168 L 144,150 M 122,168 L 136,150" />
        {/* Left vertical border lines */}
        <path d="M 26,94 L 46,94 M 29,80 L 49,80 M 29,108 L 49,108 M 34,60 L 54,60 M 34,128 L 54,128" />
        {/* Right vertical border lines */}
        <path d="M 194,94 L 174,94 M 191,80 L 171,80 M 191,108 L 171,108 M 186,60 L 166,60 M 186,128 L 166,128" />
        
        {/* Inner geometric accent rings */}
        <polygon points="71,25 149,25 188,94 149,163 71,163 32,94" fill="none" stroke="#64748b" strokeWidth="0.5" />
      </g>

      {/* 3. Gold Inner Hexagon Boarder */}
      <path
        d="M 74,28 L 146,28 L 184,94 L 146,160 L 74,160 L 36,94 Z"
        fill="url(#clemGoldInner)"
        stroke="#4a370e"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* 4. Deep Dark-Slate Core Panel (Creates realistic depth shadow behind Sapphire letter) */}
      <path
        d="M 78,34 L 142,34 L 176,94 L 142,154 L 78,154 L 44,94 Z"
        fill="#070d1e"
        stroke="#1e293b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* 5. Gold Inner Trim Wire Frame */}
      <path
        d="M 80,38 L 140,38 L 172,94 L 140,150 L 80,150 L 48,94 Z"
        fill="none"
        stroke="#d3a042"
        strokeWidth="0.8"
        opacity="0.8"
      />

      {/* 6. Stylized Gemstone-Studded Blue Letter "M" / "C" Core */}
      {/* Precision path mapping the elegant isometric faceted brand emblem */}
      <g filter="url(#clemBevelShadow)">
        {/* Sapphire Base Track with gold outline */}
        <path
          d="M 62,118 L 62,70 C 62,64 66,60 72,60 L 98,82 C 103,86 107,86 112,82 L 138,60 C 144,60 148,64 148,70 L 148,118 C 148,124 144,128 138,128 L 126,118 C 122,114 117,114 114,118 L 105,128 L 96,118 C 93,114 88,114 84,118 L 72,128 C 66,128 62,124 62,118 Z"
          fill="url(#clemSapphireBase)"
          stroke="url(#clemGoldOuter)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Sparkling sapphire studs overlay */}
        <g filter="url(#clemCoreGlow)">
          {/* Left Wing Studs */}
          <circle cx="68" cy="74" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="68" cy="85" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="68" cy="96" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="68" cy="107" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="68" cy="118" r="3.5" fill="url(#clemGemStud)" />

          {/* Left Downward Diagonal Studs */}
          <circle cx="78" cy="76" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="87" cy="84" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="96" cy="91" r="3.5" fill="url(#clemGemStud)" />

          {/* Right Upward Diagonal Studs */}
          <circle cx="106" cy="91" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="115" cy="84" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="124" cy="76" r="3.5" fill="url(#clemGemStud)" />

          {/* Right Wing Studs */}
          <circle cx="142" cy="74" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="142" cy="85" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="142" cy="96" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="142" cy="107" r="3.5" fill="url(#clemGemStud)" />
          <circle cx="142" cy="118" r="3.5" fill="url(#clemGemStud)" />

          {/* Bottom Connector Rows */}
          <circle cx="79" cy="122" r="3.2" fill="url(#clemGemStud)" />
          <circle cx="91" cy="122" r="3.2" fill="url(#clemGemStud)" />
          <circle cx="103" cy="122" r="3.2" fill="url(#clemGemStud)" />
          <circle cx="115" cy="122" r="3.2" fill="url(#clemGemStud)" />
          <circle cx="128" cy="122" r="3.2" fill="url(#clemGemStud)" />

          {/* Central Star Sparkles for luxurious shine */}
          <polygon points="105,53 107,57 111,59 107,61 105,65 103,61 99,59 103,57" fill="#ffffff" opacity="0.95" />
          <polygon points="142,61 143,64 146,65 143,66 142,69 141,66 138,65 141,64" fill="#ffffff" opacity="0.95" />
          <polygon points="68,61 69,64 72,65 69,66 68,69 67,66 64,65 67,64" fill="#ffffff" opacity="0.95" />
        </g>
      </g>
    </svg>
  );
};

export const ClemLogoText: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* "CLEMTRIX" in premium Roman/Art-Deco serif style modeled strictly after gold and copper bevel */}
      <h1 
        className="font-serif text-3xl sm:text-4.5xl md:text-5xl font-black tracking-[0.1em] leading-none text-transparent bg-clip-text uppercase"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #ebd300 0%, #fae7aa 28%, #d97706 60%, #b7521e 84%, #7c2d12 100%)',
          textShadow: '0 5px 8px rgba(0,0,0,0.45)',
          filter: 'drop-shadow(0px 2px 3px rgba(255,255,255,0.18))'
        }}
      >
        CLEMTRIX<span className="text-amber-100 font-normal opacity-90 text-[0.8em]"> POS</span>
      </h1>

      {/* "powered by Clem" in geometric tracking-expanded lowercase/caps mix matching the copper shine */}
      <p 
        className="text-xs sm:text-sm font-sans tracking-[0.3em] uppercase font-extrabold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-300 to-amber-500"
      >
        powered by Clem
      </p>

      {/* Exquisite copper hairline decoration with center diamond - MATCHES ATTACHED IMAGE EXACTLY */}
      <div className="flex items-center gap-3 w-full max-w-[200px] mt-4 opacity-90">
        {/* Left tapering needle */}
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#b7521e] to-[#fceee6]" />
        
        {/* Small flanking copper dots */}
        <div className="w-1 h-1 rounded-full bg-[#dfa785]" />
        
        {/* Center beveled rotating diamond */}
        <div 
          className="w-2.5 h-2.5 rotate-45 border border-[#fcfeff]/30 bg-[#b7521e]" 
          style={{ 
            boxShadow: '0 0 5px #ebd300',
            backgroundImage: 'linear-gradient(135deg, #fceee6 0%, #b7521e 100%)'
          }}
        />
        
        {/* Small flanking copper dots */}
        <div className="w-1 h-1 rounded-full bg-[#dfa785]" />
        
        {/* Right tapering needle */}
        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-[#b7521e] to-[#fceee6]" />
      </div>
    </div>
  );
};

export const ClemLogoFull: React.FC<LogoProps> = ({
  className = '',
  iconSize = 'lg',
  showText = true,
  textClassName = '',
}) => {
  let sizePixel = 96;
  if (iconSize === 'sm') sizePixel = 42;
  else if (iconSize === 'md') sizePixel = 64;
  else if (iconSize === 'lg') sizePixel = 110;
  else if (iconSize === 'xl') sizePixel = 180;

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <ClemLogoIcon size={sizePixel} className="transform hover:scale-105 transition-transform duration-300" />
      {showText && <ClemLogoText className={textClassName} />}
    </div>
  );
};

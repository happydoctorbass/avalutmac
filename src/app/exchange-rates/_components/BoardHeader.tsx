'use client';

import React, { useState, useEffect } from 'react';
import { useLanguageCycle } from '../_hooks';

interface BoardHeaderProps {
  scaleMultiplier?: number;
  brandFontSizePx?: number;
  dividerBrightness?: number;
}

export function BoardHeader({
  scaleMultiplier = 1.0,
  brandFontSizePx,
  dividerBrightness = 80,
}: BoardHeaderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { texts } = useLanguageCycle(4000);

  if (!mounted) {
    return (
      <header className="w-full text-center mb-6 sm:mb-10 flex flex-col items-center justify-center select-none min-h-[120px]" />
    );
  }

  // Secondary Branding (ADMIRAL CASINO) font size: small header
  const secondaryBrandFontSize = `${Math.max(10, Math.round(12 * scaleMultiplier))}px`;

  // Dominant cycling title ("КУРСЫ ВАЛЮТ" / "EXCHANGE RATES" / "汇率") font size: HUGE central header
  const dominantTitleFontSize = brandFontSizePx
    ? `${Math.round(brandFontSizePx * 1.5 * (scaleMultiplier >= 1.2 ? 1.15 : 1.0))}px`
    : `${Math.round(68 * scaleMultiplier)}px`;

  const dividerOpacity = Math.max(0.15, Math.min(1, dividerBrightness / 100));

  return (
    <header className="w-full text-center mb-6 sm:mb-10 flex flex-col items-center justify-center select-none">
      {/* Top Section: ADMIRAL CASINO (White) strictly between two thin horizontal lines */}
      <div className="flex flex-col items-center justify-center gap-1.5 mb-2 sm:mb-3">
        {/* Top Thin Horizontal Line */}
        <div
          style={{ opacity: dividerOpacity }}
          className="flex items-center justify-center gap-2"
        >
          <div className="h-[1px] w-20 sm:w-40 bg-gradient-to-r from-transparent via-white/60 to-white/80" />
          <span className="inline-block h-1 w-1 rotate-45 bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
          <div className="h-[1px] w-20 sm:w-40 bg-gradient-to-l from-transparent via-white/60 to-white/80" />
        </div>

        {/* Secondary Branding: ADMIRAL CASINO in crisp white */}
        <div className="py-0.5 px-3">
          <div
            style={{ fontSize: secondaryBrandFontSize }}
            className="font-bold tracking-[0.38em] sm:tracking-[0.48em] uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] select-none opacity-95"
          >
            ADMIRAL CASINO
          </div>
        </div>

        {/* Bottom Thin Horizontal Line */}
        <div
          style={{ opacity: dividerOpacity }}
          className="flex items-center justify-center gap-2"
        >
          <div className="h-[1px] w-20 sm:w-40 bg-gradient-to-r from-transparent via-white/60 to-white/80" />
          <span className="inline-block h-1 w-1 rotate-45 bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
          <div className="h-[1px] w-20 sm:w-40 bg-gradient-to-l from-transparent via-white/60 to-white/80" />
        </div>
      </div>

      {/* HUGE Central Dominant Main Cycling Title: КУРСЫ ВАЛЮТ / EXCHANGE RATES / 汇率 (Instant text change without animation) */}
      <div className="min-h-[72px] sm:min-h-[100px] flex items-center justify-center mt-1 sm:mt-2">
        <h1
          style={{ fontSize: dominantTitleFontSize }}
          className="font-extrabold tracking-[0.16em] sm:tracking-[0.24em] text-white uppercase leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] select-none text-center"
        >
          {texts.title}
        </h1>
      </div>
    </header>
  );
}

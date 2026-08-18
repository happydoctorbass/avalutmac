'use client';

import React, { useState } from 'react';

/**
 * Currency to ISO 3166-1 alpha-2 country code mapping for FlagCDN SVG flags.
 */
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: 'us',
  EUR: 'eu',
  RUB: 'ru',
  KGS: 'kg',
  KZT: 'kz',
  CNY: 'cn',
  GBP: 'gb',
  TRY: 'tr',
  AED: 'ae',
  UZS: 'uz',
  CHF: 'ch',
  JPY: 'jp',
  CAD: 'ca',
  AUD: 'au',
  SGD: 'sg',
  GEL: 'ge',
  INR: 'in',
  KRW: 'kr',
  THB: 'th',
  TJS: 'tj',
  AMD: 'am',
  AZN: 'az',
  QAR: 'qa',
  SAR: 'sa',
  KWD: 'kw',
};

export type FlagSize = 'sm' | 'md' | 'lg' | 'tv';

interface CurrencyFlagProps {
  code: string;
  size?: FlagSize;
  className?: string;
}

const SIZE_STYLES: Record<FlagSize, string> = {
  sm: 'w-8 h-5.5 rounded-md',
  md: 'w-11 h-7.5 rounded-md',
  lg: 'w-20 h-14 rounded-xl min-w-[80px]',
  tv: 'w-20 h-13 sm:w-24 sm:h-16 md:w-28 md:h-[70px] rounded-xl min-w-[80px]',
};

export function CurrencyFlag({ code, size = 'tv', className }: CurrencyFlagProps) {
  const [hasError, setHasError] = useState(false);
  const cleanCode = (code || 'USD').toUpperCase().trim();
  const countryCode = CURRENCY_TO_COUNTRY[cleanCode] || cleanCode.slice(0, 2).toLowerCase();
  const flagUrl = `https://flagcdn.com/${countryCode}.svg`;

  const sizeClasses = className || SIZE_STYLES[size];

  return (
    <div
      className={`relative overflow-hidden border border-white/10 bg-slate-900/80 shadow-lg shadow-black/50 flex items-center justify-center shrink-0 transition-transform duration-300 ${sizeClasses}`}
    >
      {!hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={flagUrl}
          alt={`${cleanCode} flag`}
          loading="eager"
          decoding="async"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover select-none"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-amber-400 font-bold font-mono text-xs tracking-wider">
          {cleanCode.slice(0, 3)}
        </div>
      )}
      {/* Subtle glass reflection overlay for luxury look */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
    </div>
  );
}

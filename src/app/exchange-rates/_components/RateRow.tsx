'use client';

import React, { useState, useEffect } from 'react';
import { ExchangeRate } from '../_types';
import { CurrencyFlag } from './CurrencyFlag';

interface RateRowProps {
  rate: ExchangeRate;
  scaleMultiplier?: number;
  borderWidth?: number;
}

function formatPrice(val: number): string {
  if (typeof val !== 'number' || isNaN(val)) return '0,00';
  if (val >= 100) {
    return val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (val >= 1) {
    return val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  return val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

export function RateRow({ rate, scaleMultiplier = 1.0, borderWidth = 1 }: RateRowProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const code = (rate.currency?.code || '---').toUpperCase();
  const nameRu = rate.currency?.name_ru || '';
  const nameEn = rate.currency?.name_en || '';

  // Base font sizes scaled by scaleMultiplier
  const codeFontSize = `${Math.round(28 * scaleMultiplier)}px`;
  const nameFontSize = `${Math.round(14 * scaleMultiplier)}px`;
  const priceFontSize = `${Math.round(40 * scaleMultiplier)}px`;
  const rowMinHeight = `${Math.max(115, Math.round(130 * scaleMultiplier))}px`;

  if (!mounted) {
    return (
      <tr
        style={{
          minHeight: rowMinHeight,
          borderBottomWidth: `${borderWidth}px`,
          borderBottomStyle: 'solid',
        }}
        className="border-white/20"
      >
        <td colSpan={3} className="py-6 px-4">
          <div className="h-12 w-full animate-pulse rounded bg-slate-800/40" />
        </td>
      </tr>
    );
  }

  return (
    <tr
      style={{
        minHeight: rowMinHeight,
        borderBottomWidth: `${borderWidth}px`,
        borderBottomStyle: 'solid',
      }}
      className="border-white/20 relative transition-colors duration-300 hover:bg-amber-500/[0.03] group"
    >
      {/* Currency Flag & Code */}
      <td className="py-5 sm:py-7 pl-4 sm:pl-6 text-left align-middle w-2/5 relative">
        <div className="flex items-center gap-4 sm:gap-6">
          <CurrencyFlag code={code} size="tv" />
          <div className="flex flex-col justify-center">
            <span
              style={{ fontSize: codeFontSize }}
              className="font-extrabold tracking-wider text-slate-100 font-sans leading-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
            >
              {code}
            </span>
            {(nameRu || nameEn) && (
              <span
                style={{ fontSize: nameFontSize }}
                className="mt-1.5 font-medium tracking-wide text-slate-300/85 leading-none truncate max-w-[200px] sm:max-w-[260px]"
              >
                {nameRu || nameEn}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Buy Price (Emerald with glow) */}
      <td className="py-5 sm:py-7 px-4 sm:px-8 text-right align-middle w-[30%] relative">
        <span
          style={{ fontSize: priceFontSize }}
          className="font-bold tabular-nums font-mono text-emerald-400 drop-shadow-[0_0_18px_rgba(52,211,153,0.35)] leading-none inline-block tracking-tight"
        >
          {formatPrice(rate.buy_price)}
        </span>
      </td>

      {/* Sell Price (Gold with glow) */}
      <td className="py-5 sm:py-7 pr-4 sm:pr-6 text-right align-middle w-[30%] relative">
        <span
          style={{ fontSize: priceFontSize }}
          className="font-bold tabular-nums font-mono text-amber-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.35)] leading-none inline-block tracking-tight"
        >
          {formatPrice(rate.sell_price)}
        </span>
      </td>
    </tr>
  );
}

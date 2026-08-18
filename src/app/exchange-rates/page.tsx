'use client';

import React, { useState, useEffect } from 'react';
import { useRates, useLanguageCycle, useDisplaySettings } from './_hooks';
import { BoardHeader, RateRow, RatesSkeleton } from './_components';

export default function ExchangeRatesPublicPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { rates, isLoading } = useRates();
  const { currentLanguage, texts } = useLanguageCycle(4000);
  const { scaleMultiplier, brandFontSizePx, dividerBrightness, tableBorderWidth } = useDisplaySettings();

  if (!mounted) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#030712] text-slate-100 px-4 py-8 sm:px-8 sm:py-12 select-none relative overflow-x-hidden">
        {/* Background ambient lighting */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(217,119,6,0.12),transparent)]" />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(16,185,129,0.06),transparent)]" />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.03),transparent)]" />

        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center z-10 my-auto">
          <div className="w-full max-w-4xl">
            <RatesSkeleton />
          </div>
        </div>
      </main>
    );
  }

  const colHeaderFontSize = `${Math.max(12, Math.round(15 * scaleMultiplier))}px`;

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#030712] text-slate-100 px-4 py-8 sm:px-8 sm:py-12 select-none relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(217,119,6,0.12),transparent)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(16,185,129,0.06),transparent)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.03),transparent)]" />

      {/* Centered Main Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center z-10 my-auto">
        <BoardHeader
          scaleMultiplier={scaleMultiplier}
          brandFontSizePx={brandFontSizePx}
          dividerBrightness={dividerBrightness}
        />

        {/* Rates Content: Premium Minimalist Table */}
        {isLoading && rates.length === 0 ? (
          <div className="w-full max-w-4xl">
            <RatesSkeleton />
          </div>
        ) : (
          <div className="w-full max-w-4xl backdrop-blur-md rounded-2xl border border-white/20 bg-slate-950/60 p-2 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_15px_rgba(251,191,36,0.05)] ring-1 ring-white/10 relative">
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 via-white/40 to-transparent pointer-events-none" />

            <table className="w-full border-collapse">
              <thead>
                <tr
                  style={{
                    borderBottomWidth: `${tableBorderWidth}px`,
                    borderBottomStyle: 'solid',
                  }}
                  className="border-white/20 text-slate-300 font-semibold tracking-widest uppercase relative"
                >
                  {/* Currency column header */}
                  <th
                    style={{ fontSize: colHeaderFontSize }}
                    className="py-4 pl-4 sm:pl-6 text-left font-medium w-2/5"
                  >
                    <div className="h-6 flex items-center">
                      <span className="inline-block text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {texts.currency}
                      </span>
                    </div>
                  </th>

                  {/* Buy column header */}
                  <th
                    style={{ fontSize: colHeaderFontSize }}
                    className="py-4 px-4 sm:px-8 text-right font-medium w-[30%]"
                  >
                    <div className="h-6 flex items-center justify-end">
                      <span className="inline-block text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                        {texts.buy}
                      </span>
                    </div>
                  </th>

                  {/* Sell column header */}
                  <th
                    style={{ fontSize: colHeaderFontSize }}
                    className="py-4 pr-4 sm:pr-6 text-right font-medium w-[30%]"
                  >
                    <div className="h-6 flex items-center justify-end">
                      <span className="inline-block text-amber-400 font-bold drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                        {texts.sell}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <RateRow
                    key={rate.currency_id || rate.id}
                    rate={rate}
                    scaleMultiplier={scaleMultiplier}
                    borderWidth={tableBorderWidth}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

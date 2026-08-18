'use client';

import React, { useState, useEffect } from 'react';
import { ExchangeRate } from '../_types';
import { CurrencyFlag } from './CurrencyFlag';

interface RateCardProps {
  rate: ExchangeRate;
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

export function RateCard({ rate }: RateCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const code = rate.currency?.code || '---';

  if (!mounted) {
    return (
      <div className="flex items-center justify-between py-3 px-2">
        <div className="h-6 w-20 animate-pulse rounded bg-slate-800/50" />
        <div className="h-6 w-32 animate-pulse rounded bg-slate-800/50" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 px-2">
      <div className="flex items-center gap-3">
        <CurrencyFlag code={code} size="md" className="h-6 w-9 rounded" />
        <span className="text-lg font-bold text-white tracking-wider">{code}</span>
      </div>
      <div className="flex items-center gap-6 text-right">
        <span className="text-xl font-semibold tabular-nums text-emerald-400">
          {formatPrice(rate.buy_price)}
        </span>
        <span className="text-xl font-semibold tabular-nums text-amber-400">
          {formatPrice(rate.sell_price)}
        </span>
      </div>
    </div>
  );
}

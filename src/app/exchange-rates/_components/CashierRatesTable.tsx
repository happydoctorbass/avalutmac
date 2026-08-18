'use client';

import React, { useState, useEffect } from 'react';
import { ExchangeRate } from '../_types';
import { CurrencyFlag } from './CurrencyFlag';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';

interface Props {
  rates: ExchangeRate[];
  onSelectRate: (rate: ExchangeRate) => void;
}

export function CashierRatesTable({ rates, onSelectRate }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl p-6">
        <div className="h-48 w-full animate-pulse rounded bg-slate-800/40" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="py-3.5 pl-4 pr-3 font-semibold">Валюта</th>
              <th className="py-3.5 px-4 text-right font-semibold">Покупка (KGS)</th>
              <th className="py-3.5 px-4 text-right font-semibold">Продажа (KGS)</th>
              <th className="py-3.5 px-4 text-right font-semibold hidden sm:table-cell">Спред</th>
              <th className="py-3.5 pr-4 pl-2 text-right font-semibold">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {rates.map((rate) => {
              const code = rate.currency?.code || '---';
              const nameRu = rate.currency?.name_ru || 'Валюта';
              const spread = Math.max(0, rate.sell_price - rate.buy_price);

              return (
                <tr
                  key={rate.id}
                  onClick={() => onSelectRate(rate)}
                  className="cursor-pointer transition-colors duration-150 hover:bg-slate-800/40 group"
                >
                  <td className="py-3.5 pl-4 pr-3">
                    <div className="flex items-center gap-3">
                      <CurrencyFlag code={code} size="md" />
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                          {code} / KGS
                        </div>
                        <div className="text-xs text-slate-400">{nameRu}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono text-base font-bold text-blue-400 tabular-nums">
                      {rate.buy_price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                      {rate.sell_price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right hidden sm:table-cell">
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      +{spread.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 pl-2 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRate(rate);
                      }}
                      className="h-8 gap-1 text-xs text-slate-300 hover:text-white hover:bg-blue-600/20"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span className="hidden md:inline">Изменить</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

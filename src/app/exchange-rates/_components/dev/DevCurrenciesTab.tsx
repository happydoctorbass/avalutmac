'use client';

import React, { useState } from 'react';
import { Currency } from '../../_types';
import { CurrencyFlag } from '../CurrencyFlag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ArrowUpDown, Check } from 'lucide-react';
import { DevAddCurrencyModal } from './DevAddCurrencyModal';

interface Props {
  currencies: Currency[];
  onAddCurrency: (data: { code: string; nameRu: string; nameEn: string; buyPrice: number; sellPrice: number; position: number }) => Promise<void>;
  onUpdatePosition: (id: string, pos: number) => Promise<void>;
  isSubmitting: boolean;
}

export function DevCurrenciesTab({ currencies, onAddCurrency, onUpdatePosition, isSubmitting }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positions, setPositions] = useState<Record<string, number>>({});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-amber-400" />
          <span>Валютные пары и сортировка на табло</span>
        </h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5 text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Добавить валюту</span>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="py-3 pl-4 pr-3 font-semibold">Валюта</th>
              <th className="py-3 px-3 font-semibold">Название</th>
              <th className="py-3 px-3 text-center font-semibold w-32">Позиция</th>
              <th className="py-3 pr-4 pl-2 text-right font-semibold">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {currencies.map((cur) => {
              const curPos = positions[cur.id] !== undefined ? positions[cur.id] : cur.position;
              return (
                <tr key={cur.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 pl-4 pr-3">
                    <div className="flex items-center gap-2.5">
                      <CurrencyFlag code={cur.code} size="md" />
                      <span className="font-bold text-white text-sm">{cur.code}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-300">
                    <div>{cur.name_ru}</div>
                    <div className="text-[11px] text-slate-500">{cur.name_en}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Input
                      type="number"
                      value={curPos}
                      onChange={(e) => setPositions((p) => ({ ...p, [cur.id]: parseInt(e.target.value, 10) || 0 }))}
                      className="w-20 mx-auto h-8 text-center bg-slate-950 border-slate-700 text-white font-mono text-xs"
                    />
                  </td>
                  <td className="py-3 pr-4 pl-2 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUpdatePosition(cur.id, curPos)}
                      className="h-8 gap-1 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Применить</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DevAddCurrencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAddCurrency}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

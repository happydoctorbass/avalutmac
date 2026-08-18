'use client';

import React, { useState, useEffect } from 'react';
import { ExchangeRate } from '../_types';
import { CurrencyFlag } from './CurrencyFlag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Save, AlertCircle, Loader2, TrendingUp } from 'lucide-react';

interface Props {
  rate: ExchangeRate | null;
  onClose: () => void;
  onSave: (rateId: string, curId: string, buy: number, sell: number) => Promise<void>;
  isSaving: boolean;
}

export function CashierEditModal({ rate, onClose, onSave, isSaving }: Props) {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rate) {
      setBuyPrice(rate.buy_price.toString());
      setSellPrice(rate.sell_price.toString());
      setError(null);
    }
  }, [rate]);

  if (!rate) return null;

  const buy = parseFloat(buyPrice);
  const sell = parseFloat(sellPrice);
  const currentSpread = !isNaN(buy) && !isNaN(sell) ? sell - buy : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(buy) || isNaN(sell)) {
      return setError('Введите корректные числа');
    }
    if (buy < 0 || sell < 0) {
      return setError('Цена не может быть отрицательной');
    }

    setError(null);
    try {
      console.log('[CashierEditModal] Attempting to save rate:', {
        rateId: rate.id,
        currencyId: rate.currency_id,
        buy,
        sell,
      });
      await onSave(rate.id, rate.currency_id, buy, sell);
    } catch (error: unknown) {
      console.error("FULL DB ERROR:", error);
      setError(error instanceof Error ? error.message : 'Ошибка при сохранении курса в базе');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <CurrencyFlag code={rate.currency?.code || 'USD'} size="md" />
            <div>
              <h3 className="font-bold text-white text-base">{rate.currency?.code} / KGS</h3>
              <p className="text-xs text-slate-400">{rate.currency?.name_ru}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-2.5 text-xs text-rose-300 border border-rose-500/30">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Покупка (KGS)</Label>
              <Input
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => {
                  setBuyPrice(e.target.value);
                  setError(null);
                }}
                required
                disabled={isSaving}
                className="bg-slate-950 border-slate-700 text-white font-mono text-base"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Продажа (KGS)</Label>
              <Input
                type="number"
                step="any"
                value={sellPrice}
                onChange={(e) => {
                  setSellPrice(e.target.value);
                  setError(null);
                }}
                required
                disabled={isSaving}
                className="bg-slate-950 border-slate-700 text-white font-mono text-base"
              />
            </div>
          </div>

          {currentSpread !== null && (
            <div className="flex items-center justify-between rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                Расчетный спред:
              </span>
              <span className={`font-mono font-bold ${currentSpread < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentSpread >= 0 ? `+${currentSpread.toFixed(4)}` : currentSpread.toFixed(4)} KGS
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
              className="border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-1.5"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Сохранить курс</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

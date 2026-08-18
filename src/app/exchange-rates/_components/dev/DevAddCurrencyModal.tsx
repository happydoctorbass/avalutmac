'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { code: string; nameRu: string; nameEn: string; buyPrice: number; sellPrice: number; position: number }) => Promise<void>;
  isSubmitting: boolean;
}

export function DevAddCurrencyModal({ isOpen, onClose, onAdd, isSubmitting }: Props) {
  const [code, setCode] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [position, setPosition] = useState('10');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const buy = parseFloat(buyPrice);
  const sell = parseFloat(sellPrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pos = parseInt(position, 10) || 50;

    if (!code || !nameRu) return setError('Заполните код и название валюты');
    if (isNaN(buy) || isNaN(sell) || buy < 0 || sell < 0) {
      return setError('Курсы должны быть неотрицательными числами');
    }

    setError(null);
    await onAdd({
      code: code.toUpperCase().trim(),
      nameRu: nameRu.trim(),
      nameEn: nameEn.trim() || nameRu.trim(),
      buyPrice: buy,
      sellPrice: sell,
      position: pos,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Добавить валютную пару (к KGS)</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-2.5 text-xs text-rose-300 border border-rose-500/30">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Код (e.g. CNY)</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="CNY"
                required
                disabled={isSubmitting}
                className="bg-slate-950 border-slate-700 text-white font-mono uppercase"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Позиция на табло</Label>
              <Input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="1"
                disabled={isSubmitting}
                className="bg-slate-950 border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Название (RU)</Label>
            <Input
              value={nameRu}
              onChange={(e) => setNameRu(e.target.value)}
              placeholder="Китайский юань"
              required
              disabled={isSubmitting}
              className="bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Название (EN)</Label>
            <Input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Chinese Yuan"
              disabled={isSubmitting}
              className="bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Покупка (KGS)</Label>
              <Input
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="12.10"
                required
                disabled={isSubmitting}
                className="bg-slate-950 border-slate-700 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Продажа (KGS)</Label>
              <Input
                type="number"
                step="any"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="12.50"
                required
                disabled={isSubmitting}
                className="bg-slate-950 border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span>Добавить</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

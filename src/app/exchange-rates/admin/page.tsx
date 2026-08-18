'use client';

import React, { useState } from 'react';
import { useAuthRole, useRates, useExchangeActions } from '../_hooks';
import { CashierRatesTable } from '../_components/CashierRatesTable';
import { CashierEditModal } from '../_components/CashierEditModal';
import { RatesSkeleton } from '../_components/RatesSkeleton';
import { ExchangeRate } from '../_types';
import { Coins, UserCheck, RefreshCw } from 'lucide-react';

export default function ExchangeRatesAdminPage() {
  const { user } = useAuthRole();
  const { rates, isLoading, refetch } = useRates();
  const { updateRate, isSubmitting } = useExchangeActions();
  const [selectedRate, setSelectedRate] = useState<ExchangeRate | null>(null);

  const handleSave = async (rateId: string, curId: string, buy: number, sell: number) => {
    console.log('[AdminPage] handleSave triggered with cashier user ID:', user?.id, { rateId, curId, buy, sell });
    const res = await updateRate(rateId, curId, buy, sell, user?.id);
    if (res.success) {
      setSelectedRate(null);
      refetch();
    } else {
      console.error('[AdminPage] handleSave error response:', res.error);
      throw (res as { rawError?: unknown }).rawError || new Error(res.error || 'Ошибка при сохранении курса');
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-60px)] flex-col p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Панель кассира</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Оперативное обновление курсов покупки и продажи валют (в сомах - KGS)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 font-mono border border-slate-700">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>{user?.email || 'Кассир'}</span>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Обновить список"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </header>

        {isLoading && rates.length === 0 ? (
          <RatesSkeleton />
        ) : (
          <CashierRatesTable rates={rates} onSelectRate={setSelectedRate} />
        )}

        <CashierEditModal
          rate={selectedRate}
          onClose={() => setSelectedRate(null)}
          onSave={handleSave}
          isSaving={isSubmitting}
        />
      </div>
    </main>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAuthRole,
  useCurrencies,
  useCashiers,
  useExchangeLogs,
  useExchangeActions,
} from '../_hooks';
import { DevCurrenciesTab } from '../_components/dev/DevCurrenciesTab';
import { DevUsersTab } from '../_components/dev/DevUsersTab';
import { DevLogsTab } from '../_components/dev/DevLogsTab';
import { DevDisplayTab } from '../_components/dev/DevDisplayTab';
import { DevAccountTab } from '../_components/dev/DevAccountTab';
import { Terminal, Database, Users, Activity, Tv, KeyRound, Loader2 } from 'lucide-react';

type TabType = 'currencies' | 'users' | 'display' | 'account' | 'logs';

export default function ExchangeRatesDevPage() {
  const { user, profile, isLoading: authLoading } = useAuthRole();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('currencies');
  const { currencies, isLoading: cLoading, refetch: cRefetch } = useCurrencies();
  const { cashiers, isLoading: uLoading, refetch: uRefetch } = useCashiers();
  const { logs, isLoading: lLoading, refetch: lRefetch } = useExchangeLogs();
  const {
    addCurrency,
    updateCurrencyPosition,
    createCashierUser,
    updateCashierPassword,
    deleteCashierUser,
    deleteSingleLog,
    clearAllAuditLogs,
    isSubmitting,
  } = useExchangeActions();

  // Strict RBAC protection: immediately redirect if role is not developer
  useEffect(() => {
    if (!authLoading) {
      if (!profile || profile.role !== 'developer') {
        router.replace('/exchange-rates/admin');
      }
    }
  }, [profile, authLoading, router]);

  if (authLoading || !profile || profile.role !== 'developer') {
    return (
      <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-60px)] flex-col p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Панель разработчика</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Управление валютами (KGS), масштабированием 42&quot; ТВ, кассирами и аудит-логами
              </p>
            </div>
          </div>
          <span className="rounded-md bg-amber-500/10 px-3 py-1 text-xs font-mono font-semibold text-amber-300 border border-amber-500/30 self-start sm:self-auto">
            {user?.email || 'developer'}
          </span>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('currencies')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'currencies'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Валюты ({currencies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'users'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Кассиры ({cashiers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('display')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'display'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Tv className="h-4 w-4" />
            <span>Дизайн табло</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'account'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <KeyRound className="h-4 w-4" />
            <span>Мой пароль</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'logs'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Логи аудита ({logs.length})</span>
          </button>
        </div>

        {/* Tab 1: Currencies */}
        {activeTab === 'currencies' && (
          <DevCurrenciesTab
            currencies={currencies}
            onAddCurrency={async (d) => {
              await addCurrency(d);
              cRefetch();
            }}
            onUpdatePosition={async (id, pos) => {
              await updateCurrencyPosition(id, pos);
              cRefetch();
            }}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Tab 2: Users / Cashiers */}
        {activeTab === 'users' && (
          <DevUsersTab
            cashiers={cashiers}
            onAddUser={async (em, p, n) => {
              await createCashierUser(em, p, n);
              uRefetch();
            }}
            onUpdatePassword={async (uid, pass) => {
              return await updateCashierPassword(uid, pass);
            }}
            onDeleteUser={async (uid) => {
              return await deleteCashierUser(uid);
            }}
            onRefresh={uRefetch}
            isLoading={uLoading}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Tab 3: Display Settings */}
        {activeTab === 'display' && <DevDisplayTab />}

        {/* Tab 4: Account Security */}
        {activeTab === 'account' && <DevAccountTab user={user} />}

        {/* Tab 5: Audit Logs */}
        {activeTab === 'logs' && (
          <DevLogsTab
            logs={logs}
            onRefresh={lRefetch}
            onDeleteLog={async (id) => {
              const res = await deleteSingleLog(id);
              if (res.success) lRefetch();
              return res;
            }}
            onClearAllLogs={async () => {
              const res = await clearAllAuditLogs();
              if (res.success) lRefetch();
              return res;
            }}
            isLoading={lLoading}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </main>
  );
}

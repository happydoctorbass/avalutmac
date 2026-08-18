'use client';

import React, { useState, useEffect } from 'react';
import { ExchangeHistory } from '../../_types';
import { CurrencyFlag } from '../CurrencyFlag';
import {
  Activity,
  ArrowRight,
  RefreshCw,
  UserCheck,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  logs: ExchangeHistory[];
  onRefresh: () => void;
  onDeleteLog?: (id: string) => Promise<{ success: boolean; error?: string }>;
  onClearAllLogs?: () => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  isSubmitting?: boolean;
}

export function DevLogsTab({
  logs,
  onRefresh,
  onDeleteLog,
  onClearAllLogs,
  isLoading,
  isSubmitting = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-slate-900/60" />
      </div>
    );
  }

  const handleDeleteSingle = async (id: string) => {
    if (!onDeleteLog) return;
    setDeletingId(id);
    setIsActionLoading(true);
    try {
      await onDeleteLog(id);
      onRefresh();
    } finally {
      setDeletingId(null);
      setIsActionLoading(false);
    }
  };

  const handleConfirmClearAll = async () => {
    if (!onClearAllLogs) return;
    setIsActionLoading(true);
    try {
      await onClearAllLogs();
      setIsClearModalOpen(false);
      onRefresh();
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Clear All Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Журнал аудита котировок (Exchange History)</h2>
          <span className="ml-1.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-slate-300 border border-slate-700">
            {logs.length}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {logs.length > 0 && onClearAllLogs && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsClearModalOpen(true)}
              disabled={isLoading || isSubmitting || isActionLoading}
              className="h-8 gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
              title="Очистить всю историю аудита"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Очистить всю историю</span>
            </Button>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading || isActionLoading}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition disabled:opacity-50"
            title="Обновить журнал"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isActionLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="py-3 pl-4 pr-3 font-semibold">Валюта</th>
              <th className="py-3 px-3 font-semibold">Покупка (Было → Стало)</th>
              <th className="py-3 px-3 font-semibold">Продажа (Было → Стало)</th>
              <th className="py-3 px-3 font-semibold">Кто изменил</th>
              <th className="py-3 px-3 text-right font-semibold">Время</th>
              <th className="py-3 pr-4 pl-2 text-right font-semibold w-16">Удалить</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-slate-500">
                  Записей в истории пока нет
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const curCode = log.currency?.code || '---';
                const timeStr = log.created_at ? new Date(log.created_at).toLocaleString('ru-RU') : '---';
                const actorName = log.profile?.full_name || (log.changed_by ? 'Кассир' : 'Система');
                const isCurrentDeleting = deletingId === log.id;

                return (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition group">
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-2">
                        <CurrencyFlag code={curCode} className="h-6 w-8" />
                        <span className="font-bold text-white text-xs">{curCode}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-blue-300">
                        <span className="text-slate-500">
                          {log.old_buy_price !== null ? Number(log.old_buy_price).toFixed(2) : '—'}
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-600" />
                        <span className="font-bold text-white">{Number(log.new_buy_price).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-amber-300">
                        <span className="text-slate-500">
                          {log.old_sell_price !== null ? Number(log.old_sell_price).toFixed(2) : '—'}
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-600" />
                        <span className="font-bold text-white">{Number(log.new_sell_price).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-blue-400/70" />
                        <span>{actorName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-[11px] text-slate-400 font-mono">{timeStr}</td>
                    <td className="py-3 pr-4 pl-2 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteSingle(log.id)}
                        disabled={isActionLoading || isSubmitting}
                        className="h-7 w-7 p-0 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Удалить эту запись"
                      >
                        {isCurrentDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-400" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for "Clear All Logs" */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-rose-400 font-bold">
                <AlertTriangle className="h-5 w-5" />
                <h3>Очистить всю историю аудита?</h3>
              </div>
              <button
                onClick={() => setIsClearModalOpen(false)}
                disabled={isActionLoading}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300">
              Вы уверены, что хотите безвозвратно удалить <strong className="text-white">все записи ({logs.length})</strong> из журнала аудита котировок?
            </p>
            <p className="text-xs text-rose-400/90 font-mono">
              Это действие необратимо и сотрет всю историю изменений.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsClearModalOpen(false)}
                disabled={isActionLoading}
                className="border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Отмена
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmClearAll}
                disabled={isActionLoading}
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold gap-1.5"
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Да, очистить всё</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

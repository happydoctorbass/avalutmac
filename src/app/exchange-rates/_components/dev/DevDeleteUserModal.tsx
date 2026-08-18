'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, UserX, AlertTriangle, Loader2 } from 'lucide-react';
import { Profile } from '../../_types';

interface Props {
  user: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (userId: string) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export function DevDeleteUserModal({ user, isOpen, onClose, onConfirmDelete, isSubmitting }: Props) {
  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    const res = await onConfirmDelete(user.id);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-rose-900/50 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h3 className="font-bold text-white text-base">Деактивация кассира</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-300">
            Вы уверены, что хотите деактивировать (удалить) учетную запись кассира:
          </p>
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs space-y-1">
            <div className="font-semibold text-white">{user.full_name || 'Без имени'}</div>
            <div className="text-slate-400 font-mono">ID: {user.id}</div>
            <div className="text-amber-400">Роль: {user.role}</div>
          </div>
          <p className="text-xs text-rose-300">
            Кассир потеряет доступ к панели управления котировками.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting} className="border border-slate-700 text-slate-300 hover:bg-slate-800">
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold gap-1.5"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
            <span>Деактивировать</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

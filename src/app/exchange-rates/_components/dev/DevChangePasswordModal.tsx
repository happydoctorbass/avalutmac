'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { Profile } from '../../_types';

interface Props {
  user: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePassword: (userId: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export function DevChangePasswordModal({ user, isOpen, onClose, onUpdatePassword, isSubmitting }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return setError('Введите новый пароль');
    if (newPassword.length < 6) return setError('Пароль должен содержать минимум 6 символов');
    if (newPassword !== confirmPassword) return setError('Пароли не совпадают');

    setError(null);
    const res = await onUpdatePassword(user.id, newPassword);
    if (res.success) {
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Сменить пароль кассира</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-400">
          Пользователь: <span className="font-semibold text-white">{user.full_name || 'Кассир'}</span> ({user.id.slice(0, 8)}...)
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-2.5 text-xs text-rose-300 border border-rose-500/30">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Новый пароль (мин. 6 символов)</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              className="bg-slate-950 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Подтвердите новый пароль</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              className="bg-slate-950 border-slate-700 text-white"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting} className="border border-slate-700 text-slate-300 hover:bg-slate-800">
              Отмена
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              <span>Сохранить пароль</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

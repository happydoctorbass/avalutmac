'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '../ToastProvider';
import { KeyRound, ShieldCheck, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User | null;
}

export function DevAccountTab({ user }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { showToast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccessMsg('Ваш пароль успешно обновлен!');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Пароль текущего пользователя успешно изменен', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка обновления пароля';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Смена пароля текущего пользователя</h2>
            <p className="text-xs text-slate-400">
              Обновление учетных данных для аккаунта разработчика в Supabase Auth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="text-slate-300">
            Авторизован как:{' '}
            <span className="font-mono font-bold text-white">{user?.email || 'developer'}</span>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-xs text-slate-300">
              Новый пароль (минимум 6 символов)
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-slate-700 bg-slate-950 text-white pl-9 font-mono"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password" className="text-xs text-slate-300">
              Подтвердите новый пароль
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-slate-700 bg-slate-950 text-white pl-9 font-mono"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2 text-xs shadow-lg shadow-amber-500/10"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              <span>Обновить мой пароль</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string, pass: string, name?: string) => Promise<void>;
  isSubmitting: boolean;
}

export function DevAddUserModal({ isOpen, onClose, onAdd, isSubmitting }: Props) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLogin = login.trim();
    if (!cleanLogin || !password) return setError('Логин и пароль обязательны');
    if (password.length < 6) return setError('Пароль должен содержать минимум 6 символов');

    // Automatically append @admiral.internal if no domain provided
    const formattedEmail = cleanLogin.includes('@')
      ? cleanLogin
      : `${cleanLogin}@admiral.internal`;

    setError(null);
    await onAdd(formattedEmail, password, fullName || cleanLogin);
    setLogin('');
    setPassword('');
    setFullName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Создать кассира (Admiral Casino)</h3>
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
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">ФИО кассира (Опционально)</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Иванов Иван"
              disabled={isSubmitting}
              className="bg-slate-950 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Логин</Label>
            <div className="relative flex items-center">
              <Input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="cashier1"
                required
                disabled={isSubmitting}
                className="bg-slate-950 border-slate-700 text-white font-mono"
              />
              {!login.includes('@') && login.length > 0 && (
                <span className="absolute right-3 text-[11px] font-mono text-slate-500 pointer-events-none">
                  @admiral.internal
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500">
              При сохранении автоматически добавляется <code className="text-amber-400">@admiral.internal</code>
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Пароль (мин. 6 знаков)</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              className="bg-slate-950 border-slate-700 text-white"
            />
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
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              <span>Создать кассира</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

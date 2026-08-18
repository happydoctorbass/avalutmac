'use client';

import React, { useState, useEffect } from 'react';
import { Profile } from '../../_types';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, Shield, RefreshCw, KeyRound, UserX, UserCheck } from 'lucide-react';
import { DevAddUserModal } from './DevAddUserModal';
import { DevChangePasswordModal } from './DevChangePasswordModal';
import { DevDeleteUserModal } from './DevDeleteUserModal';

interface Props {
  cashiers: Profile[];
  onAddUser: (email: string, pass: string, name?: string) => Promise<void>;
  onUpdatePassword: (userId: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  onDeleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  onRefresh: () => void;
  isLoading: boolean;
  isSubmitting: boolean;
}

export function DevUsersTab({
  cashiers,
  onAddUser,
  onUpdatePassword,
  onDeleteUser,
  onRefresh,
  isLoading,
  isSubmitting,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [passwordUser, setPasswordUser] = useState<Profile | null>(null);
  const [deleteUser, setDeleteUser] = useState<Profile | null>(null);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800/40" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-slate-900/60" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-amber-400" />
          <h2 className="text-base font-bold text-white">Список пользователей (кассиры / профили)</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Обновить список"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5 text-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>Новый кассир</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="py-3 pl-4 pr-3 font-semibold">Логин / ФИО</th>
              <th className="py-3 px-3 font-semibold">Роль</th>
              <th className="py-3 px-3 font-semibold">User ID</th>
              <th className="py-3 px-3 font-semibold">Дата создания</th>
              <th className="py-3 pr-4 pl-2 text-right font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {cashiers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                  Пользователей не найдено
                </td>
              </tr>
            ) : (
              cashiers.map((c) => {
                const displayName = c.full_name || 'Кассир';
                const isDev = c.role === 'developer';

                return (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 pl-4 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-xs border ${
                            isDev
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}
                        >
                          {isDev ? <Shield className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{displayName}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {displayName.includes('@')
                              ? displayName
                              : `${displayName.toLowerCase().replace(/\s+/g, '_')}@admiral.internal`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${
                          isDev
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        <span>{c.role}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-slate-400">{c.id.slice(0, 8)}...</td>
                    <td className="py-3 px-3 text-xs text-slate-400">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('ru-RU') : '---'}
                    </td>
                    <td className="py-3 pr-4 pl-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPasswordUser(c)}
                          className="h-8 px-2 text-xs text-slate-300 hover:text-amber-300 hover:bg-amber-500/10"
                          title="Сменить пароль"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span className="hidden md:inline ml-1">Пароль</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteUser(c)}
                          className="h-8 px-2 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          title="Деактивировать / Удалить кассира"
                        >
                          <UserX className="h-3.5 w-3.5" />
                          <span className="hidden md:inline ml-1">Удалить</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <DevAddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddUser}
        isSubmitting={isSubmitting}
      />

      <DevChangePasswordModal
        user={passwordUser}
        isOpen={!!passwordUser}
        onClose={() => setPasswordUser(null)}
        onUpdatePassword={async (uid, pass) => {
          const res = await onUpdatePassword(uid, pass);
          if (res.success) onRefresh();
          return res;
        }}
        isSubmitting={isSubmitting}
      />

      <DevDeleteUserModal
        user={deleteUser}
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirmDelete={async (uid) => {
          const res = await onDeleteUser(uid);
          if (res.success) onRefresh();
          return res;
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

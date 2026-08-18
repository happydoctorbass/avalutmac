'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthRole } from './_hooks';
import { AdminNavbar } from './_components';
import { ToastProvider } from './_components/ToastProvider';
import { Loader2, AlertTriangle, LogOut, ArrowLeft, ShieldPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExchangeRatesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user, profile, isLoading, error, signOut, createDevProfile } = useAuthRole();
  const [isCreatingDev, setIsCreatingDev] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isProtected =
    pathname.startsWith('/exchange-rates/admin') ||
    pathname.startsWith('/exchange-rates/dev');

  const handleCreateDev = async () => {
    setIsCreatingDev(true);
    try {
      await createDevProfile();
    } finally {
      setIsCreatingDev(false);
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--text-light)] antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {isProtected && mounted && profile && (
          <AdminNavbar profile={profile} onSignOut={signOut} />
        )}

        {isProtected && (!mounted || (isLoading && !profile)) ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            <p className="text-xs text-slate-400 font-mono tracking-wide">Проверка прав доступа...</p>
          </div>
        ) : isProtected && error && !profile ? (
          <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-md text-slate-100 space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Ошибка доступа к профилю</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{error}</p>

              {user && !profile && (
                <div className="pt-2">
                  <Button
                    onClick={handleCreateDev}
                    disabled={isCreatingDev}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2 text-xs py-2.5 shadow-lg shadow-amber-500/20"
                  >
                    {isCreatingDev ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldPlus className="h-4 w-4" />
                    )}
                    <span>Создать профиль разработчика</span>
                  </Button>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    ({user.email})
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                  className="w-full sm:w-auto border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 gap-2 text-xs"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Выйти</span>
                </Button>
                <Link
                  href="/exchange-rates"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition border border-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>К табло курсов</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </ToastProvider>
  );
}

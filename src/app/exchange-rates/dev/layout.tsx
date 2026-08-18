'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthRole } from '../_hooks';
import { Loader2 } from 'lucide-react';

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { profile, isLoading } = useAuthRole();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!profile || profile.role !== 'developer') {
        router.replace('/exchange-rates/admin');
      }
    }
  }, [mounted, profile, isLoading, router]);

  if (!mounted || isLoading || !profile || profile.role !== 'developer') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-slate-950 text-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <p className="text-xs text-slate-400 font-mono tracking-wide">Проверка прав разработчика...</p>
      </div>
    );
  }

  return <>{children}</>;
}

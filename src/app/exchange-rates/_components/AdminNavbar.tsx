'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, Terminal, Eye, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '../_types';

interface AdminNavbarProps {
  profile: Profile | null;
  onSignOut: () => void;
}

export function AdminNavbar({ profile, onSignOut }: AdminNavbarProps) {
  const pathname = usePathname();
  const role = profile?.role;
  const isDev = role === 'developer';

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/exchange-rates" className="flex items-center gap-2 font-bold text-white hover:text-amber-400 transition text-sm">
            <Shield className="h-4 w-4 text-amber-400" />
            <span>Admiral Casino</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/exchange-rates/admin"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                pathname === '/exchange-rates/admin'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Кассир</span>
            </Link>
            {isDev && (
              <Link
                href="/exchange-rates/dev"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  pathname === '/exchange-rates/dev'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Dev</span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/exchange-rates"
            target="_blank"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Табло</span>
          </Link>
          <span
            className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold border ${
              isDev
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
            }`}
          >
            {isDev ? 'Developer' : 'Кассир'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="h-8 gap-1.5 px-2.5 text-xs text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}

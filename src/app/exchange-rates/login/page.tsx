'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Lock, ArrowLeft, Loader2, AlertCircle, LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STORAGE_PROFILE_KEY = 'ex_cached_profile';
const STORAGE_ROLE_KEY = 'ex_cached_role';

async function fetchOrInitProfile(userId: string, email?: string, token?: string) {
  try {
    // 1. Check profiles
    const { data: prof } = await supabase
      .from('profiles')
      .select('id, role, full_name, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (prof?.role) return prof;

    // 2. Fallback table
    const fallback = await supabase
      .from('ex_profiles')
      .select('id, role, full_name, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (fallback?.data?.role) return fallback.data;

    // 3. Auto-init profile via API
    const res = await fetch('/exchange-rates/api/init-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userId, email }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.profile?.role) {
        return json.profile;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function cacheProfileLocally(profile: { id: string; role: string; [k: string]: unknown }) {
  try {
    const str = JSON.stringify(profile);
    sessionStorage.setItem(STORAGE_PROFILE_KEY, str);
    sessionStorage.setItem(STORAGE_ROLE_KEY, profile.role);
    localStorage.setItem(STORAGE_PROFILE_KEY, str);
    localStorage.setItem(STORAGE_ROLE_KEY, profile.role);
  } catch {
    // Ignore storage issues
  }
}

export default function ExchangeRatesLoginPage() {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkExistingSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const prof = await fetchOrInitProfile(
            session.user.id,
            session.user.email,
            session.access_token
          );

          if (isMounted && prof?.role) {
            cacheProfileLocally(prof);
            if (prof.role === 'developer') {
              router.replace('/exchange-rates/dev');
              return;
            } else if (prof.role === 'cashier') {
              router.replace('/exchange-rates/admin');
              return;
            }
          }
        }
      } catch {
        // Continue to login
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    }

    checkExistingSession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = loginInput.trim();
    if (!cleanInput || !password) return;
    setIsLoading(true);
    setErrorMsg(null);

    // If username is entered without @, automatically append @admiral.internal
    const formattedEmail = cleanInput.includes('@')
      ? cleanInput
      : `${cleanInput}@admiral.internal`;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const prof = await fetchOrInitProfile(
          data.user.id,
          data.user.email || formattedEmail,
          data.session?.access_token
        );

        if (prof?.role) {
          cacheProfileLocally(prof);
          if (prof.role === 'developer') {
            router.push('/exchange-rates/dev');
          } else {
            router.push('/exchange-rates/admin');
          }
        } else {
          setErrorMsg('Роль пользователя не найдена. Обратитесь к разработчику.');
        }
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Ошибка авторизации. Проверьте логин и пароль.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceSignOut = async () => {
    setIsLoading(true);
    try {
      sessionStorage.clear();
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      localStorage.removeItem(STORAGE_ROLE_KEY);
      await supabase.auth.signOut();
      setErrorMsg(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md">
        <Link
          href="/exchange-rates"
          className="mb-6 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Вернуться к табло курсов</span>
        </Link>
        <Card className="border-slate-800 bg-slate-900 shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md">
              <Lock className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold text-white">Вход в систему</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Admiral Casino — Панель управления курсами (RBAC)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <div className="mb-4 space-y-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
                <div className="pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleForceSignOut}
                    disabled={isLoading}
                    className="w-full border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 gap-1.5 text-xs"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Сбросить сессию (Sign Out)</span>
                  </Button>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login" className="text-xs text-slate-300">Логин</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="cashier1"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="username"
                  className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 font-mono"
                />
                <p className="text-[10px] text-slate-500">
                  Для кассиров достаточно указать логин (например, <code className="text-amber-400">cashier1</code>)
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-slate-300">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus-visible:ring-amber-500"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-lg shadow-amber-500/10"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Войти'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

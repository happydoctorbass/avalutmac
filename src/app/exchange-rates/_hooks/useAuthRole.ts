'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Profile, UserRole } from '../_types';
import type { User } from '@supabase/supabase-js';

const STORAGE_PROFILE_KEY = 'ex_cached_profile';
const STORAGE_ROLE_KEY = 'ex_cached_role';

function getCachedProfile(): Profile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_PROFILE_KEY) || localStorage.getItem(STORAGE_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.id && parsed.role) {
      return parsed as Profile;
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedProfile(profile: Profile | null) {
  if (typeof window === 'undefined') return;
  try {
    if (profile && profile.id && profile.role) {
      const json = JSON.stringify(profile);
      sessionStorage.setItem(STORAGE_PROFILE_KEY, json);
      sessionStorage.setItem(STORAGE_ROLE_KEY, profile.role);
      localStorage.setItem(STORAGE_PROFILE_KEY, json);
      localStorage.setItem(STORAGE_ROLE_KEY, profile.role);
    } else {
      sessionStorage.removeItem(STORAGE_PROFILE_KEY);
      sessionStorage.removeItem(STORAGE_ROLE_KEY);
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      localStorage.removeItem(STORAGE_ROLE_KEY);
    }
  } catch {
    // Ignore storage quota or access errors
  }
}

export function useAuthRole() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const checkingRef = useRef(false);

  const fetchProfile = useCallback(
    async (userId: string, userEmail?: string, token?: string): Promise<Profile | null> => {
      try {
        // 1. Primary: query public.profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('id, role, full_name, created_at, updated_at')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data && data.role) {
          return data as Profile;
        }

        // 2. Query fallback table ex_profiles
        const fallback = await supabase
          .from('ex_profiles')
          .select('id, role, full_name, created_at, updated_at')
          .eq('id', userId)
          .maybeSingle();

        if (fallback.data && fallback.data.role) {
          return fallback.data as Profile;
        }

        // 3. Auto-provision profile via API if not found in database
        try {
          const res = await fetch('/exchange-rates/api/init-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ userId, email: userEmail }),
          });

          if (res.ok) {
            const result = await res.json();
            if (result.success && result.profile) {
              return result.profile as Profile;
            }
          }
        } catch (apiErr) {
          console.warn('init-profile API call warning:', apiErr);
        }

        return null;
      } catch (err) {
        console.warn('fetchProfile error:', err);
        return null;
      }
    },
    []
  );

  const checkAccess = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;

    try {
      const isLogin = pathname === '/exchange-rates/login';
      const isPublic = pathname === '/exchange-rates' || pathname === '/exchange-rates/';
      const isAdmin = pathname.startsWith('/exchange-rates/admin');
      const isDev = pathname.startsWith('/exchange-rates/dev');

      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      const token = session?.access_token;
      setUser(currentUser);

      // Public board doesn't require auth
      if (isPublic) {
        if (currentUser) {
          const prof = await fetchProfile(currentUser.id, currentUser.email, token);
          if (prof) {
            setProfile(prof);
            setCachedProfile(prof);
          }
        }
        setIsLoading(false);
        setAuthError(null);
        return;
      }

      // Login page handling
      if (isLogin) {
        if (currentUser) {
          let prof = await fetchProfile(currentUser.id, currentUser.email, token);
          if (!prof) prof = getCachedProfile();

          if (prof) {
            setProfile(prof);
            setCachedProfile(prof);
            if (prof.role === 'developer') {
              router.replace('/exchange-rates/dev');
            } else if (prof.role === 'cashier') {
              router.replace('/exchange-rates/admin');
            }
          }
        }
        setIsLoading(false);
        setAuthError(null);
        return;
      }

      // Protected routes: /exchange-rates/admin and /exchange-rates/dev
      if (isAdmin || isDev) {
        if (!currentUser) {
          setCachedProfile(null);
          setProfile(null);
          setIsLoading(false);
          router.replace('/exchange-rates/login');
          return;
        }

        let prof = await fetchProfile(currentUser.id, currentUser.email, token);
        if (!prof) {
          const existingCached = getCachedProfile();
          if (existingCached && existingCached.id === currentUser.id) {
            prof = existingCached;
          }
        }

        if (!prof || !prof.role) {
          setAuthError('Не удалось определить роль пользователя. Проверьте права доступа.');
          setIsLoading(false);
          return;
        }

        setProfile(prof);
        setCachedProfile(prof);
        setAuthError(null);

        const role: UserRole = prof.role;

        // Strict RBAC: cashier is immediately redirected to /admin and CANNOT access /dev
        if (isDev && role !== 'developer') {
          router.replace('/exchange-rates/admin');
          setIsLoading(false);
          return;
        }

        if (isAdmin && role !== 'cashier' && role !== 'developer') {
          router.replace('/exchange-rates/login');
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
    } catch (err: unknown) {
      const cachedProf = getCachedProfile();
      if (!cachedProf) {
        setAuthError(err instanceof Error ? err.message : 'Ошибка проверки авторизации');
      }
      setIsLoading(false);
    } finally {
      checkingRef.current = false;
    }
  }, [pathname, router, fetchProfile]);

  useEffect(() => {
    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        checkAccess();
      }
    });

    const handleFocus = () => {
      checkAccess();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAccess]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      setCachedProfile(null);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setAuthError(null);
      router.push('/exchange-rates/login');
    } finally {
      setIsLoading(false);
    }
  };

  const createDevProfile = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;

      if (!currentUser) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          role: 'developer',
          full_name: currentUser.email ? currentUser.email.split('@')[0] : 'Developer',
        })
        .select()
        .single();

      if (error) throw error;

      const newProf = data as Profile;
      setProfile(newProf);
      setCachedProfile(newProf);
      setAuthError(null);
      checkingRef.current = false;
      await checkAccess();
      return { success: true, profile: newProf };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Не удалось создать профиль';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    profile,
    role: profile?.role,
    isLoading,
    error: authError,
    signOut,
    refetch: checkAccess,
    createDevProfile,
  };
}

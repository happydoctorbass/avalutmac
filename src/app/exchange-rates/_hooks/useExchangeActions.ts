'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '../_components/ToastProvider';

export function useExchangeActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const updateRate = async (rateId: string, currencyId: string, buyPrice: number, sellPrice: number, userId?: string) => {
    if (buyPrice < 0 || sellPrice < 0) {
      showToast('Цена не может быть отрицательной', 'error');
      return { success: false, error: 'Цена не может быть отрицательной' };
    }

    setIsSubmitting(true);
    try {
      let finalUserId = userId;
      if (!finalUserId) {
        const { data: authData } = await supabase.auth.getUser();
        finalUserId = authData.user?.id;
      }

      const payload = {
        buy_price: buyPrice,
        sell_price: sellPrice,
        updated_by: finalUserId || null,
        updated_at: new Date().toISOString(),
      };

      console.log('[useExchangeActions] updateRate starting:', { rateId, currencyId, payload, finalUserId });

      const { data, error } = rateId.startsWith('fb-')
        ? await supabase.from('exchange_rates').upsert({ currency_id: currencyId, ...payload }).select()
        : await supabase.from('exchange_rates').update(payload).eq('id', rateId).select();

      if (error) {
        console.error('[useExchangeActions] DB Error during updateRate:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          rateId,
          currencyId,
          payload,
        });
        throw error;
      }

      console.log('[useExchangeActions] updateRate success:', data);
      showToast('Курс успешно обновлен', 'success');
      return { success: true, data };
    } catch (err: unknown) {
      console.error('[useExchangeActions] Detailed error in updateRate:', err);
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Ошибка при сохранении курса';
      showToast(msg, 'error');
      return { success: false, error: msg, rawError: err };
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCurrency = async (data: {
    code: string;
    nameRu: string;
    nameEn: string;
    buyPrice: number;
    sellPrice: number;
    position?: number;
  }) => {
    if (data.buyPrice < 0 || data.sellPrice < 0) {
      showToast('Цена не может быть отрицательной', 'error');
      return { success: false, error: 'Цена не может быть отрицательной' };
    }

    setIsSubmitting(true);
    try {
      const { data: cur, error: cErr } = await supabase
        .from('currencies')
        .insert({
          code: data.code.toUpperCase().trim(),
          name_ru: data.nameRu.trim(),
          name_en: data.nameEn.trim(),
          position: data.position ?? 50,
        })
        .select()
        .single();

      if (cErr) {
        console.error('[useExchangeActions] DB Error inserting currency:', cErr);
        throw cErr;
      }

      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData.user?.id || null;

      const { error: rErr } = await supabase.from('exchange_rates').insert({
        currency_id: cur.id,
        buy_price: data.buyPrice,
        sell_price: data.sellPrice,
        updated_by: currentUserId,
      });

      if (rErr) {
        console.error('[useExchangeActions] DB Error inserting rate:', rErr);
        throw rErr;
      }

      showToast(`Валюта ${cur.code} успешно добавлена`, 'success');
      return { success: true, currency: cur };
    } catch (err: unknown) {
      console.error('[useExchangeActions] Detailed error in addCurrency:', err);
      const msg = err instanceof Error ? err.message : 'Ошибка при добавлении валюты';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCurrencyPosition = async (currencyId: string, position: number) => {
    try {
      const { error } = await supabase.from('currencies').update({ position }).eq('id', currencyId);
      if (error) throw error;
      showToast('Позиция обновлена', 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка обновления позиции';
      showToast(msg, 'error');
      return { success: false };
    }
  };

  const getAuthToken = async () => {
    let { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      const refreshed = await supabase.auth.refreshSession();
      session = refreshed.data.session;
    }
    return session?.access_token;
  };

  const createCashierUser = async (email: string, pass: string, name?: string) => {
    setIsSubmitting(true);
    try {
      const token = await getAuthToken();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/exchange-rates/users', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password: pass, fullName: name, role: 'cashier' }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Ошибка создания пользователя');
      }

      showToast(`Кассир ${email} успешно создан`, 'success');
      return { success: true, user: data.user };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка создания кассира';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCashierPassword = async (userId: string, newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      showToast('Пароль должен содержать минимум 6 символов', 'error');
      return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
    }

    setIsSubmitting(true);
    try {
      const token = await getAuthToken();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/exchange-rates/users', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ userId, password: newPassword }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Ошибка смены пароля');
      }

      showToast('Пароль кассира успешно обновлен', 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка смены пароля';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCashierUser = async (userId: string) => {
    setIsSubmitting(true);
    try {
      const token = await getAuthToken();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/exchange-rates/users', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Ошибка удаления кассира');
      }

      showToast('Кассир успешно деактивирован / удален', 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка удаления кассира';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSingleLog = async (logId: string) => {
    setIsSubmitting(true);
    try {
      const token = await getAuthToken();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/exchange-rates/logs?id=${encodeURIComponent(logId)}`, {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast('Запись аудита удалена', 'success');
          return { success: true };
        }
      }

      // Fallback to direct client delete via RLS
      const { error: sbError } = await supabase.from('exchange_history').delete().eq('id', logId);
      if (sbError) throw sbError;

      showToast('Запись аудита удалена', 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при удалении записи аудита';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearAllAuditLogs = async () => {
    setIsSubmitting(true);
    try {
      const token = await getAuthToken();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/exchange-rates/logs?all=true', {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast('Вся история аудита успешно очищена', 'success');
          return { success: true };
        }
      }

      // Fallback to direct client delete via RLS
      const { error: sbError } = await supabase
        .from('exchange_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (sbError) throw sbError;

      showToast('Вся история аудита успешно очищена', 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при очистке истории аудита';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    updateRate,
    addCurrency,
    updateCurrencyPosition,
    createCashierUser,
    updateCashierPassword,
    deleteCashierUser,
    deleteSingleLog,
    clearAllAuditLogs,
    isSubmitting,
  };
}

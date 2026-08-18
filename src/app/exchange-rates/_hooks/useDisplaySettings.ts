'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface DisplaySettingsState {
  fontSizePercent: number;
  fontSizePx: number;
  scaleMultiplier: number;
  brandFontSizePx: number;
  brandFontSizePercent: number;
  dividerBrightness: number;
  dividerOpacity: number;
  tableBorderWidth: number;
  isLoading: boolean;
  error: string | null;
  updateFontSize: (percentOrPx: number) => Promise<{ success: boolean; error?: string }>;
  updateBrandFontSize: (sizePxOrPercent: number) => Promise<{ success: boolean; error?: string }>;
  updateDividerBrightness: (percent: number) => Promise<{ success: boolean; error?: string }>;
  updateTableBorderWidth: (widthPx: number) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_PERCENT = 100;
const BASE_PX = 24;
const DEFAULT_BRAND_PX = 44;
const DEFAULT_DIVIDER_BRIGHTNESS = 80;
const DEFAULT_BORDER_WIDTH = 1;

function parseFontSize(val: unknown): { percent: number; px: number; scale: number } {
  const num = typeof val === 'number' ? val : parseFloat(String(val || '100'));
  if (isNaN(num) || num <= 0) {
    return { percent: DEFAULT_PERCENT, px: BASE_PX, scale: 1.0 };
  }
  let percent = DEFAULT_PERCENT;
  let px = BASE_PX;
  if (num >= 50) {
    percent = Math.max(70, Math.min(220, Math.round(num)));
    px = Math.round((percent / 100) * BASE_PX);
  } else {
    px = Math.max(16, Math.min(52, Math.round(num)));
    percent = Math.round((px / BASE_PX) * 100);
  }
  return { percent, px, scale: percent / 100 };
}

function parseBrandFontSize(val: unknown): { px: number; percent: number } {
  const num = typeof val === 'number' ? val : parseFloat(String(val || '44'));
  if (isNaN(num) || num <= 0) return { px: DEFAULT_BRAND_PX, percent: 100 };
  if (num >= 50 && num <= 250) {
    const percent = Math.round(num);
    const px = Math.max(20, Math.min(80, Math.round((percent / 100) * DEFAULT_BRAND_PX)));
    return { px, percent };
  }
  const px = Math.max(20, Math.min(80, Math.round(num)));
  const percent = Math.round((px / DEFAULT_BRAND_PX) * 100);
  return { px, percent };
}

function parseDividerBrightness(val: unknown): number {
  const num = typeof val === 'number' ? val : parseInt(String(val || '80'), 10);
  if (isNaN(num) || num < 10) return DEFAULT_DIVIDER_BRIGHTNESS;
  return Math.max(10, Math.min(100, num));
}

function parseBorderWidth(val: unknown): number {
  const num = typeof val === 'number' ? val : parseInt(String(val || '1'), 10);
  if (isNaN(num) || num < 1) return DEFAULT_BORDER_WIDTH;
  return Math.max(1, Math.min(6, num));
}

export function useDisplaySettings(): DisplaySettingsState {
  const [percent, setPercent] = useState<number>(DEFAULT_PERCENT);
  const [px, setPx] = useState<number>(BASE_PX);
  const [scale, setScale] = useState<number>(1.0);
  const [brandPx, setBrandPx] = useState<number>(DEFAULT_BRAND_PX);
  const [brandPercent, setBrandPercent] = useState<number>(100);
  const [dividerBrightness, setDividerBrightness] = useState<number>(DEFAULT_DIVIDER_BRIGHTNESS);
  const [borderWidth, setBorderWidth] = useState<number>(DEFAULT_BORDER_WIDTH);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const applyFontSize = useCallback((val: unknown) => {
    const parsed = parseFontSize(val);
    setPercent(parsed.percent);
    setPx(parsed.px);
    setScale(parsed.scale);
  }, []);

  const applyBrandFontSize = useCallback((val: unknown) => {
    const parsed = parseBrandFontSize(val);
    setBrandPx(parsed.px);
    setBrandPercent(parsed.percent);
  }, []);

  const applyDividerBrightness = useCallback((val: unknown) => {
    setDividerBrightness(parseDividerBrightness(val));
  }, []);

  const applyBorderWidth = useCallback((val: unknown) => {
    setBorderWidth(parseBorderWidth(val));
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error: err } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['display_font_size', 'brand_font_size', 'divider_brightness', 'divider_opacity', 'table_border_width']);

      if (err) throw err;

      if (data && Array.isArray(data)) {
        for (const row of data) {
          if (row.key === 'display_font_size' && row.value) applyFontSize(row.value);
          else if (row.key === 'brand_font_size' && row.value) applyBrandFontSize(row.value);
          else if ((row.key === 'divider_brightness' || row.key === 'divider_opacity') && row.value) {
            applyDividerBrightness(row.value);
          } else if (row.key === 'table_border_width' && row.value) applyBorderWidth(row.value);
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки настроек');
    } finally {
      setIsLoading(false);
    }
  }, [applyFontSize, applyBrandFontSize, applyDividerBrightness, applyBorderWidth]);

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel('public:display_settings_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
        const newRow = payload.new as { key?: string; value?: string } | undefined;
        if (newRow?.key === 'display_font_size') applyFontSize(newRow.value);
        else if (newRow?.key === 'brand_font_size') applyBrandFontSize(newRow.value);
        else if (newRow?.key === 'divider_brightness' || newRow?.key === 'divider_opacity') {
          applyDividerBrightness(newRow.value);
        } else if (newRow?.key === 'table_border_width') applyBorderWidth(newRow.value);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSettings, applyFontSize, applyBrandFontSize, applyDividerBrightness, applyBorderWidth]);

  const updateFontSize = async (percentOrPx: number) => {
    try {
      const parsed = parseFontSize(percentOrPx);
      applyFontSize(parsed.percent);
      const { error: err } = await supabase.from('settings').upsert({
        key: 'display_font_size',
        value: String(parsed.percent),
      });
      if (err) throw err;
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка сохранения размера шрифта';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const updateBrandFontSize = async (sizePxOrPercent: number) => {
    try {
      const parsed = parseBrandFontSize(sizePxOrPercent);
      applyBrandFontSize(parsed.px);
      const { error: err } = await supabase.from('settings').upsert({
        key: 'brand_font_size',
        value: String(parsed.px),
      });
      if (err) throw err;
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка сохранения размера брендинга';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const updateDividerBrightness = async (brightness: number) => {
    try {
      const parsed = parseDividerBrightness(brightness);
      applyDividerBrightness(parsed);
      const { error: err } = await supabase.from('settings').upsert({
        key: 'divider_brightness',
        value: String(parsed),
      });
      if (err) throw err;
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка сохранения яркости разделителей';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const updateTableBorderWidth = async (widthPx: number) => {
    try {
      const parsed = parseBorderWidth(widthPx);
      applyBorderWidth(parsed);
      const { error: err } = await supabase.from('settings').upsert({
        key: 'table_border_width',
        value: String(parsed),
      });
      if (err) throw err;
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка сохранения толщины линий';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  return {
    fontSizePercent: percent,
    fontSizePx: px,
    scaleMultiplier: scale,
    brandFontSizePx: brandPx,
    brandFontSizePercent: brandPercent,
    dividerBrightness,
    dividerOpacity: dividerBrightness / 100,
    tableBorderWidth: borderWidth,
    isLoading,
    error,
    updateFontSize,
    updateBrandFontSize,
    updateDividerBrightness,
    updateTableBorderWidth,
  };
}

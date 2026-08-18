'use client';

import React, { useState, useEffect } from 'react';
import { useDisplaySettings } from '../../_hooks';
import { useToast } from '../ToastProvider';
import { Tv, Sliders, Check, Sparkles, RefreshCw, Eye, Crown, Sun, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencyFlag } from '../CurrencyFlag';

const SCALE_PRESETS = [
  { label: '80%', percent: 80 },
  { label: '100%', percent: 100 },
  { label: '140% (42" TV)', percent: 140, recommended: true },
  { label: '175%', percent: 175 },
  { label: '200%', percent: 200 },
];

const BRAND_FONT_PRESETS = [
  { label: '32px', px: 32 },
  { label: '44px (Стандарт)', px: 44 },
  { label: '52px (42" TV)', px: 52, recommended: true },
  { label: '64px (Большой)', px: 64 },
];

const BRIGHTNESS_PRESETS = [
  { label: '40% Приглушенная', percent: 40 },
  { label: '65% Мягкая', percent: 65 },
  { label: '80% Оптимальная', percent: 80, recommended: true },
  { label: '100% Яркая', percent: 100 },
];

const BORDER_PRESETS = [
  { label: '1px Тонкая', width: 1 },
  { label: '2px Премиум', width: 2, recommended: true },
  { label: '3px Акцент', width: 3 },
  { label: '4px Плотная', width: 4 },
];

export function DevDisplayTab() {
  const {
    fontSizePercent,
    scaleMultiplier,
    brandFontSizePx,
    dividerBrightness,
    tableBorderWidth,
    updateFontSize,
    updateBrandFontSize,
    updateDividerBrightness,
    updateTableBorderWidth,
    isLoading,
  } = useDisplaySettings();

  const [scaleSlider, setScaleSlider] = useState<number>(fontSizePercent);
  const [brandSlider, setBrandSlider] = useState<number>(brandFontSizePx);
  const [dividerSlider, setDividerSlider] = useState<number>(dividerBrightness);
  const [borderSlider, setBorderSlider] = useState<number>(tableBorderWidth);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setScaleSlider(fontSizePercent);
  }, [fontSizePercent]);

  useEffect(() => {
    setBrandSlider(brandFontSizePx);
  }, [brandFontSizePx]);

  useEffect(() => {
    setDividerSlider(dividerBrightness);
  }, [dividerBrightness]);

  useEffect(() => {
    setBorderSlider(tableBorderWidth);
  }, [tableBorderWidth]);

  const handleApplyAll = async () => {
    setIsSaving(true);
    try {
      const res1 = await updateFontSize(scaleSlider);
      const res2 = await updateBrandFontSize(brandSlider);
      const res3 = await updateDividerBrightness(dividerSlider);
      const res4 = await updateTableBorderWidth(borderSlider);

      if (res1.success && res2.success && res3.success && res4.success) {
        showToast('Параметры дизайна табло сохранены в Realtime!', 'success');
      } else {
        showToast(res1.error || res2.error || res3.error || res4.error || 'Ошибка сохранения', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const previewScale = scaleSlider / 100;
  const previewPriceFontSize = `${Math.round(36 * previewScale)}px`;
  const previewCodeFontSize = `${Math.round(26 * previewScale)}px`;
  const previewDividerOpacity = Math.max(0.15, Math.min(1, dividerSlider / 100));

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Tv className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Управление дизайном Admiral Casino</h2>
              <p className="text-xs text-slate-400">
                Синхронизация через таблицу <code className="text-amber-300 font-mono">public.settings</code> (Realtime)
              </p>
            </div>
          </div>
          <a
            href="/exchange-rates"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Открыть табло</span>
          </a>
        </div>

        {/* Current Values Display */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Масштаб:</span>
            <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {fontSizePercent}% (x{scaleMultiplier.toFixed(2)})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Шрифт Брендинга:</span>
            <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
              {brandFontSizePx}px
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Яркость линий:</span>
            <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {dividerBrightness}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Толщина линий:</span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {tableBorderWidth}px
            </span>
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-6">
        {/* Control 1: Rates Font Scale */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="scale-slider" className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sliders className="h-4 w-4 text-amber-400" />
              <span>1. Масштаб курсов валют ({scaleSlider}%)</span>
            </label>
            <span className="text-xs font-mono text-slate-400">70% – 200%</span>
          </div>
          <input
            id="scale-slider"
            type="range"
            min={70}
            max={200}
            step={5}
            value={scaleSlider}
            onChange={(e) => setScaleSlider(parseInt(e.target.value, 10))}
            disabled={isLoading || isSaving}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {SCALE_PRESETS.map((p) => (
              <button
                key={p.percent}
                type="button"
                onClick={() => setScaleSlider(p.percent)}
                className={`p-2 rounded-lg border text-xs font-semibold transition ${
                  scaleSlider === p.percent
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Control 2: Dominant Header Font Size */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label htmlFor="brand-slider" className="flex items-center gap-2 text-sm font-semibold text-white">
              <Crown className="h-4 w-4 text-amber-400" />
              <span>2. Размер главного заголовка &quot;КУРСЫ ВАЛЮТ&quot; ({brandSlider}px)</span>
            </label>
            <span className="text-xs font-mono text-slate-400">24px – 72px</span>
          </div>
          <input
            id="brand-slider"
            type="range"
            min={24}
            max={72}
            step={2}
            value={brandSlider}
            onChange={(e) => setBrandSlider(parseInt(e.target.value, 10))}
            disabled={isLoading || isSaving}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {BRAND_FONT_PRESETS.map((bp) => (
              <button
                key={bp.px}
                type="button"
                onClick={() => setBrandSlider(bp.px)}
                className={`p-2 rounded-lg border text-xs font-semibold transition ${
                  brandSlider === bp.px
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                {bp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Control 3: Divider Brightness */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label htmlFor="divider-slider" className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sun className="h-4 w-4 text-amber-400" />
              <span>3. Яркость разделительных линий ({dividerSlider}%)</span>
            </label>
            <span className="text-xs font-mono text-slate-400">10% – 100%</span>
          </div>
          <input
            id="divider-slider"
            type="range"
            min={10}
            max={100}
            step={5}
            value={dividerSlider}
            onChange={(e) => setDividerSlider(parseInt(e.target.value, 10))}
            disabled={isLoading || isSaving}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {BRIGHTNESS_PRESETS.map((dp) => (
              <button
                key={dp.percent}
                type="button"
                onClick={() => setDividerSlider(dp.percent)}
                className={`p-2 rounded-lg border text-xs font-semibold transition ${
                  dividerSlider === dp.percent
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                {dp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Control 4: Table Border Width */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label htmlFor="border-slider" className="flex items-center gap-2 text-sm font-semibold text-white">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>4. Толщина линий таблицы ({borderSlider}px)</span>
            </label>
            <span className="text-xs font-mono text-slate-400">1px – 5px</span>
          </div>
          <input
            id="border-slider"
            type="range"
            min={1}
            max={5}
            step={1}
            value={borderSlider}
            onChange={(e) => setBorderSlider(parseInt(e.target.value, 10))}
            disabled={isLoading || isSaving}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {BORDER_PRESETS.map((br) => (
              <button
                key={br.width}
                type="button"
                onClick={() => setBorderSlider(br.width)}
                className={`p-2 rounded-lg border text-xs font-semibold transition ${
                  borderSlider === br.width
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                {br.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setScaleSlider(fontSizePercent);
              setBrandSlider(brandFontSizePx);
              setDividerSlider(dividerBrightness);
              setBorderSlider(tableBorderWidth);
            }}
            disabled={isSaving}
            className="text-xs text-slate-400 hover:text-white"
          >
            Сбросить
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApplyAll}
            disabled={isSaving}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5 text-xs shadow-lg shadow-amber-500/10"
          >
            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            <span>Сохранить настройки табло</span>
          </Button>
        </div>
      </div>

      {/* Live Interactive Preview Card */}
      <div className="rounded-xl border border-slate-800 bg-[#030712] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Eye className="h-4 w-4 text-amber-400" />
            <span>Интерактивное превью главного табло</span>
          </div>
          <span className="text-[11px] font-mono text-white font-bold">Admiral Casino</span>
        </div>

        {/* Live Brand Header Preview */}
        <div className="text-center py-5 rounded-xl border border-white/20 bg-slate-950/40 relative overflow-hidden flex flex-col items-center justify-center">
          {/* ADMIRAL CASINO strictly between two horizontal divider lines */}
          <div className="flex flex-col items-center justify-center gap-1.5 mb-2">
            <div
              style={{ opacity: previewDividerOpacity }}
              className="flex items-center justify-center gap-3 transition-opacity duration-300"
            >
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400/80 to-amber-400" />
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-amber-400" />
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-amber-400/80 to-amber-400" />
            </div>

            <div className="text-xs font-bold tracking-[0.32em] uppercase text-amber-300/90 select-none py-0.5">
              ADMIRAL CASINO
            </div>

            <div
              style={{ opacity: previewDividerOpacity }}
              className="flex items-center justify-center gap-3 transition-opacity duration-300"
            >
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400/80 to-amber-400" />
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-amber-400" />
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-amber-400/80 to-amber-400" />
            </div>
          </div>

          {/* Dominant Main Cycling Title Preview */}
          <h1
            style={{ fontSize: `${brandSlider}px` }}
            className="font-extrabold tracking-[0.2em] uppercase leading-tight text-white select-none mt-1"
          >
            КУРСЫ ВАЛЮТ
          </h1>
        </div>

        {/* Live Table Row Preview */}
        <div className="w-full overflow-hidden rounded-xl border border-white/20 bg-slate-950/60 p-4 relative">
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/30 via-amber-400/30 to-transparent pointer-events-none" />
          <div
            style={{
              borderBottomWidth: `${borderSlider}px`,
              borderBottomStyle: 'solid',
            }}
            className="flex items-center justify-between py-4 border-white/20 transition-all"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <CurrencyFlag code="USD" size="tv" />
              <div>
                <div
                  style={{ fontSize: previewCodeFontSize }}
                  className="font-extrabold text-white leading-none font-sans"
                >
                  USD
                </div>
                <div className="text-xs text-slate-400 mt-1">Доллар США</div>
              </div>
            </div>
            <div className="text-right">
              <div
                style={{ fontSize: previewPriceFontSize }}
                className="font-bold tabular-nums font-mono text-emerald-400 leading-none"
              >
                87,50
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 font-medium">Покупка</div>
            </div>
            <div className="text-right">
              <div
                style={{ fontSize: previewPriceFontSize }}
                className="font-bold tabular-nums font-mono text-amber-400 leading-none"
              >
                88,00
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 font-medium">Продажа</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

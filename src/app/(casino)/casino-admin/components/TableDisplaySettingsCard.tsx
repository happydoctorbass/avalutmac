'use client';

import {
  CasinoSettings,
  DEFAULT_TABLE_DISPLAY,
  FlagSize,
  TableDisplaySettings,
} from '@/types/match';
import { normalizeColWidths, computeTableRowFillScale } from '@/lib/table-display-settings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function SliderRow({
  label,
  hint,
  value,
  min,
  max,
  step = 0.05,
  unit = '',
  onChange,
  onReset,
  defaultValue,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  onReset?: number;
  defaultValue?: number;
}) {
  const resetVal = onReset ?? defaultValue;
  return (
    <div className="grid gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="min-w-[3.5rem] text-right text-sm font-mono font-semibold text-amber-500">
            {value.toFixed(step < 1 ? 2 : 0)}
            {unit}
          </span>
          {resetVal !== undefined && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onChange(resetVal)}
            >
              ↺
            </Button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-amber-500"
      />
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-amber-500/20 bg-card/40 p-4">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-amber-500">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function FlagSizeSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: FlagSize;
  onChange: (v: FlagSize) => void;
}) {
  return (
    <div className="grid gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-3">
      <Label className="text-sm font-medium">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FlagSize)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="sm">Маленький (sm)</option>
        <option value="md">Средний (md)</option>
        <option value="lg">Большой (lg)</option>
        <option value="xl">Очень большой (xl)</option>
      </select>
    </div>
  );
}

export function TableDisplaySettingsCard({
  settings,
  onChange,
  disabled = false,
}: {
  settings: CasinoSettings;
  onChange: (s: CasinoSettings) => void;
  disabled?: boolean;
}) {
  const td = settings.tableDisplay;

  const patch = (partial: Partial<TableDisplaySettings>) => {
    if (disabled) return;
    onChange({
      ...settings,
      tableDisplay: { ...td, ...partial },
    });
  };

  const colSum =
    td.colDate + td.colTime + td.colMatch + td.colScore + td.colResult;

  const fillPreview2 = computeTableRowFillScale(2, td);
  const fillPreview6 = computeTableRowFillScale(6, td);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Настройки синхронизируются с табло <code className="text-amber-500">/casino-display-table</code> в реальном времени.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              onChange({ ...settings, tableDisplay: { ...DEFAULT_TABLE_DISPLAY } })
            }
          >
            Сбросить табло
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => window.open('/casino-display-table', '_blank')}
          >
            Открыть табло ↗
          </Button>
        </div>
      </div>

      <Section
        title="Колонки таблицы"
        description="Узкие колонки для даты/счёта — больше места для команд и флагов в центре."
      >
        <SliderRow
          label="Дата (%)"
          value={td.colDate}
          min={4}
          max={20}
          step={0.5}
          unit="%"
          defaultValue={DEFAULT_TABLE_DISPLAY.colDate}
          onChange={(v) => patch({ colDate: v })}
        />
        <SliderRow
          label="Время (%)"
          value={td.colTime}
          min={4}
          max={20}
          step={0.5}
          unit="%"
          defaultValue={DEFAULT_TABLE_DISPLAY.colTime}
          onChange={(v) => patch({ colTime: v })}
        />
        <SliderRow
          label="Матч — команды (%)"
          value={td.colMatch}
          min={40}
          max={75}
          step={0.5}
          unit="%"
          defaultValue={DEFAULT_TABLE_DISPLAY.colMatch}
          onChange={(v) => patch({ colMatch: v })}
        />
        <SliderRow
          label="Счёт (%)"
          value={td.colScore}
          min={5}
          max={20}
          step={0.5}
          unit="%"
          defaultValue={DEFAULT_TABLE_DISPLAY.colScore}
          onChange={(v) => patch({ colScore: v })}
        />
        <SliderRow
          label="Результат (%)"
          value={td.colResult}
          min={8}
          max={30}
          step={0.5}
          unit="%"
          defaultValue={DEFAULT_TABLE_DISPLAY.colResult}
          onChange={(v) => patch({ colResult: v })}
        />
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm">
          <span>
            Сумма колонок:{' '}
            <strong className={Math.abs(colSum - 100) > 0.5 ? 'text-red-400' : 'text-emerald-400'}>
              {colSum.toFixed(1)}%
            </strong>
          </span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => patch(normalizeColWidths(td))}
          >
            Нормализовать до 100%
          </Button>
        </div>
        <SliderRow
          label="Отступы ячеек"
          hint="Меньше — плотнее таблица, больше места для текста"
          value={td.tableCellPaddingScale}
          min={0.3}
          max={1.5}
          defaultValue={DEFAULT_TABLE_DISPLAY.tableCellPaddingScale}
          onChange={(v) => patch({ tableCellPaddingScale: v })}
        />
      </Section>

      <Section title="Таблица — шрифты" description="Названия стран, дата, время, счёт, заголовки.">
        <SliderRow
          label="Названия команд"
          value={td.tableTeamFontScale}
          min={0.6}
          max={2}
          defaultValue={DEFAULT_TABLE_DISPLAY.tableTeamFontScale}
          onChange={(v) => patch({ tableTeamFontScale: v })}
        />
        <SliderRow
          label="Дата / время / счёт / результат"
          value={td.tableMetaFontScale}
          min={0.6}
          max={2}
          defaultValue={DEFAULT_TABLE_DISPLAY.tableMetaFontScale}
          onChange={(v) => patch({ tableMetaFontScale: v })}
        />
        <SliderRow
          label="Заголовки колонок"
          value={td.tableHeaderFontScale}
          min={0.6}
          max={2}
          defaultValue={DEFAULT_TABLE_DISPLAY.tableHeaderFontScale}
          onChange={(v) => patch({ tableHeaderFontScale: v })}
        />
        <FlagSizeSelect
          label="Размер флагов в таблице"
          value={td.tableFlagSize}
          onChange={(v) => patch({ tableFlagSize: v })}
        />
        <SliderRow
          label="Масштаб флагов в таблице"
          value={td.tableFlagScale}
          min={0.5}
          max={2.5}
          defaultValue={DEFAULT_TABLE_DISPLAY.tableFlagScale}
          onChange={(v) => patch({ tableFlagScale: v })}
        />
      </Section>

      <Section
        title="Заполнение таблицы"
        description="Меньше строк на экране — крупнее шрифты, флаги и отступы, чтобы занять свободное место."
      >
        <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
          <input
            id="table-row-fill"
            type="checkbox"
            checked={td.tableRowFillEnabled}
            onChange={(e) => patch({ tableRowFillEnabled: e.target.checked })}
            className="h-4 w-4 accent-amber-500"
          />
          <Label htmlFor="table-row-fill" className="cursor-pointer text-sm font-medium">
            Автомасштаб по количеству строк
          </Label>
        </div>
        <SliderRow
          label="Эталон строк (масштаб 1×)"
          hint="При таком числе строк размер обычный. Меньше строк — крупнее."
          value={td.tableRowFillBaseline}
          min={3}
          max={12}
          step={1}
          defaultValue={DEFAULT_TABLE_DISPLAY.tableRowFillBaseline}
          onChange={(v) => patch({ tableRowFillBaseline: Math.round(v) })}
        />
        <SliderRow
          label="Максимальное увеличение"
          hint="Верхний предел масштаба при 1–2 строках"
          value={td.tableRowFillMaxScale}
          min={1}
          max={4}
          step={0.1}
          unit="×"
          defaultValue={DEFAULT_TABLE_DISPLAY.tableRowFillMaxScale}
          onChange={(v) => patch({ tableRowFillMaxScale: v })}
        />
        <div className="sm:col-span-2 rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm text-muted-foreground">
          Сейчас при <strong className="text-foreground">2 строках</strong> →{' '}
          <strong className="text-emerald-400">×{fillPreview2.toFixed(1)}</strong>, при{' '}
          <strong className="text-foreground">6 строках</strong> →{' '}
          <strong className="text-emerald-400">×{fillPreview6.toFixed(1)}</strong>
        </div>
      </Section>

      <Section
        title="Главный блок (Live / Next match)"
        description="Активный матч сверху: команды, флаги, время, обратный отсчёт."
      >
        <SliderRow
          label="Названия команд"
          value={td.heroTeamFontScale}
          min={0.6}
          max={2}
          defaultValue={DEFAULT_TABLE_DISPLAY.heroTeamFontScale}
          onChange={(v) => patch({ heroTeamFontScale: v })}
        />
        <FlagSizeSelect
          label="Размер флагов"
          value={td.heroFlagSize}
          onChange={(v) => patch({ heroFlagSize: v })}
        />
        <SliderRow
          label="Масштаб флагов"
          value={td.heroFlagScale}
          min={0.5}
          max={2.5}
          defaultValue={DEFAULT_TABLE_DISPLAY.heroFlagScale}
          onChange={(v) => patch({ heroFlagScale: v })}
        />
        <SliderRow
          label="Время / счёт (центр)"
          value={td.heroCenterFontScale}
          min={0.5}
          max={2}
          defaultValue={DEFAULT_TABLE_DISPLAY.heroCenterFontScale}
          onChange={(v) => patch({ heroCenterFontScale: v })}
        />
        <SliderRow
          label="Бейдж Live / Next"
          value={td.heroBadgeFontScale}
          min={0.5}
          max={2}
          defaultValue={DEFAULT_TABLE_DISPLAY.heroBadgeFontScale}
          onChange={(v) => patch({ heroBadgeFontScale: v })}
        />
        <SliderRow
          label="Обратный отсчёт"
          value={td.heroCountdownFontScale}
          min={0.5}
          max={2}
          defaultValue={DEFAULT_TABLE_DISPLAY.heroCountdownFontScale}
          onChange={(v) => patch({ heroCountdownFontScale: v })}
        />
        <SliderRow
          label="Внутренние отступы блока"
          value={td.heroPaddingScale}
          min={0.5}
          max={1.5}
          defaultValue={DEFAULT_TABLE_DISPLAY.heroPaddingScale}
          onChange={(v) => patch({ heroPaddingScale: v })}
        />
        <SliderRow
          label="Расстояние между элементами"
          value={td.heroGapScale}
          min={0.4}
          max={1.5}
          defaultValue={DEFAULT_TABLE_DISPLAY.heroGapScale}
          onChange={(v) => patch({ heroGapScale: v })}
        />
      </Section>

      <Section title="Пагинация и экран">
        <div className="grid gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-3">
          <Label>Строк на странице</Label>
          <Input
            type="number"
            min={3}
            max={12}
            className="w-full"
            value={td.pageSize}
            onChange={(e) => patch({ pageSize: Math.max(3, Math.min(12, Number(e.target.value) || 6)) })}
          />
        </div>
        <SliderRow
          label="Смена страницы (сек)"
          value={td.pageIntervalSec}
          min={3}
          max={30}
          step={1}
          unit="с"
          defaultValue={DEFAULT_TABLE_DISPLAY.pageIntervalSec}
          onChange={(v) => patch({ pageIntervalSec: v })}
        />
        <div className="grid gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-3">
          <Label>Узкий экран (флаги сверху), px</Label>
          <Input
            type="number"
            min={480}
            max={1200}
            className="w-full"
            value={td.narrowBreakpoint}
            onChange={(e) =>
              patch({ narrowBreakpoint: Math.max(480, Math.min(1200, Number(e.target.value) || 768)) })
            }
          />
        </div>
        <SliderRow
          label="Безопасная зона (отступ от краёв)"
          value={td.safeInsetScale}
          min={0.5}
          max={2}
          defaultValue={DEFAULT_TABLE_DISPLAY.safeInsetScale}
          onChange={(v) => patch({ safeInsetScale: v })}
        />
      </Section>
    </div>
  );
}

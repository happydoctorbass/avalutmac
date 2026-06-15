import {
  CasinoSettings,
  DEFAULT_SETTINGS,
  DEFAULT_TABLE_DISPLAY,
  TableDisplaySettings,
} from '@/types/match';

export function mergeTableDisplay(
  partial?: Partial<TableDisplaySettings>,
): TableDisplaySettings {
  return { ...DEFAULT_TABLE_DISPLAY, ...partial };
}

export function mergeCasinoSettings(partial?: Partial<CasinoSettings>): CasinoSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...partial,
    tableDisplay: mergeTableDisplay(partial?.tableDisplay),
  };
}

export function colWidthsFromSettings(td: TableDisplaySettings): [number, number, number, number, number] {
  return [td.colDate, td.colTime, td.colMatch, td.colScore, td.colResult];
}

export function colWidthsCss(td: TableDisplaySettings): string {
  const [a, b, c, d, e] = colWidthsFromSettings(td);
  return `${a}% ${b}% ${c}% ${d}% ${e}%`;
}

export function normalizeColWidths(
  cols: Pick<TableDisplaySettings, 'colDate' | 'colTime' | 'colMatch' | 'colScore' | 'colResult'>,
): Pick<TableDisplaySettings, 'colDate' | 'colTime' | 'colMatch' | 'colScore' | 'colResult'> {
  const values = [cols.colDate, cols.colTime, cols.colMatch, cols.colScore, cols.colResult];
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum <= 0) return { ...DEFAULT_TABLE_DISPLAY };
  const scale = 100 / sum;
  return {
    colDate: Math.round(values[0] * scale * 10) / 10,
    colTime: Math.round(values[1] * scale * 10) / 10,
    colMatch: Math.round(values[2] * scale * 10) / 10,
    colScore: Math.round(values[3] * scale * 10) / 10,
    colResult: Math.round(values[4] * scale * 10) / 10,
  };
}

export function safeInsetCss(td: TableDisplaySettings): string {
  const s = td.safeInsetScale;
  return `clamp(${0.5 * s}rem, ${1.5 * s}vmin, ${1.25 * s}rem)`;
}

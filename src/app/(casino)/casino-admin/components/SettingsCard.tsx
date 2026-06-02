'use client';

import { CasinoSettings } from '@/types/match';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SettingsCard({
  settings,
  onChange,
}: {
  settings: CasinoSettings;
  onChange: (s: CasinoSettings) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="grid gap-2">
        <Label>Количество карточек (мин. 3)</Label>
        <Input
          type="number"
          inputMode="numeric"
          min={3}
          className="w-28"
          value={settings.cardCount}
          onChange={(e) => onChange({ ...settings, cardCount: Math.max(3, Number(e.target.value || 3)) })}
        />
      </div>
      <div className="grid gap-2">
        <Label>Размер карточки (scale)</Label>
        <Input
          type="number"
          step="0.05"
          min={0.2}
          className="w-28"
          value={settings.cardScale}
          onChange={(e) => onChange({ ...settings, cardScale: Math.max(0.2, Number(e.target.value || 1)) })}
        />
      </div>
      <div className="grid gap-2">
        <Label>Смена каждые (сек)</Label>
        <Input
          type="number"
          inputMode="numeric"
          min={2}
          className="w-28"
          value={settings.rotateInterval}
          onChange={(e) => onChange({ ...settings, rotateInterval: Math.max(2, Number(e.target.value || 15)) })}
        />
      </div>
      <label className="flex items-center gap-2 pb-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-amber-500"
          checked={settings.autoRotate}
          onChange={(e) => onChange({ ...settings, autoRotate: e.target.checked })}
        />
        Авто-вращение
      </label>
    </div>
  );
}

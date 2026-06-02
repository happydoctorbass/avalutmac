'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SettingsCard({
  settings,
  onChange,
}: {
  settings: { cardCount: number; cardScale: number };
  onChange: (s: { cardCount: number; cardScale: number }) => void;
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
    </div>
  );
}


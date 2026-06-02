'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CarouselControls({
  onPrev,
  onNext,
  disabled,
}: {
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" variant="secondary" size="icon" onClick={onPrev} disabled={disabled} aria-label="Назад">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button type="button" variant="secondary" size="icon" onClick={onNext} disabled={disabled} aria-label="Вперёд">
        <ChevronRight className="h-5 w-5" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Листайте карусель вручную. Ручное переключение снимает фокус с центральной карточки.
      </span>
    </div>
  );
}

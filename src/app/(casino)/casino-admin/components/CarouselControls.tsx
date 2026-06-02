'use client';

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CarouselControls({
  onPrev,
  onNext,
  isPlaying,
  onToggle,
  disabled,
}: {
  onPrev: () => void;
  onNext: () => void;
  isPlaying: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-1">
        <Button type="button" variant="ghost" size="icon" onClick={onPrev} disabled={disabled} aria-label="Назад">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onNext} disabled={disabled} aria-label="Вперёд">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <Button type="button" variant={isPlaying ? 'destructive' : 'default'} onClick={onToggle}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isPlaying ? 'Остановить' : 'Запустить'}
      </Button>

      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={`h-2.5 w-2.5 rounded-full ${isPlaying ? 'animate-pulse bg-green-500' : 'bg-muted-foreground/50'}`} />
        {isPlaying ? 'Карусель крутится' : 'Карусель на стопе'}
      </span>
    </div>
  );
}

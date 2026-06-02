'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DateTimeField({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = date ? new Date(`${date}T00:00:00`) : undefined;

  return (
    <>
      <div className="grid gap-2">
        <Label>Дата</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              className={cn('justify-start font-normal', !date && 'text-muted-foreground')}
            >
              <CalendarIcon className="h-4 w-4" />
              {selected ? format(selected, 'd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(d) => {
                if (d) onDateChange(format(d, 'yyyy-MM-dd'));
                setOpen(false);
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label>Время</Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </>
  );
}

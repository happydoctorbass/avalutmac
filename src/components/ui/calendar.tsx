'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-1', className)}
      classNames={{
        months: 'flex flex-col gap-2',
        month: 'flex flex-col gap-3',
        month_caption: 'flex justify-center items-center h-9 relative',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1 absolute inset-x-0 top-0 justify-between',
        button_previous:
          'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-transparent hover:bg-muted',
        button_next:
          'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-transparent hover:bg-muted',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-muted-foreground w-9 text-[0.7rem] font-normal',
        week: 'flex w-full mt-1',
        day: 'h-9 w-9 p-0 text-center text-sm',
        day_button:
          'h-9 w-9 rounded-md font-normal hover:bg-muted aria-selected:bg-primary aria-selected:text-primary-foreground',
        today: 'text-primary font-semibold',
        outside: 'text-muted-foreground/40',
        disabled: 'text-muted-foreground/30 opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

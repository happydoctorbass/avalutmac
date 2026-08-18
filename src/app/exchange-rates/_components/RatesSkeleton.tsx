'use client';

import React from 'react';

export function RatesSkeleton() {
  return (
    <div className="w-full space-y-6 py-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex min-h-[120px] items-center justify-between border-b border-white/20 py-6 px-4"
        >
          <div className="flex items-center gap-6 w-2/5">
            <div className="h-16 w-24 rounded-xl bg-slate-800/60" />
            <div className="space-y-2">
              <div className="h-7 w-20 rounded bg-slate-800/60" />
              <div className="h-4 w-28 rounded bg-slate-800/40" />
            </div>
          </div>
          <div className="flex items-center justify-end w-[30%] pr-8">
            <div className="h-10 w-32 rounded bg-slate-800/60" />
          </div>
          <div className="flex items-center justify-end w-[30%] pr-4">
            <div className="h-10 w-32 rounded bg-slate-800/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PriceBadgeProps {
  label: string;
  price: number;
  variant: 'buy' | 'sell';
}

function formatPrice(val: number): string {
  if (val >= 100) return val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (val >= 1) return val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return val.toLocaleString('ru-RU', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

export function PriceBadge({ label, price, variant }: PriceBadgeProps) {
  const isBuy = variant === 'buy';
  const prevPrice = useRef(price);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      prevPrice.current = price;
      return;
    }

    if (prevPrice.current !== price) {
      const dir = price > prevPrice.current ? 'up' : 'down';
      setFlash(dir);
      prevPrice.current = price;

      const timer = setTimeout(() => {
        setFlash(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [price]);

  const flashBg =
    flash === 'up'
      ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
      : flash === 'down'
      ? 'bg-rose-500/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
      : isBuy
      ? 'bg-[#0b1324]/80 border-blue-500/20 hover:border-blue-500/40'
      : 'bg-[#0b1324]/80 border-amber-500/20 hover:border-amber-500/40';

  return (
    <div className={`flex flex-col rounded-xl border p-3.5 transition-all duration-1000 ease-out ${flashBg}`}>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium tracking-wide uppercase">{label}</span>
        {flash && (
          <span className={`text-[10px] font-bold ${flash === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {flash === 'up' ? '▲' : '▼'}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <motion.span
          key={`badge-${price}`}
          initial={flash ? { scale: 1.1 } : false}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-black tracking-tight tabular-nums text-white"
        >
          {formatPrice(price)}
        </motion.span>
        <span className="text-xs font-semibold text-slate-500">KGS</span>
      </div>
    </div>
  );
}

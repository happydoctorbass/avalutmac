'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type AutoShrinkTextProps = {
  text: string;
  maxPx: number;
  minPx?: number;
  className?: string;
};

/** Уменьшает шрифт, пока текст не поместится в одну строку */
export function AutoShrinkText({ text, maxPx, minPx = 10, className = '' }: AutoShrinkTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(maxPx);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isMounted) return;
    
    const el = ref.current;
    if (!el) return;

    const adjustSize = () => {
      if (el.clientWidth === 0) return;

      // 1. Проверяем максимум
      el.style.fontSize = `${maxPx}px`;
      if (el.scrollWidth <= el.clientWidth + 1) {
        setSize(maxPx);
        return;
      }

      // 2. Бинарный поиск подходящего размера для минимизации reflow
      let low = minPx;
      let high = maxPx;
      let best = minPx;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        el.style.fontSize = `${mid}px`;
        
        if (el.scrollWidth <= el.clientWidth + 1) {
          best = mid;
          low = mid + 1; // Пробуем увеличить шрифт
        } else {
          high = mid - 1; // Шрифт слишком большой, уменьшаем
        }
      }

      // 3. Применяем лучший найденный размер
      el.style.fontSize = `${best}px`;
      setSize(best);
    };

    // Первичный расчет
    adjustSize();

    // Следим только за изменением ширины контейнера, чтобы избежать петель ResizeObserver
    if (typeof ResizeObserver === 'undefined') return;

    let lastWidth = el.clientWidth;
    const observer = new ResizeObserver(() => {
      const newWidth = el.clientWidth;
      if (newWidth !== lastWidth && newWidth > 0) {
        lastWidth = newWidth;
        adjustSize();
      }
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [text, maxPx, minPx, isMounted]);

  if (!isMounted) {
    return (
      <span className={`block min-w-0 overflow-hidden whitespace-nowrap opacity-0 ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={`block min-w-0 overflow-hidden whitespace-nowrap ${className}`}
      style={{ fontSize: `${size}px` }}
      title={text}
    >
      {text}
    </span>
  );
}

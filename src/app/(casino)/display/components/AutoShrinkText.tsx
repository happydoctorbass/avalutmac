'use client';

import { useLayoutEffect, useRef, useState } from 'react';

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

  useLayoutEffect(() => {
    setSize(maxPx);
  }, [text, maxPx]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth + 1 && size > minPx) {
      setSize((s) => s - 1);
    }
  }, [size, text, minPx]);

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

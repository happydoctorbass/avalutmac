'use client';

import { useEffect, useState } from 'react';

export function useViewportWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

/** Масштаб 1.0 на широких экранах, плавно до ~0.55 на узких */
export function useDisplayScale(baseWidth = 1280) {
  const vw = useViewportWidth();
  return Math.min(1, Math.max(0.55, vw / baseWidth));
}

export function heroTeamMaxPx(vw: number) {
  if (vw < 400) return 20;
  if (vw < 560) return 28;
  if (vw < 768) return 38;
  if (vw < 1024) return 54;
  if (vw < 1280) return 70;
  return 88;
}

export function tableTeamMaxPx(vw: number) {
  if (vw < 400) return 11;
  if (vw < 560) return 13;
  if (vw < 768) return 16;
  if (vw < 1024) return 22;
  if (vw < 1280) return 28;
  return 36;
}

/** Below this width: flags stack above team names in hero + table */
export const DISPLAY_NARROW_BREAKPOINT = 768;

export function isDisplayNarrow(vw: number) {
  return vw < DISPLAY_NARROW_BREAKPOINT;
}

/** Small invisible safe-area inset on all sides (vmin scales with LED / portrait) */
export const DISPLAY_SAFE_INSET = 'clamp(0.5rem, 1.5vmin, 1.25rem)';

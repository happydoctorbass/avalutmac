'use client';

import { Match, CasinoSettings } from '@/types/match';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchCard } from './MatchCard';

interface MatchCarouselProps {
  matches: Match[];
  focusMatchId?: string | null;
  settings?: Partial<CasinoSettings>;
  currentIndex?: number;
  onNext?: () => void;
}

export function MatchCarousel({ matches, focusMatchId, settings, currentIndex = 0, onNext }: MatchCarouselProps) {
  const count = Math.max(3, Number(settings?.cardCount || 5));
  const baseScale = settings?.cardScale || 1.0;
  const interval = Math.max(2, Number(settings?.rotateInterval ?? 15));
  const autoRotate = settings?.autoRotate ?? true;

  const promoMatches: Match[] = Array(15)
    .fill(null)
    .map((_, i) => ({ id: `promo-${i}`, sportType: 'football', team1: 'ADMIRAL', team2: 'CASINO', time: '' }));

  const baseMatches = matches?.length ? matches : [];
  const safeMatches: Match[] =
    baseMatches.length >= count
      ? baseMatches
      : [...baseMatches, ...promoMatches].slice(0, Math.max(count, baseMatches.length));

  const len = safeMatches.length || 1;

  // Effective center: focused match wins, otherwise the shared current index (wrapped)
  const focusIdx = focusMatchId ? safeMatches.findIndex((m) => m.id === focusMatchId) : -1;
  const centerIndex = focusIdx !== -1 ? focusIdx : ((currentIndex % len) + len) % len;

  // Auto-rotation (only when not focused)
  useEffect(() => {
    if (!autoRotate || focusMatchId || len <= 1 || !onNext) return;
    const id = setInterval(() => onNext(), interval * 1000);
    return () => clearInterval(id);
  }, [autoRotate, focusMatchId, len, interval, onNext, currentIndex]);

  const leftCount = Math.floor((count - 1) / 2);
  const rightCount = count - 1 - leftCount;
  const displayItems = [];

  for (let i = -leftCount; i <= rightCount; i++) {
    const idx = (centerIndex + i + len * 10) % len;

    const absI = Math.abs(i);
    let x = 0;
    let scale = 1.15;
    let opacity = 1;
    const zIndex = 20 - absI;

    if (absI === 1) {
      x = i * 480;
      scale = 0.8;
      opacity = 1;
    } else if (absI === 2) {
      x = i * 850;
      scale = 0.6;
      opacity = 1;
    } else if (absI === 3) {
      x = i * 1150;
      scale = 0.4;
      opacity = 0;
    } else if (absI > 3) {
      x = i * 1400;
      scale = 0.2;
      opacity = 0;
    }

    displayItems.push({
      match: safeMatches[idx],
      x: x * baseScale,
      scale: scale * baseScale,
      opacity,
      zIndex,
      isCenter: i === 0,
    });
  }

  return (
    <div className="relative flex h-96 w-full max-w-[100vw] items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        {displayItems.map((item) => (
          <motion.div
            key={item.match.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: item.opacity, x: item.x, scale: item.scale, zIndex: item.zIndex }}
            transition={{ duration: 0.6, type: 'tween', ease: 'easeInOut' }}
            className="absolute"
          >
            <MatchCard match={item.match} isFocused={item.isCenter} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

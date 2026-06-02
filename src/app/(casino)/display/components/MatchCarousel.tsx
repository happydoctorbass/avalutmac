'use client';

import { Match } from '@/types/match';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchCard } from './MatchCard';

interface MatchCarouselProps {
  matches: Match[];
  focusMatchId?: string | null;
  settings?: { cardCount: number, cardScale: number };
}

export function MatchCarousel({ matches, focusMatchId, settings }: MatchCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const count = Math.max(3, Number(settings?.cardCount || 5));
  const baseScale = settings?.cardScale || 1.0;

  const promoMatches: Match[] = Array(15).fill(null).map((_, i) => ({
    id: `promo-${i}`, sportType: 'football', team1: 'ADMIRAL', team2: 'CASINO', time: ''
  }));
  
  const baseMatches = matches?.length ? matches : [];
  const safeMatches: Match[] = baseMatches.length >= count 
    ? baseMatches 
    : [...baseMatches, ...promoMatches].slice(0, Math.max(count, baseMatches.length));

  useEffect(() => {
    if (focusMatchId) {
      const idx = safeMatches.findIndex((m) => m.id === focusMatchId);
      if (idx !== -1) {
        setCurrentIndex(idx);
        return; // stop auto-scroll in focus mode
      }
    }
    
    if (safeMatches.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeMatches.length);
    }, 15000); // 15 seconds auto-scroll
    
    return () => clearInterval(interval);
  }, [safeMatches, focusMatchId]);

  const leftCount = Math.floor((count - 1) / 2);
  const rightCount = count - 1 - leftCount;
  const displayItems = [];
  
  for (let i = -leftCount; i <= rightCount; i++) {
    const idx = (currentIndex + i + safeMatches.length * 10) % safeMatches.length;
    
    const absI = Math.abs(i);
    let x = 0;
    let scale = 1.15;
    let opacity = 1;
    let zIndex = 20 - absI;
    
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
       opacity: opacity,
       zIndex: zIndex,
       isCenter: i === 0
    });
  }

  return (
    <div className="relative w-full max-w-[100vw] h-96 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        {displayItems.map((item) => (
          <motion.div
            key={item.match.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: item.opacity, x: item.x, scale: item.scale, zIndex: item.zIndex }}
            transition={{ duration: 0.6, type: "tween", ease: "easeInOut" }}
            className="absolute"
          >
            <MatchCard match={item.match} isFocused={item.isCenter} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
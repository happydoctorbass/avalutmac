"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Cinzel, Montserrat } from "next/font/google";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import "./promo.css";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700", "900"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

/* ============================================================================
 * PROMO_STYLES — единый конфиг размеров, отступов и позиций.
 * Меняйте классы здесь, не ищите их в JSX ниже.
 * ========================================================================== */
const PROMO_STYLES = {
  /* 📍 ПОЗИЦИЯ КОНТЕЙНЕРА — отступы от краёв экрана и ширина текстового блока */
  container:
    "absolute top-12 left-12 lg:top-16 lg:left-16 max-w-[65vw] z-10",

  /* 📦 СТЕК КОНТЕНТА — вертикальные промежутки между секциями (подзаголовок → заголовок → карусель → футер) */
  stack: "flex flex-col gap-6 lg:gap-8",

  /* 📝 ПОДЗАГОЛОВОК — размер, трекинг, цвет верхнего лейбла */
  subtitle:
    "text-lg md:text-xl lg:text-2xl font-semibold tracking-[0.3em] text-[#e6c875] uppercase drop-shadow-md",

  /* 👑 ГЛАВНЫЙ ЗАГОЛОВОК — размер и насыщенность (shimmer + gold-glow применяются отдельно) */
  title:
    "text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-tight shimmer-text gold-glow-text",

  /* 💬 ХУК — крупный призыв на слайде «Награды» */
  hook:
    "text-2xl md:text-3xl lg:text-4xl font-medium text-gray-100 leading-snug drop-shadow-lg",

  /* 📅 ЗАГОЛОВОК РАСПИСАНИЯ — заголовок на слайде «Расписание» */
  scheduleTitle:
    "text-2xl md:text-3xl lg:text-4xl font-medium text-gray-100 leading-snug drop-shadow-lg uppercase",

  /* 🃏 КАРТОЧКИ (VIP Gold Leaf Glass) — рамка, фон, тень, скругления */
  card:
    "border-l-4 border-l-[#ffd700] border-t border-r border-b border-[#d4af37]/50 bg-black/40 backdrop-blur-2xl rounded-r-2xl rounded-l-md px-8 py-5 w-fit shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.25)]",

  /* 🔤 ТЕКСТ ВНУТРИ КАРТОЧЕК — размер и стиль наград / времени */
  cardText:
    "text-xl md:text-2xl lg:text-3xl font-semibold text-white tracking-wider",

  /* 📋 СПИСОК КАРТОЧЕК НАГРАД — вертикальный стек */
  rewardsList: "flex flex-col gap-4 mt-2 w-full items-start text-left",

  /* 🕐 СПИСОК КАРТОЧЕК РАСПИСАНИЯ — горизонтальный wrap */
  scheduleList: "flex flex-wrap gap-6 mt-2 w-full justify-start",

  /* 🔻 ФУТЕР — нижняя строка (дисклеймер / бренд) */
  footer:
    "text-base md:text-lg lg:text-xl font-light tracking-[0.2em] text-gray-400 uppercase drop-shadow-md",

  /* 🎞️ ОБЛАСТЬ КАРУСЕЛИ — минимальная высота, чтобы слайды не прыгали */
  carousel: "relative flex flex-col justify-center items-start text-left w-full min-h-[250px]",
} as const;

/* ============================================================================
 * GOLD_DUST — плотный многослойный поток золотой пыли (53 частицы).
 * Детерминированные значения от индекса → стабильный SSR / hydration.
 * ========================================================================== */
type DustLayer = "speck" | "orb" | "glyph";

type GoldDustParticle = {
  id: string;
  layer: DustLayer;
  left: string;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
  opacityPeak: number;
  color: string;
  glyph: "✦" | "✨";
};

/** Псевдо-рандом 0..1 от seed (без Math.random — без рассинхрона SSR) */
const dustSeed = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const SPECK_COLORS = ["#ffd700", "#ffe566", "#fff8dc", "#e6c875", "#ffec8b"] as const;
const GLYPHS = ["✦", "✨"] as const;

const buildGoldDust = (): GoldDustParticle[] => {
  const particles: GoldDustParticle[] = [];

  // 35 × острые золотые искры (1–4px)
  for (let i = 0; i < 35; i++) {
    const r = dustSeed(i + 1);
    const r2 = dustSeed(i + 101);
    const r3 = dustSeed(i + 201);
    particles.push({
      id: `speck-${i}`,
      layer: "speck",
      left: `${r * 100}%`,
      size: 1 + Math.floor(r2 * 4), // 1–4px
      delay: r3 * 8, // 0–8s
      duration: 4 + dustSeed(i + 301) * 8, // 4–12s
      driftX: (dustSeed(i + 401) * 2 - 1) * (12 + dustSeed(i + 501) * 28),
      opacityPeak: 0.7 + dustSeed(i + 601) * 0.3,
      color: SPECK_COLORS[i % SPECK_COLORS.length],
      glyph: "✦",
    });
  }

  // 10 × мягкие амбиентные орбы (6–12px, blur)
  for (let i = 0; i < 10; i++) {
    const r = dustSeed(i + 700);
    const r2 = dustSeed(i + 800);
    particles.push({
      id: `orb-${i}`,
      layer: "orb",
      left: `${r * 100}%`,
      size: 6 + Math.floor(r2 * 7), // 6–12px
      delay: dustSeed(i + 900) * 8,
      duration: 6 + dustSeed(i + 1000) * 6, // 6–12s (медленнее)
      driftX: (dustSeed(i + 1100) * 2 - 1) * (18 + dustSeed(i + 1200) * 36),
      opacityPeak: 0.3 + dustSeed(i + 1300) * 0.3, // 0.3–0.6
      color: "#d4af37",
      glyph: "✦",
    });
  }

  // 8 × сверкающие глифы (✦ / ✨) с вращением
  for (let i = 0; i < 8; i++) {
    const r = dustSeed(i + 1400);
    particles.push({
      id: `glyph-${i}`,
      layer: "glyph",
      left: `${r * 100}%`,
      size: 10 + Math.floor(dustSeed(i + 1500) * 8), // 10–17px font
      delay: dustSeed(i + 1600) * 8,
      duration: 5 + dustSeed(i + 1700) * 7, // 5–12s
      driftX: (dustSeed(i + 1800) * 2 - 1) * (10 + dustSeed(i + 1900) * 24),
      opacityPeak: 0.55 + dustSeed(i + 2000) * 0.4,
      color: "#ffd700",
      glyph: GLYPHS[i % GLYPHS.length],
    });
  }

  return particles;
};

const GOLD_DUST = buildGoldDust();

interface PromoScreenProps {
  imageSrc: string | StaticImport;
  orientation: "horizontal" | "vertical";
  title: string;
  subtitle: string;
  hook: string;
  rewards: string[];
  scheduleTitle: string;
  schedule: string[];
  footer: string;
}

export const PromoScreen: React.FC<PromoScreenProps> = ({
  imageSrc,
  title,
  subtitle,
  hook,
  rewards,
  scheduleTitle,
  schedule,
  footer,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Dynamic Carousel Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000); // 6 seconds
    return () => clearInterval(interval);
  }, []);

  // Static element variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  // Carousel slide variants
  const slideVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.6, ease: "easeIn" as const } },
  };

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden bg-black flex items-start justify-start text-left">
      {/* 🔹 ФОН — object-fill, без затемняющих оверлеев */}
      <motion.div
        className="absolute inset-0 z-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <Image
          src={imageSrc}
          alt="Promo Background"
          fill
          className="object-fill"
          priority
        />
      </motion.div>

      {/* 🔹 ЗОЛОТАЯ ПЫЛЬ — плотный многослойный поток (53 частицы) */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
        {GOLD_DUST.map((p) => {
          const rise = {
            top: ["105vh", "-10vh"] as [string, string],
            x: [0, p.driftX, -p.driftX * 0.7, 0] as [number, number, number, number],
          };

          if (p.layer === "orb") {
            return (
              <motion.span
                key={p.id}
                className="absolute rounded-full bg-[#ffd700] blur-[2px]"
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  boxShadow: `0 0 ${p.size * 4}px rgba(212,175,55,0.55)`,
                }}
                initial={{ top: "105vh", opacity: 0, x: 0 }}
                animate={{
                  top: rise.top,
                  x: rise.x,
                  opacity: [0, p.opacityPeak, p.opacityPeak * 0.7, p.opacityPeak, 0],
                  scale: [0.8, 1.15, 1, 1.1, 0.7],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          }

          if (p.layer === "glyph") {
            return (
              <motion.span
                key={p.id}
                className="absolute select-none leading-none text-[#ffd700]"
                style={{
                  left: p.left,
                  fontSize: p.size,
                  textShadow: `0 0 8px rgba(255,215,0,0.9), 0 0 16px rgba(212,175,55,0.5)`,
                }}
                initial={{ top: "105vh", opacity: 0, x: 0, rotate: 0 }}
                animate={{
                  top: rise.top,
                  x: rise.x,
                  rotate: [0, 360],
                  opacity: [0, p.opacityPeak, p.opacityPeak * 0.55, p.opacityPeak, 0],
                  scale: [0.7, 1.1, 0.95, 1.05, 0.6],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {p.glyph}
              </motion.span>
            );
          }

          // Sharp gold speck
          return (
            <motion.span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 3}px rgba(255,215,0,0.95), 0 0 ${p.size * 7}px rgba(212,175,55,0.55)`,
              }}
              initial={{ top: "105vh", opacity: 0, x: 0 }}
              animate={{
                top: rise.top,
                x: rise.x,
                opacity: [0, p.opacityPeak, p.opacityPeak * 0.45, p.opacityPeak, 0],
                scale: [0.5, 1.25, 0.9, 1.15, 0.4],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* 🔹 АМБИЕНТНЫЙ ЗОЛОТОЙ СПОТ */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-[#d4af37]/15 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* 🔹 КОНТЕЙНЕР КОНТЕНТА — flex-колонка без наложений */}
      <div className={PROMO_STYLES.container}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={PROMO_STYLES.stack}
        >
          {/* 🔹 ВЕРХНИЙ БЛОК — подзаголовок + главный заголовок */}
          <div className="flex-none flex flex-col gap-2 items-start text-left">
            {/* 🔹 ПОДЗАГОЛОВОК */}
            <motion.h2
              variants={itemVariants}
              className={`${cinzel.className} ${PROMO_STYLES.subtitle}`}
            >
              {subtitle}
            </motion.h2>

            {/* 🔹 ГЛАВНЫЙ ЗАГОЛОВОК */}
            <motion.div variants={itemVariants}>
              <motion.h1
                animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.01, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className={`${cinzel.className} ${PROMO_STYLES.title}`}
              >
                {title}
              </motion.h1>
            </motion.div>
          </div>

          {/* 🔹 КАРУСЕЛЬ — Награды ↔ Расписание (6 сек, mode="wait") */}
          <div className={PROMO_STYLES.carousel}>
            <AnimatePresence mode="wait">
              {activeSlide === 0 && (
                <motion.div
                  key="slide-0"
                  variants={slideVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col gap-6 w-full items-start text-left"
                >
                  {/* 🔹 ХУК */}
                  <p className={`${montserrat.className} ${PROMO_STYLES.hook}`}>
                    {hook}
                  </p>

                  {/* 🔹 КАРТОЧКИ НАГРАД */}
                  <div className={PROMO_STYLES.rewardsList}>
                    {rewards.map((reward, idx) => (
                      <div key={idx} className={PROMO_STYLES.card}>
                        <span className={`${cinzel.className} ${PROMO_STYLES.cardText}`}>
                          {reward}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSlide === 1 && (
                <motion.div
                  key="slide-1"
                  variants={slideVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col gap-6 w-full items-start text-left"
                >
                  {/* 🔹 ЗАГОЛОВОК РАСПИСАНИЯ */}
                  <h3 className={`${cinzel.className} ${PROMO_STYLES.scheduleTitle}`}>
                    {scheduleTitle}
                  </h3>

                  {/* 🔹 КАРТОЧКИ РАСПИСАНИЯ */}
                  <div className={PROMO_STYLES.scheduleList}>
                    {schedule.map((time, idx) => (
                      <div key={idx} className={PROMO_STYLES.card}>
                        <span className={`${cinzel.className} ${PROMO_STYLES.cardText}`}>
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 🔹 ФУТЕР */}
          <motion.div variants={itemVariants} className="flex-none">
            <p className={`${montserrat.className} ${PROMO_STYLES.footer}`}>
              {footer}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

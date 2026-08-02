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
 * 🎛️ КАК МЕНЯТЬ РАЗМЕРЫ (читайте перед правками)
 * --------------------------------------------------------------------------
 * Все размеры и визуальный стиль живут ТОЛЬКО в PROMO_STYLES ниже.
 * JSX трогать не нужно — меняйте классы в полях объекта.
 *
 * Tailwind шпаргалка по размеру шрифта (выберите нужный и подставьте):
 *   text-2xl ≈ 24px | text-3xl ≈ 30px | text-4xl ≈ 36px | text-5xl ≈ 48px
 *   text-6xl ≈ 60px | text-7xl ≈ 72px | text-8xl ≈ 96px | text-9xl ≈ 128px
 *   Или точный: text-[3.25rem] / text-[72px] / lg:text-[5.5rem]
 *
 * Брейкпоинты:  без префикса = мобильный | md: = планшет | lg: = большой экран
 * Пример: "text-4xl md:text-5xl lg:text-6xl" → 36 → 48 → 60 px
 *
 * Вертикальные экраны: правьте блок ▼ VERTICAL (titleV, subtitleV, hookV …)
 * Горизонтальные:     правьте блок ► HORIZONTAL (title, subtitle, hook …)
 * Карточки общие:     card / cardText (или cardTextV для вертикали)
 * ========================================================================== */
const PROMO_STYLES = {
  /* ───────────────────── ► HORIZONTAL ───────────────────── */

  /* 📦 Стек секций (горизонталь) */
  stack: "flex flex-col gap-6 lg:gap-8",

  /* 📝 Подзаголовок — размер: text-lg / md:text-xl / lg:text-2xl */
  subtitle:
    "text-lg md:text-xl lg:text-2xl font-semibold tracking-[0.3em] text-[#e6c875] uppercase drop-shadow-md",

  /* 👑 Заголовок — размер: text-5xl / md:text-7xl / lg:text-8xl */
  title:
    "text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-tight text-gold-24k",

  /* 💬 Хук / описание — размер: text-2xl / md:text-3xl / lg:text-4xl */
  hook:
    "text-2xl md:text-3xl lg:text-4xl font-medium text-gray-100 leading-snug drop-shadow-lg",

  /* 📅 Заголовок расписания — размер как у hook */
  scheduleTitle:
    "text-2xl md:text-3xl lg:text-4xl font-medium text-gray-100 leading-snug drop-shadow-lg uppercase",

  /* 🔤 Текст в карточках — размер: text-xl / md:text-2xl / lg:text-3xl */
  cardText:
    "text-xl md:text-2xl lg:text-3xl font-semibold text-white tracking-wider",

  /* 🔻 Футер — размер: text-base / md:text-lg / lg:text-xl */
  footer:
    "text-base md:text-lg lg:text-xl font-light tracking-[0.2em] text-gray-400 uppercase drop-shadow-md",

  /* ───────────────────── ▼ VERTICAL (LED / портрет) ───────────────────── */

  /* Отступ шапки от верха экрана: top-8 (меньше) … top-16 (больше) */
  verticalHeaderPos:
    "absolute top-8 md:top-12 left-1/2 -translate-x-1/2 w-[92vw] text-center z-10 flex flex-col items-center gap-4",

  /* Отступ нижнего блока от низа: bottom-8 … bottom-16 */
  verticalBottomPos:
    "absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 w-[92vw] text-center z-10 flex flex-col items-center gap-7",

  /* 📝 Подзаголовок V — размер: text-xl / md:text-2xl / lg:text-3xl */
  subtitleV:
    "text-xl md:text-2xl lg:text-3xl font-semibold tracking-[0.35em] text-[#f0d78c] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]",

  /* 👑 Заголовок V — размер: text-7xl / md:text-8xl / lg:text-[7.5rem]
   *    Хотите ещё крупнее → lg:text-[8rem] или text-9xl
   *    Хотите мельче    → text-6xl md:text-7xl lg:text-[6rem] */
  titleV:
    "text-7xl md:text-8xl lg:text-[7.5rem] font-black uppercase text-gold-24k leading-[0.95] drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]",

  /* 💬 Хук / описание V — размер: text-3xl / md:text-4xl / lg:text-5xl
   *    Это «описание» на слайде наград. Крупнее: lg:text-6xl | Мельче: text-2xl */
  hookV:
    "text-3xl md:text-4xl lg:text-5xl font-semibold uppercase tracking-[0.12em] leading-tight text-hook-luxe",

  /* 📅 Заголовок расписания V — размер как hookV */
  scheduleTitleV:
    "text-3xl md:text-4xl lg:text-5xl font-semibold uppercase tracking-[0.12em] leading-tight text-hook-luxe",

  /* 🔤 Текст карточек V — размер: text-2xl / md:text-3xl / lg:text-4xl */
  cardTextV:
    "text-2xl md:text-3xl lg:text-4xl font-semibold text-[#fff8e7] tracking-wide",

  /* 🔻 Футер V — размер: text-lg / md:text-xl / lg:text-2xl */
  footerV:
    "text-lg md:text-xl lg:text-2xl font-light tracking-[0.28em] text-[#c4b896] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]",

  /* ───────────────────── 🃏 КАРТОЧКИ (общие) ───────────────────── */

  /* 3D Gold Ingot — padding: px-10 py-6 | Ещё плотнее: px-8 py-5 | Просторнее: px-12 py-7 */
  card:
    "bg-gradient-to-b from-[#2a2118]/95 via-[#0c0a09]/98 to-[#1a1510]/95 border border-[#d4af37]/85 border-t-[#ffe58f] rounded-2xl px-10 py-6 shadow-[inset_0_1px_1px_rgba(255,215,0,0.35),inset_0_-1px_0_rgba(0,0,0,0.4),0_16px_36px_rgba(0,0,0,0.95)] w-fit mx-auto",

  /* Списки карточек */
  rewardsList: "flex flex-col gap-4 mt-2 w-full items-start text-left",
  rewardsListCenter: "flex flex-col gap-5 mt-3 w-full items-center text-center mx-auto",
  scheduleList: "flex flex-wrap gap-6 mt-2 w-full justify-start",
  scheduleListCenter: "flex flex-wrap gap-5 mt-3 w-full justify-center mx-auto",
} as const;

/** Тонкая золотая линия-декор (CSS only, без blur / particles) */
const GoldRule = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden
    className={`h-px w-40 md:w-56 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent opacity-90 ${className}`}
  />
);

/** Орнамент вокруг описания: линия + ромб (лёгкий SVG, без анимаций) */
const HookOrnament = ({ dim = false }: { dim?: boolean }) => (
  <div className="flex items-center gap-3 w-full max-w-xl justify-center" aria-hidden>
    <span
      className={`h-px flex-1 max-w-[4.5rem] bg-gradient-to-r from-transparent ${dim ? "to-[#d4af37]/65" : "to-[#d4af37]"}`}
    />
    <svg width="14" height="14" viewBox="0 0 24 24" className={dim ? "text-[#c9a227]" : "text-[#ffd700]"}>
      <path d="M12 2L15 10L23 12L15 14L12 22L9 14L1 12L9 10L12 2Z" fill="currentColor" />
    </svg>
    <span
      className={`h-px flex-1 max-w-[4.5rem] bg-gradient-to-l from-transparent ${dim ? "to-[#d4af37]/65" : "to-[#d4af37]"}`}
    />
  </div>
);

export const DiamondIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block text-[#ffd700] drop-shadow-md"
    style={{ verticalAlign: "-0.125em", marginRight: "0.35em" }}
  >
    <path
      d="M12 2L15 10L23 12L15 14L12 22L9 14L1 12L9 10L12 2Z"
      fill="currentColor"
    />
  </svg>
);

interface PromoScreenProps {
  imageSrc: string | StaticImport;
  orientation?: "horizontal" | "vertical";
  containerPosition?: string; // Default: "top-12 left-12 lg:top-16 lg:left-16"
  maxContainerWidth?: string; // Default: "max-w-[65vw]"
  textAlign?: "left" | "center" | "right"; // Default: "left"
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  hook: string | React.ReactNode;
  rewards: (string | React.ReactNode)[];
  scheduleTitle: string | React.ReactNode;
  schedule: (string | React.ReactNode)[];
  footer: string | React.ReactNode;
}

export const PromoScreen: React.FC<PromoScreenProps> = ({
  imageSrc,
  orientation,
  containerPosition = "top-12 left-12 lg:top-16 lg:left-16",
  maxContainerWidth = "max-w-[65vw]",
  textAlign = "left",
  title,
  subtitle,
  hook,
  rewards,
  scheduleTitle,
  schedule,
  footer,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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

  const slideVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" as const } },
    exit: { opacity: 0, transition: { duration: 0.6, ease: "easeIn" as const } },
  };

  const isCenter = textAlign === "center";
  const alignClasses =
    isCenter
      ? "items-center text-center"
      : textAlign === "right"
      ? "items-end text-right"
      : "items-start text-left";

  const rewardsListClasses = isCenter ? PROMO_STYLES.rewardsListCenter : PROMO_STYLES.rewardsList;
  const scheduleListClasses = isCenter ? PROMO_STYLES.scheduleListCenter : PROMO_STYLES.scheduleList;

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden bg-black flex items-start justify-start text-left">
      {/* Фон — object-fill, без затемняющих оверлеев */}
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

      {orientation === "vertical" ? (
        <>
          {/* ═══ TOP: subtitle + title ═══ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={PROMO_STYLES.verticalHeaderPos}
          >
            <motion.h2
              variants={itemVariants}
              className={`${cinzel.className} ${PROMO_STYLES.subtitleV}`}
            >
              {subtitle}
            </motion.h2>

            <GoldRule />

            <motion.div variants={itemVariants}>
              <h1 className={`${cinzel.className} ${PROMO_STYLES.titleV}`}>
                {title}
              </h1>
            </motion.div>

            <GoldRule className="opacity-70" />
          </motion.div>

          {/* ═══ BOTTOM: carousel (hook + cards) + footer ═══ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={PROMO_STYLES.verticalBottomPos}
          >
            <div className="relative flex flex-col justify-center w-full min-h-[280px] items-center text-center">
              <AnimatePresence mode="wait">
                {activeSlide === 0 && (
                  <motion.div
                    key="slide-0"
                    variants={slideVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="flex flex-col gap-7 w-full items-center text-center"
                  >
                    {/* Люкс-описание: золотой градиент + орнамент */}
                    <div className="flex flex-col items-center gap-3 w-full max-w-[90vw]">
                      <HookOrnament />
                      <p className={`${cinzel.className} ${PROMO_STYLES.hookV}`}>
                        {hook}
                      </p>
                      <HookOrnament dim />
                    </div>

                    <div className={PROMO_STYLES.rewardsListCenter}>
                      {rewards.map((reward, idx) => (
                        <div key={idx} className={PROMO_STYLES.card}>
                          <span className={`${cinzel.className} ${PROMO_STYLES.cardTextV}`}>
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
                    className="flex flex-col gap-7 w-full items-center text-center"
                  >
                    <div className="flex flex-col items-center gap-3 w-full max-w-[90vw]">
                      <HookOrnament />
                      <h3 className={`${cinzel.className} ${PROMO_STYLES.scheduleTitleV}`}>
                        {scheduleTitle}
                      </h3>
                      <HookOrnament dim />
                    </div>

                    <div className={PROMO_STYLES.scheduleListCenter}>
                      {schedule.map((time, idx) => (
                        <div key={idx} className={PROMO_STYLES.card}>
                          <span className={`${cinzel.className} ${PROMO_STYLES.cardTextV}`}>
                            {time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div variants={itemVariants} className="flex-none">
              <p className={`${montserrat.className} ${PROMO_STYLES.footerV}`}>
                {footer}
              </p>
            </motion.div>
          </motion.div>
        </>
      ) : (
        <div className={`absolute ${containerPosition} ${maxContainerWidth} z-10`}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={PROMO_STYLES.stack}
          >
            <div className={`flex-none flex flex-col gap-2 ${alignClasses}`}>
              <motion.h2
                variants={itemVariants}
                className={`${cinzel.className} ${PROMO_STYLES.subtitle}`}
              >
                {subtitle}
              </motion.h2>

              <motion.div variants={itemVariants}>
                <h1 className={`${cinzel.className} ${PROMO_STYLES.title}`}>
                  {title}
                </h1>
              </motion.div>
            </div>

            <div className={`relative flex flex-col justify-center w-full min-h-[250px] ${alignClasses}`}>
              <AnimatePresence mode="wait">
                {activeSlide === 0 && (
                  <motion.div
                    key="slide-0"
                    variants={slideVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className={`flex flex-col gap-6 w-full ${alignClasses}`}
                  >
                    <p className={`${montserrat.className} ${PROMO_STYLES.hook}`}>
                      {hook}
                    </p>

                    <div className={rewardsListClasses}>
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
                    className={`flex flex-col gap-6 w-full ${alignClasses}`}
                  >
                    <h3 className={`${cinzel.className} ${PROMO_STYLES.scheduleTitle}`}>
                      {scheduleTitle}
                    </h3>

                    <div className={scheduleListClasses}>
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

            <motion.div variants={itemVariants} className={`flex-none ${alignClasses}`}>
              <p className={`${montserrat.className} ${PROMO_STYLES.footer}`}>
                {footer}
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

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
  /* 📦 СТЕК КОНТЕНТА — вертикальные промежутки между секциями (подзаголовок → заголовок → карусель → футер) */
  stack: "flex flex-col gap-6 lg:gap-8",

  /* 📝 ПОДЗАГОЛОВОК — размер, трекинг, цвет верхнего лейбла */
  subtitle:
    "text-lg md:text-xl lg:text-2xl font-semibold tracking-[0.3em] text-[#e6c875] uppercase drop-shadow-md",

  /* 👑 ГЛАВНЫЙ ЗАГОЛОВОК — размер и насыщенность */
  title:
    "text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-tight text-gold-24k",

  /* 💬 ХУК — крупный призыв на слайде «Награды» */
  hook:
    "text-2xl md:text-3xl lg:text-4xl font-medium text-gray-100 leading-snug drop-shadow-lg",

  /* 📅 ЗАГОЛОВОК РАСПИСАНИЯ — заголовок на слайде «Расписание» */
  scheduleTitle:
    "text-2xl md:text-3xl lg:text-4xl font-medium text-gray-100 leading-snug drop-shadow-lg uppercase",

  /* 🃏 КАРТОЧКИ (VIP Gold Leaf Glass) — рамка, фон, тень, скругления */
  card:
    "bg-black/90 border-l-4 border-l-[#ffd700] border-t border-r border-b border-[#d4af37]/60 rounded-r-2xl rounded-l-md px-8 py-5 shadow-2xl w-fit",

  /* 🔤 ТЕКСТ ВНУТРИ КАРТОЧЕК — размер и стиль наград / времени */
  cardText:
    "text-xl md:text-2xl lg:text-3xl font-semibold text-white tracking-wider",

  /* 📋 СПИСОК КАРТОЧЕК НАГРАД — вертикальный стек */
  rewardsList: "flex flex-col gap-4 mt-2 w-full items-start text-left",
  rewardsListCenter: "flex flex-col gap-4 mt-2 w-full items-center text-center mx-auto",

  /* 🕐 СПИСОК КАРТОЧЕК РАСПИСАНИЯ — горизонтальный wrap */
  scheduleList: "flex flex-wrap gap-6 mt-2 w-full justify-start",
  scheduleListCenter: "flex flex-wrap gap-6 mt-2 w-full justify-center mx-auto",

  /* 🔻 ФУТЕР — нижняя строка (дисклеймер / бренд) */
  footer:
    "text-base md:text-lg lg:text-xl font-light tracking-[0.2em] text-gray-400 uppercase drop-shadow-md",
} as const;

export const DiamondIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block text-[#ffd700] drop-shadow-md"
    style={{ verticalAlign: "-0.125em", marginRight: "0.25em" }}
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

      {/* 🔹 КОНТЕЙНЕР КОНТЕНТА — flex-колонка без наложений */}
      <div className={`absolute ${containerPosition} ${maxContainerWidth} z-10`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={PROMO_STYLES.stack}
        >
          {/* 🔹 ВЕРХНИЙ БЛОК — подзаголовок + главный заголовок */}
          <div className={`flex-none flex flex-col gap-2 ${alignClasses}`}>
            {/* 🔹 ПОДЗАГОЛОВОК */}
            <motion.h2
              variants={itemVariants}
              className={`${cinzel.className} ${PROMO_STYLES.subtitle}`}
            >
              {subtitle}
            </motion.h2>

            {/* 🔹 ГЛАВНЫЙ ЗАГОЛОВОК */}
            <motion.div variants={itemVariants}>
              <h1 className={`${cinzel.className} ${PROMO_STYLES.title}`}>
                {title}
              </h1>
            </motion.div>
          </div>

          {/* 🔹 КАРУСЕЛЬ — Награды ↔ Расписание (6 сек, mode="wait") */}
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
                  {/* 🔹 ХУК */}
                  <p className={`${montserrat.className} ${PROMO_STYLES.hook}`}>
                    {hook}
                  </p>

                  {/* 🔹 КАРТОЧКИ НАГРАД */}
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
                  {/* 🔹 ЗАГОЛОВОК РАСПИСАНИЯ */}
                  <h3 className={`${cinzel.className} ${PROMO_STYLES.scheduleTitle}`}>
                    {scheduleTitle}
                  </h3>

                  {/* 🔹 КАРТОЧКИ РАСПИСАНИЯ */}
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

          {/* 🔹 ФУТЕР */}
          <motion.div variants={itemVariants} className={`flex-none ${alignClasses}`}>
            <p className={`${montserrat.className} ${PROMO_STYLES.footer}`}>
              {footer}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

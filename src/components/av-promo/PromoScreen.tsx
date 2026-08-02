"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Cinzel, Montserrat } from "next/font/google";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import "./promo.css";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700", "900"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const HighlightMoney = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffe58f] via-[#ffd700] to-[#c9a227] drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)] tracking-wider py-1 text-left">
    {children}
  </span>
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

const PROMO_STYLES = {
  /* ► HORIZONTAL (38% Left Sidebar + Высота экрана с гибким футером) */
  horizontalContainer: "absolute top-8 left-10 lg:top-12 lg:left-14 z-10 w-[38vw] max-w-[40vw] h-[calc(100vh-5rem)] flex flex-col justify-between text-left items-start pb-4",

  subtitle: "text-base md:text-lg lg:text-xl font-semibold tracking-[0.25em] text-[#e6c875] uppercase drop-shadow-md",
  title: "text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight text-gold-24k text-left w-full",
  hook: "text-xl md:text-2xl lg:text-3xl font-medium text-gray-100 leading-snug drop-shadow-lg text-left w-full",
  scheduleTitle: "text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400 leading-snug drop-shadow-lg uppercase text-left w-full",

  /* Универсальная карточка */
  card: "bg-gradient-to-r from-black/95 via-[#14120e]/95 to-black/90 border border-[#d4af37]/60 border-t-[#ffe89c] rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.95),0_0_20px_rgba(212,175,55,0.15)] w-full text-left items-start flex flex-col gap-1.5",

  rewardsList: "flex flex-col gap-3.5 w-full items-start text-left mt-1",
  scheduleList: "flex flex-col gap-3.5 w-full items-start text-left mt-1",

  cardText: "text-base md:text-lg lg:text-xl font-semibold text-white tracking-wide w-full text-left",
  
  /* УВЕЛИЧЕННЫЙ И НЕЗАВИСИМЫЙ ФУТЕР */
  footer: "text-sm md:text-base lg:text-lg font-bold tracking-[0.2em] text-[#e6c875] uppercase drop-shadow-lg w-full text-left pt-4 mt-auto border-t border-[#d4af37]/40",

  /* ▼ VERTICAL (LED / Portrait) */
  verticalHeaderPos: "absolute top-8 md:top-12 left-1/2 -translate-x-1/2 w-[92vw] text-center z-10 flex flex-col items-center gap-4",
  verticalBottomPos: "absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 w-[92vw] text-center z-10 flex flex-col items-center gap-7",
  subtitleV: "text-xl md:text-2xl lg:text-3xl font-semibold tracking-[0.35em] text-[#f0d78c] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]",
  titleV: "text-6xl md:text-7xl lg:text-[6.5rem] font-black uppercase text-gold-24k leading-[0.95] drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]",
  hookV: "text-3xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-[0.08em] leading-snug text-hook-luxe",
  scheduleTitleV: "text-3xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-[0.08em] leading-snug text-hook-luxe",
  cardTextV: "text-2xl md:text-3xl lg:text-4xl font-semibold text-[#fff8e7] tracking-wide",
  footerV: "text-base md:text-lg lg:text-xl font-bold tracking-[0.28em] text-[#e6c875] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]",
  cardV: "bg-gradient-to-b from-black/90 via-[#0e0d0b]/90 to-black/90 border border-[#d4af37]/70 border-t-[#ffe58f] rounded-2xl px-6 py-4 shadow-[inset_0_1px_1px_rgba(255,215,0,0.35),0_10px_25px_rgba(0,0,0,0.9)] w-full max-w-2xl mx-auto text-center flex flex-col items-center gap-2",
  rewardsListCenter: "flex flex-col gap-4 mt-3 w-full items-center text-center mx-auto",
  scheduleListCenter: "flex flex-col gap-4 mt-3 w-full items-center text-center mx-auto",
  bottomPanel: "bg-gradient-to-b from-[#1c1916]/95 via-[#0a0908]/95 to-[#14110e]/95 border-2 border-[#d4af37]/80 border-t-[#ffe89c] rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.3)] max-w-[92vw] mx-auto w-full flex flex-col items-center gap-5",
} as const;

interface PromoScreenProps {
  imageSrc: string | StaticImport;
  orientation?: "horizontal" | "vertical";
  showBottomPanel?: boolean;
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
  orientation = "horizontal",
  showBottomPanel = false,
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
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const slideVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
    exit: { opacity: 0, transition: { duration: 0.4, ease: "easeIn" as const } },
  };

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden bg-black flex items-start justify-start text-left">
      <motion.div
        className="absolute inset-0 z-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image src={imageSrc} alt="Promo Background" fill className="object-fill" priority />
      </motion.div>

      {orientation === "vertical" ? (
        <>
          <motion.div variants={containerVariants} initial="hidden" animate="show" className={PROMO_STYLES.verticalHeaderPos}>
            <motion.h2 variants={itemVariants} className={`${cinzel.className} ${PROMO_STYLES.subtitleV}`}>
              {subtitle}
            </motion.h2>
            <motion.div variants={itemVariants}>
              <h1 className={`${cinzel.className} ${PROMO_STYLES.titleV}`}>{title}</h1>
            </motion.div>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="show" className={PROMO_STYLES.verticalBottomPos}>
            <div className={showBottomPanel ? PROMO_STYLES.bottomPanel : "w-full"}>
              <div className="relative flex flex-col justify-center w-full min-h-[280px] items-center text-center">
                <AnimatePresence mode="wait">
                  {activeSlide === 0 ? (
                    <motion.div key="v-slide-0" variants={slideVariants} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6 w-full items-center text-center">
                      <p className={`${cinzel.className} ${PROMO_STYLES.hookV}`}>{hook}</p>
                      <div className={PROMO_STYLES.rewardsListCenter}>
                        {rewards.map((reward, idx) => (
                          <div key={idx} className={PROMO_STYLES.cardV}>
                            <span className={`${cinzel.className} ${PROMO_STYLES.cardTextV}`}>{reward}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="v-slide-1" variants={slideVariants} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6 w-full items-center text-center">
                      <h3 className={`${cinzel.className} ${PROMO_STYLES.scheduleTitleV}`}>{scheduleTitle}</h3>
                      <div className={PROMO_STYLES.scheduleListCenter}>
                        {schedule.map((time, idx) => (
                          <div key={idx} className={PROMO_STYLES.cardV}>
                            <span className={`${cinzel.className} ${PROMO_STYLES.cardTextV}`}>{time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div variants={itemVariants} className="flex-none mt-2">
                <p className={`${montserrat.className} ${PROMO_STYLES.footerV}`}>{footer}</p>
              </motion.div>
            </div>
          </motion.div>
        </>
      ) : (
        /* ► HORIZONTAL */
        <div className={PROMO_STYLES.horizontalContainer}>
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-3.5 w-full items-start text-left flex-1">
            <motion.h2 variants={itemVariants} className={`${cinzel.className} ${PROMO_STYLES.subtitle}`}>
              {subtitle}
            </motion.h2>

            <motion.div variants={itemVariants} className="w-full">
              <h1 className={`${cinzel.className} ${PROMO_STYLES.title}`}>{title}</h1>
            </motion.div>

            <div className="relative flex flex-col justify-start w-full min-h-[290px] items-start text-left mt-1">
              <AnimatePresence mode="wait">
                {activeSlide === 0 ? (
                  <motion.div key="h-slide-0" variants={slideVariants} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-3 w-full items-start text-left">
                    <p className={`${montserrat.className} ${PROMO_STYLES.hook}`}>{hook}</p>
                    <div className={PROMO_STYLES.rewardsList}>
                      {rewards.map((reward, idx) => (
                        <div key={idx} className={PROMO_STYLES.card}>
                          <div className={`${cinzel.className} ${PROMO_STYLES.cardText}`}>{reward}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="h-slide-1" variants={slideVariants} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-3 w-full items-start text-left">
                    <h3 className={`${cinzel.className} ${PROMO_STYLES.scheduleTitle}`}>{scheduleTitle}</h3>
                    <div className={PROMO_STYLES.scheduleList}>
                      {schedule.map((time, idx) => (
                        <div key={idx} className={PROMO_STYLES.card}>
                          <div className={`${cinzel.className} ${PROMO_STYLES.cardText}`}>{time}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* НЕЗАВИСИМЫЙ И КРУПНЫЙ ФУТЕР ВНИЗУ */}
          <motion.div variants={itemVariants} className="w-full text-left">
            <p className={`${montserrat.className} ${PROMO_STYLES.footer}`}>{footer}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};
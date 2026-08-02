import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function HorizontalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/livegame_horizontal.png"
      orientation="horizontal"
      textAlign="left"
      containerPosition="top-12 left-12 lg:top-16 lg:left-16"
      maxContainerWidth="max-w-[60vw]"
      subtitle="♠ THE ART OF HIGH STAKES WINNING"
      title="TRIPLE BOOST BONUS CHIPS"
      hook="WIN WITH A ×10 BET & TRIPLE YOUR REWARDS!"
      rewards={[
        <span key="1"><DiamondIcon /> BACCARAT BOOST: Win Up to $5,000 PROMO CHIPS + 2,000 KGS TICKET</span>,
        <span key="2"><DiamondIcon /> NIU NIU BOOST: Win Up to $2,000 PROMO CHIPS + 2,000 KGS TICKET</span>,
        <span key="3"><DiamondIcon /> VIP DROP BONUS: 10% Cash Back + 10% Promo Chips on Every $1,000 Drop</span>,
        <span key="4"><DiamondIcon /> LOSS PROTECTION: 5% Promo Reward Next Day on $5,000+ Losses</span>
      ]}
      scheduleTitle="DAILY BOOST SESSIONS"
      schedule={[
        <span key="1"><DiamondIcon /> SESSION 1: 18:00h – 20:59h</span>,
        <span key="2"><DiamondIcon /> SESSION 2: 21:00h – 23:59h</span>,
        <span key="3"><DiamondIcon /> SESSION 3: 00:00h – 03:00h</span>
      ]}
      footer="Play with elegance • Win with style"
    />
  );
}

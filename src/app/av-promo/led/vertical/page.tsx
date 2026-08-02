import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function LedVerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/ledscreen vertical.png"
      orientation="vertical"
      textAlign="center"
      showBottomPanel={true}
      subtitle="LIVE GAME PROMOTIONS AUGUST 2026"
      title="BACCARAT & NIU NIU TRIPLE BOOST"
      hook="BET × 10 • 10% CASHBACK + 10% PROMO CHIPS ON DROPS"
      rewards={[
        <span key="1"><DiamondIcon /> Baccarat Triple Boost: Win $250 – $5,000 PROMO CHIPS + 2,000 KGS TICKET</span>,
        <span key="2"><DiamondIcon /> Niu Niu Triple Boost: Win $250 – $2,000 PROMO CHIPS + 2,000 KGS TICKET</span>,
        <span key="3"><DiamondIcon /> Live Game Drop Bonus: Every $1,000 Drop = 10% Cash Back + 10% Promo Chips</span>,
        <span key="4"><DiamondIcon /> Loss Reward: Every $5,000 Loss = Next Day 5% Promo Reward</span>
      ]}
      scheduleTitle="DAILY TRIPLE BOOST SESSIONS"
      schedule={[
        <span key="1"><DiamondIcon /> Session 1: 18:00h – 20:59h</span>,
        <span key="2"><DiamondIcon /> Session 2: 21:00h – 23:59h</span>,
        <span key="3"><DiamondIcon /> Session 3: 00:00h – 03:00h</span>,
        <span key="4"><DiamondIcon /> 5% Promo Reward valid only for next day visit</span>
      ]}
      footer="Valid for all visitors"
    />
  );
}

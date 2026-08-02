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
      subtitle="LIVE GAME TRIPLE BOOST"
      title="BACCARAT & NIU NIU"
      hook="BET × 10 • TRIPLE BOOST BONUS CHIPS"
      rewards={[
        <span key="1"><DiamondIcon /> Baccarat: Win min. $250 max. $5,000 PROMO CHIPS + 2,000 KGS TICKET</span>,
        <span key="2"><DiamondIcon /> Niu Niu: Win min. $250 max. $2,000 PROMO CHIPS + 2,000 KGS TICKET</span>,
        <span key="3"><DiamondIcon /> Daily Sessions: 18:00–20:59h | 21:00–23:59h | 00:00–03:00h</span>
      ]}
      scheduleTitle="DAILY SESSIONS"
      schedule={[
        <span key="1"><DiamondIcon /> Session 1: 18:00h – 20:59h</span>,
        <span key="2"><DiamondIcon /> Session 2: 21:00h – 23:59h</span>,
        <span key="3"><DiamondIcon /> Session 3: 00:00h – 03:00h</span>
      ]}
      footer="Valid for all visitors"
    />
  );
}

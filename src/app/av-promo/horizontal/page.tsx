import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function HorizontalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/livegame_horizontal.png"
      orientation="horizontal"
      subtitle="BACCARAT & NIU NIU"
      title="TRIPLE BOOST BONUS"
      hook="WIN WITH A ×10 BET!"
      rewards={[
        <span key="1"><DiamondIcon /> Baccarat: Up to $5,000 + 2,000 KGS</span>,
        <span key="2"><DiamondIcon /> Niu Niu: Up to $2,000 + 2,000 KGS</span>,
        <span key="3"><DiamondIcon /> Daily: 18:00–20:59 | 21:00–23:59 | 00:00–03:00</span>
      ]}
      scheduleTitle="DAILY BOOST SESSIONS"
      schedule={[
        <span key="1"><DiamondIcon /> Session 1: 18:00 – 20:59</span>,
        <span key="2"><DiamondIcon /> Session 2: 21:00 – 23:59</span>,
        <span key="3"><DiamondIcon /> Night: 00:00 – 03:00</span>
      ]}
      footer="Play with elegance • Ask dealer for details"
    />
  );
}

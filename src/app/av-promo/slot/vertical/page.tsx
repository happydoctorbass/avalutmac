import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function SlotVerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/slot_vertical.png"
      orientation="vertical"
      textAlign="center"
      subtitle="SLOT PROMOTION AUGUST 2026"
      title="WELCOME & MATCH PLAY"
      hook="1,000 KGS WELCOME BONUS FOR NEW REGISTRATIONS"
      rewards={[
        <span key="1"><DiamondIcon /> Choose Bonus: 1000/2000 KGS | 2000/4000 KGS | 2500/5000 KGS</span>,
        <span key="2"><DiamondIcon /> Mon – Thu & Sun: 18:00h – 22:00h</span>,
        <span key="3"><DiamondIcon /> Fri – Sat: 20:00h – 22:00h</span>
      ]}
      scheduleTitle="MATCH PLAY HOURS"
      schedule={[
        <span key="1"><DiamondIcon /> Mon – Thu & Sun: 18:00h – 22:00h</span>,
        <span key="2"><DiamondIcon /> Fri – Sat: 20:00h – 22:00h</span>
      ]}
      footer="Valid for all visitors"
    />
  );
}

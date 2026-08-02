import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function SlotVerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/slot_vertical.png"
      orientation="vertical"
      containerPosition="top-12 left-1/2 -translate-x-1/2 items-center text-center"
      maxContainerWidth="max-w-[90vw]"
      textAlign="center"
      subtitle="WELCOME TO THE CASINO"
      title="SLOT MATCH PLAY"
      hook="1,000 KGS WELCOME BONUS!"
      rewards={[
        <span key="1"><DiamondIcon /> Welcome Bonus: 1,000 KGS Instant</span>,
        <span key="2"><DiamondIcon /> Match Play: Double 1,000 → 2,000 KGS</span>,
        <span key="3"><DiamondIcon /> Golden Hours: Mon–Thu & Sun (18:00–22:00)</span>
      ]}
      scheduleTitle="GOLDEN HOURS"
      schedule={[
        <span key="1"><DiamondIcon /> Mon–Thu & Sun: 18:00 – 22:00</span>,
        <span key="2"><DiamondIcon /> Fri–Sat: 20:00 – 22:00</span>
      ]}
      footer="Your Jackpot is calling • Ask slot attendant"
    />
  );
}

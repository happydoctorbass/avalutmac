import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function SlotHorizontalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/slot_horizontal.png"
      orientation="horizontal"
      textAlign="left"
      containerPosition="top-12 left-12 lg:top-16 lg:left-16"
      maxContainerWidth="max-w-[60vw]"
      subtitle="💎 YOUR PRIVILEGE IS OUR PRIORITY"
      title="10% CASH BACK REWARDS"
      hook="EXCLUSIVE CASHBACK ON SLOTS & LIVE GAME!"
      rewards={[
        <span key="1"><DiamondIcon /> SLOTS CASHBACK: 10% Cash Back on Drops Over 50,000 KGS</span>,
        <span key="2"><DiamondIcon /> LIVE GAME DROPS: 10% Cash Back + 10% Promo Chips on Every $1,000</span>,
        <span key="3"><DiamondIcon /> SPECIAL COMPLIMENT: 5% Promo Reward Next Day on $5,000+ Losses</span>
      ]}
      scheduleTitle="REWARD TERMS"
      schedule={[
        <span key="1"><DiamondIcon /> 5% Promo Reward valid for next day visit</span>,
        <span key="2"><DiamondIcon /> Applies to all qualifying Slot & Live Game play</span>
      ]}
      footer="Fortune always returns to VIP guests"
    />
  );
}

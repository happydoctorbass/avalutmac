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
      subtitle="SPECIAL REWARDS & CASHBACK"
      title="10% CASH BACK & REWARDS"
      hook="EXCLUSIVE CASHBACK ON SLOTS & LIVE GAME"
      rewards={[
        <span key="1"><DiamondIcon /> Slots: 10% Cash Back on Drops Over 50,000 KGS</span>,
        <span key="2"><DiamondIcon /> Live Game: Every $1,000 Drop = 10% Cash Back + 10% Promo Chips</span>,
        <span key="3"><DiamondIcon /> Loss Reward: Every $5,000 Loss = Next Day 5% Promo Reward</span>
      ]}
      scheduleTitle="PROMOTION NOTICE"
      schedule={[
        <span key="1"><DiamondIcon /> 5% Promo Reward valid only for next day visit</span>,
        <span key="2"><DiamondIcon /> Valid for all qualifying Slot & Live Game play</span>
      ]}
      footer="Valid for all visitors"
    />
  );
}

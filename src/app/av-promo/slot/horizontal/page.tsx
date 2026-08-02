import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function SlotHorizontalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/slot_horizontal.png"
      orientation="horizontal"
      subtitle="VIP PRIVILEGE CLUB"
      title="10% CASH BACK"
      hook="EXCLUSIVE CASHBACK ON DROPS"
      rewards={[
        <span key="1"><DiamondIcon /> Live Game: 10% Cash Back + 10% Promo Chips</span>,
        <span key="2"><DiamondIcon /> Slots: 10% Cash Back on 50,000+ KGS</span>,
        <span key="3"><DiamondIcon /> Special Compliment: 5% Reward Next Day</span>
      ]}
      scheduleTitle="PRIVILEGE REWARDS"
      schedule={[
        <span key="1"><DiamondIcon /> Automatic daily cashback calculations</span>,
        <span key="2"><DiamondIcon /> Ask Pit Boss for VIP status conditions</span>
      ]}
      footer="Fortune returns to VIP guests • Ask your host"
    />
  );
}

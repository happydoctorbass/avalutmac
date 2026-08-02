import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function SlotHorizontalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/slot_horizontal.png"
      orientation="horizontal"
      title="SLOT MEGA JACKPOT"
      subtitle="Spin the Reels. Hit the Jackpot!"
      hook="Join the ultimate slot experience:"
      rewards={[
        <span key="1"><DiamondIcon /> Daily Free Spins</span>,
        <span key="2"><DiamondIcon /> Weekly Cash Drops</span>,
        <span key="3"><DiamondIcon /> VIP Exclusive Tournaments</span>
      ]}
      scheduleTitle="Tournament Schedule"
      schedule={[
        <span key="1"><DiamondIcon /> Friday 20:00</span>,
        <span key="2"><DiamondIcon /> Saturday 20:00</span>,
        <span key="3"><DiamondIcon /> Sunday 18:00</span>
      ]}
      footer="VIP Members Only"
    />
  );
}

import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function VerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/livegame_vertical.png"
      orientation="vertical"
      containerPosition="top-12 left-1/2 -translate-x-1/2 items-center text-center"
      maxContainerWidth="max-w-[90vw]"
      textAlign="center"
      subtitle="GRAND MONTHLY GIVEAWAY"
      title="$50,000 + 500,000 KGS"
      hook="LUXURIOUS GRAND FINALS"
      rewards={[
        <span key="1"><DiamondIcon /> August 15 Final: $20,000 + 20,000 KGS</span>,
        <span key="2"><DiamondIcon /> August 29 Final: $30,000 + 30,000 KGS</span>,
        <span key="3"><DiamondIcon /> Draws at 22:00, 00:00 & 02:00</span>
      ]}
      scheduleTitle="GRAND FINALS"
      schedule={[
        <span key="1"><DiamondIcon /> Live Game: $1,000 drop = 1 ticket</span>,
        <span key="2"><DiamondIcon /> Slots: 80,000 KGS drop = 1 ticket</span>
      ]}
      footer="Collect your tickets • Ask VIP Host for details"
    />
  );
}

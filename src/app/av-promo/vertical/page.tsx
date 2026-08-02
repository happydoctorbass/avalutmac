import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function VerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/livegame_vertical.png"
      orientation="vertical"
      textAlign="center"
      subtitle="AUGUST MONTHLY BONUS"
      title="$50,000 + 500,000 KGS"
      hook="50,000$ PROMO CHIPS + 500,000 KGS PROMO TICKET"
      rewards={[
        <span key="1"><DiamondIcon /> 15.08.2026 Draw: $20,000 PROMO CHIPS + 20,000 KGS TICKET</span>,
        <span key="2"><DiamondIcon /> 29.08.2026 Draw: $30,000 PROMO CHIPS + 30,000 KGS TICKET</span>,
        <span key="3"><DiamondIcon /> Draws at 22:00h, 00:00h and 02:00h</span>
      ]}
      scheduleTitle="EARN TICKETS"
      schedule={[
        <span key="1"><DiamondIcon /> Live Game: Every $1,000 drop = 1 ticket</span>,
        <span key="2"><DiamondIcon /> Slots: Every 80,000 KGS drop = 1 ticket</span>
      ]}
      footer="Valid for all visitors"
    />
  );
}

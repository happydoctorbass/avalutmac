import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function VerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/livegame_vertical.png"
      orientation="vertical"
      textAlign="center"
      showBottomPanel={true}
      subtitle="🏆 A CONSTELLATION OF PRIZES"
      title="$50,000 + 500,000 KGS"
      hook="GRAND FINALS GIVEAWAY POOL!"
      rewards={[
        <span key="1"><DiamondIcon /> AUG 15 GRAND FINAL: $20,000 PROMO CHIPS + 20,000 KGS TICKET</span>,
        <span key="2"><DiamondIcon /> AUG 29 GRAND FINAL: $30,000 PROMO CHIPS + 30,000 KGS TICKET</span>,
        <span key="3"><DiamondIcon /> FINALS DRAWS AT: 22:00h, 00:00h and 02:00h</span>
      ]}
      scheduleTitle="EARN YOUR TICKETS"
      schedule={[
        <span key="1"><DiamondIcon /> LIVE GAME: Every $1,000 Drop = 1 Ticket</span>,
        <span key="2"><DiamondIcon /> SLOTS: Every 80,000 KGS Drop = 1 Ticket</span>
      ]}
      footer="Be the star of our Grand Finals • Valid for all visitors"
    />
  );
}

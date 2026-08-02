import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function LiveGameVerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/livegame_vertical.png"
      orientation="vertical"
      containerPosition="top-12 left-1/2 -translate-x-1/2 items-center text-center"
      maxContainerWidth="max-w-[90vw]"
      textAlign="center"
      title="BACCARAT TRIPLE BOOST"
      subtitle="Play Bigger. Win Bigger. Get Rewarded!"
      hook="Place your bets and unlock an exclusive reward:"
      rewards={[
        <span key="1"><DiamondIcon /> Bet ×10</span>,
        <span key="2"><DiamondIcon /> Win from $250 up to $5,000</span>,
        <span key="3"><DiamondIcon /> Receive BONUS CHIPS + 2,000 KGS Promo Ticket</span>
      ]}
      scheduleTitle="Every Day"
      schedule={[
        <span key="1"><DiamondIcon /> 18:00 – 20:59</span>,
        <span key="2"><DiamondIcon /> 21:00 – 23:59</span>,
        <span key="3"><DiamondIcon /> 00:00 – 03:00</span>
      ]}
      footer="Open to All Guests"
    />
  );
}

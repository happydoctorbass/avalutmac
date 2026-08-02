import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function LedVerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/ledscreen vertical.png"
      orientation="vertical"
      textAlign="center"
      subtitle="HAPPY HOURS JACKPOT"
      title="2 X PROGRESSIVE JACKPOT"
      hook="EVERY DAY FROM 22:00h UNTIL 04:00h"
      rewards={[
        <span key="1"><DiamondIcon /> STAR MINI Jackpot: Starts from 15,000 KGS</span>,
        <span key="2"><DiamondIcon /> STAR MIDI Jackpot: Starts from 40,000 KGS</span>,
        <span key="3"><DiamondIcon /> Any Bet • Random Time</span>
      ]}
      scheduleTitle="HAPPY HOURS TIME"
      schedule={[
        <span key="1"><DiamondIcon /> Daily Session: 22:00h – 04:00h</span>,
        <span key="2"><DiamondIcon /> Any bet can trigger Progressive Jackpot</span>
      ]}
      footer="Valid for all visitors"
    />
  );
}

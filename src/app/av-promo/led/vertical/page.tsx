import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function LedVerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/ledscreen vertical.png"
      orientation="vertical"
      textAlign="center"
      showBottomPanel={true}
      subtitle="🌟 PROGRESSIVE JACKPOT BOOST"
      title="2X HAPPY HOURS JACKPOT"
      hook="DOUBLE THE PROGRESSIVE THRILL!"
      rewards={[
        <span key="1"><DiamondIcon /> STAR MINI JACKPOT: Starting from 15,000 KGS</span>,
        <span key="2"><DiamondIcon /> STAR MIDI JACKPOT: Starting from 40,000 KGS</span>,
        <span key="3"><DiamondIcon /> ANY BET CAN WIN: Random Time • Real Fortune</span>
      ]}
      scheduleTitle="NIGHTLY JACKPOT TIME"
      schedule={[
        <span key="1"><DiamondIcon /> NIGHTLY SESSION: Every Night 22:00h – 04:00h</span>,
        <span key="2"><DiamondIcon /> 2X Progressive Jackpot Time for All Visitors</span>
      ]}
      footer="Luck knows no limits • Valid for all visitors"
    />
  );
}

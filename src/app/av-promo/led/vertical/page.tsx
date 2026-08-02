import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function LedVerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/ledscreen vertical.png"
      orientation="vertical"
      containerPosition="top-12 left-1/2 -translate-x-1/2 items-center text-center"
      maxContainerWidth="max-w-[90vw]"
      textAlign="center"
      subtitle="PROGRESSIVE JACKPOT"
      title="HAPPY HOURS BOOST"
      hook="DOUBLE THE JACKPOT MAGIC!"
      rewards={[
        <span key="1"><DiamondIcon /> STAR MINI: Starting from 15,000 KGS</span>,
        <span key="2"><DiamondIcon /> STAR MIDI: Starting from 40,000 KGS</span>,
        <span key="3"><DiamondIcon /> Nightly Boost: Every Night 22:00 – 04:00</span>
      ]}
      scheduleTitle="HAPPY HOURS"
      schedule={[
        <span key="1"><DiamondIcon /> Nightly Session: 22:00 – 04:00</span>,
        <span key="2"><DiamondIcon /> Any bet can trigger Progressive Jackpot</span>
      ]}
      footer="Random time — real fortune • Open to all guests"
    />
  );
}

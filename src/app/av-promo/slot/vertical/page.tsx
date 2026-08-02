import React from "react";
import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function SlotVerticalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/slot_vertical.png"
      orientation="vertical"
      textAlign="center"
      showBottomPanel={true}
      subtitle="SLOT PROMOTIONS AUGUST 2026"
      title="MATCH PLAY & HAPPY HOURS JACKPOT"
      hook="1,000 KGS WELCOME BONUS + 2X PROGRESSIVE JACKPOT"
      rewards={[
        <span key="1"><DiamondIcon /> Welcome Bonus: 1,000 KGS Promo Ticket on Registration</span>,
        <span key="2"><DiamondIcon /> Match Play Bonus: Choose 1000/2000 | 2000/4000 | 2500/5000 KGS</span>,
        <span key="3"><DiamondIcon /> Slot Cashback: 10% Cash Back on Drops over 50,000 KGS</span>,
        <span key="4"><DiamondIcon /> Happy Hours Jackpots: STAR MINI 15,000 KGS | STAR MIDI 40,000 KGS</span>
      ]}
      scheduleTitle="MATCH PLAY & HAPPY HOURS SCHEDULE"
      schedule={[
        <span key="1"><DiamondIcon /> Match Play: Mon–Thu & Sun (18:00–22:00) | Fri–Sat (20:00–22:00)</span>,
        <span key="2"><DiamondIcon /> Happy Hours Jackpots: Daily 22:00h – 04:00h (Any Bet • Random Time)</span>
      ]}
      footer="Valid for all visitors"
    />
  );
}

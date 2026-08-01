import React from "react";
import { PromoScreen } from "@/components/av-promo/PromoScreen";

export default function HorizontalPromoPage() {
  return (
    <PromoScreen
      imageSrc="/images/promo/horizontal.png"
      orientation="horizontal"
      title="BACCARAT TRIPLE BOOST"
      subtitle="Play Bigger. Win Bigger. Get Rewarded!"
      hook="Place your bets and unlock an exclusive reward:"
      rewards={[
        "✦ Bet ×10",
        "✦ Win from $250 up to $5,000",
        "✦ Receive BONUS CHIPS + 2,000 KGS Promo Ticket"
      ]}
      scheduleTitle="Every Day"
      schedule={[
        "18:00 – 20:59",
        "21:00 – 23:59",
        "00:00 – 03:00"
      ]}
      footer="Open to All Guests"
    />
  );
}

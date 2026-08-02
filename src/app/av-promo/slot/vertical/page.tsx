import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function SlotVerticalPromo() {
  return (
    <PromoScreen
      imageSrc="/images/promo/slot_vertical.png"
      orientation="vertical"
      textAlign="center"
      showBottomPanel={true}
      subtitle="🎰 UNLEASH YOUR FORTUNE"
      title="SLOT MATCH PLAY & JACKPOTS"
      hook="1,000 KGS INSTANT WELCOME BONUS!"
      rewards={[
        <span key="1"><DiamondIcon /> WELCOME REWARD: 1,000 KGS Promo Ticket on Registration</span>,
        <span key="2"><DiamondIcon /> DOUBLE YOUR PLAY: Match Play Bonus 1,000 → 2,000 KGS | 2,500 → 5,000 KGS</span>,
        <span key="3"><DiamondIcon /> 10% SLOT CASHBACK: Instant Cash Back on Drops Over 50,000 KGS</span>,
        <span key="4"><DiamondIcon /> HAPPY HOURS BOOST: STAR MINI 15,000 KGS | STAR MIDI 40,000 KGS</span>
      ]}
      scheduleTitle="GOLDEN HOURS & NIGHTLY JACKPOTS"
      schedule={[
        <span key="1"><DiamondIcon /> GOLDEN HOURS: Mon–Thu & Sun (18:00–22:00) | Fri–Sat (20:00–22:00)</span>,
        <span key="2"><DiamondIcon /> NIGHTLY JACKPOTS: Every Night 22:00h – 04:00h (Any Bet • Random Time)</span>
      ]}
      footer="Your Jackpot is calling • Valid for all visitors"
    />
  );
}

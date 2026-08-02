import { PromoScreen, DiamondIcon } from "@/components/av-promo/PromoScreen";

export default function VerticalPromo() {
  return (
    <PromoScreen
      imageSrc="/images/promo/livegame_vertical.png"
      orientation="vertical"
      textAlign="center"
      showBottomPanel={true}
      subtitle="🏆 THE GRAND MONTHLY EVENT"
      title="AUGUST MONTHLY GIVEAWAY"
      hook="$50,000 + 500,000 KGS PRIZE POOL"
      rewards={[
        <span key="1"><DiamondIcon /> GRAND PRIZE: $25,000 CASH</span>,
        <span key="2"><DiamondIcon /> SECOND PRIZE: $10,000 CASH</span>,
        <span key="3"><DiamondIcon /> THIRD PRIZE: $5,000 CASH</span>,
        <span key="4"><DiamondIcon /> 10 LUCKY WINNERS: $1,000 CASH EACH</span>,
        <span key="5"><DiamondIcon /> 50 LUCKY WINNERS: 10,000 KGS PROMO CHIPS EACH</span>
      ]}
      scheduleTitle="GIVEAWAY DETAILS"
      schedule={[
        <span key="1"><DiamondIcon /> DRAW DATE: August 31st, 2026</span>,
        <span key="2"><DiamondIcon /> TIME: 22:00h</span>,
        <span key="3"><DiamondIcon /> EARN TICKETS: 1 Ticket per $1,000 Drop or 50,000 KGS Slot Play</span>
      ]}
      footer="Play with elegance • Win with style • Valid for all visitors"
    />
  );
}

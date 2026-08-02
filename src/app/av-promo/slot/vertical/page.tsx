import { PromoScreen, DiamondIcon, HighlightMoney } from "@/components/av-promo/PromoScreen";
import { SLOT_PROMO_DATA } from "@/config/promo-data";

export default function SlotVerticalPromo() {
  const data = SLOT_PROMO_DATA;
  const orientation: "horizontal" | "vertical" = "vertical";
  
  return (
    <PromoScreen
      imageSrc={`/images/promo/slot_${orientation}.png`}
      orientation={orientation}
      textAlign="center"
      showBottomPanel={true}
      subtitle={data.subtitle}
      title={data.title}
      hook={data.hook}
      rewards={[
        <div key="1" className="flex flex-col gap-1">
          <div><DiamondIcon /> <span className="font-bold text-gray-200">WELCOME REWARD:</span></div>
          <HighlightMoney>1,000 KGS FREE</HighlightMoney>
          <div className="text-sm md:text-base text-yellow-200/80">Promo Ticket on New Registration</div>
        </div>,
        <div key="2" className="flex flex-col gap-1">
          <div><DiamondIcon /> <span className="font-bold text-gray-200">DOUBLE YOUR PLAY:</span></div>
          <HighlightMoney>100% MATCH BONUS</HighlightMoney>
          <div className="text-sm md:text-base text-yellow-200/80">1,000 ➔ 2,000 KGS | 2,500 ➔ 5,000 KGS</div>
        </div>,
        <div key="3" className="flex flex-col gap-1">
          <div><DiamondIcon /> <span className="font-bold text-gray-200">HAPPY HOURS JACKPOT:</span></div>
          <HighlightMoney>STAR MIDI 40,000 KGS</HighlightMoney>
          <div className="text-sm md:text-base text-yellow-200/80">STAR MINI Starts from 15,000 KGS</div>
        </div>,
        <div key="4" className="flex flex-col gap-1">
          <div><DiamondIcon /> <span className="font-bold text-gray-200">SLOT CASHBACK:</span></div>
          <HighlightMoney>10% CASHBACK</HighlightMoney>
          <div className="text-sm md:text-base text-yellow-200/80">Instant Return on Drops over 50,000 KGS</div>
        </div>
      ]}
      scheduleTitle={data.scheduleTitle}
      schedule={data.schedule.map((s, i) => (
        <span key={i}><DiamondIcon /> {s.label}: <strong className="text-yellow-300">{s.time}</strong></span>
      ))}
      footer={data.footer}
    />
  );
}
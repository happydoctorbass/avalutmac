import { PromoScreen, DiamondIcon, HighlightMoney } from "@/components/av-promo/PromoScreen";
import { LIVEGAME_PROMO_DATA } from "@/config/promo-data";

export default function LedVerticalPromo() {
  const data = LIVEGAME_PROMO_DATA;
  const orientation: "horizontal" | "vertical" = "vertical";
  
  return (
    <PromoScreen
      imageSrc="/images/promo/ledscreen vertical.png"
      orientation={orientation}
      textAlign="center"
      showBottomPanel={true}
      subtitle={data.subtitle}
      title={data.title}
      hook={data.hook}
      rewards={[
        <div key="1" className="flex flex-col gap-1">
          <div><DiamondIcon /> <span className="font-bold text-gray-200">BACCARAT BOOST:</span> WIN UP TO</div>
          <HighlightMoney>$5,000 PROMO CHIPS</HighlightMoney>
          <div className="text-sm md:text-base text-yellow-200/80">+ 2,000 KGS TICKET on ×10 Bet</div>
        </div>,
        <div key="2" className="flex flex-col gap-1">
          <div><DiamondIcon /> <span className="font-bold text-gray-200">NIU NIU BOOST:</span> WIN UP TO</div>
          <HighlightMoney>$2,000 PROMO CHIPS</HighlightMoney>
          <div className="text-sm md:text-base text-yellow-200/80">+ 2,000 KGS TICKET on ×10 Bet</div>
        </div>,
        <div key="3" className="flex flex-col gap-1">
          <div><DiamondIcon /> <span className="font-bold text-gray-200">VIP DROP BONUS:</span></div>
          <HighlightMoney>10% CASHBACK + 10% CHIPS</HighlightMoney>
          <div className="text-sm md:text-base text-yellow-200/80">On Every $1,000 Drop</div>
        </div>,
        <div key="4" className="flex flex-col gap-1">
          <div><DiamondIcon /> <span className="font-bold text-gray-200">LOSS PROTECTION:</span></div>
          <HighlightMoney>5% PROMO REWARD</HighlightMoney>
          <div className="text-sm md:text-base text-yellow-200/80">Next Day Return on $5,000+ Loss</div>
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
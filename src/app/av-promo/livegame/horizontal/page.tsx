import { PromoScreen, DiamondIcon, HighlightMoney } from "@/components/av-promo/PromoScreen";
import { LIVEGAME_PROMO_DATA } from "@/config/promo-data";

export default function LiveGameHorizontalPromo() {
  const data = LIVEGAME_PROMO_DATA;
  return (
    <PromoScreen
      imageSrc="/images/promo/livegame_horizontal.png"
      orientation="horizontal"
      subtitle={data.subtitle}
      title={data.title}
      hook={data.hook}
      rewards={[
        <div key="1" className="flex flex-col gap-0.5 items-start text-left w-full">
          <div className="flex items-center text-sm md:text-base text-gray-200 font-bold"><DiamondIcon /> BACCARAT BOOST</div>
          <HighlightMoney>WIN UP TO $5,000</HighlightMoney>
          <div className="text-xs md:text-sm text-yellow-200/80">+ 2,000 KGS Ticket | Win on ×10 Bet</div>
        </div>,
        <div key="2" className="flex flex-col gap-0.5 items-start text-left w-full">
          <div className="flex items-center text-sm md:text-base text-gray-200 font-bold"><DiamondIcon /> NIU NIU BOOST</div>
          <HighlightMoney>WIN UP TO $2,000</HighlightMoney>
          <div className="text-xs md:text-sm text-yellow-200/80">+ 2,000 KGS Ticket | Win on ×10 Bet</div>
        </div>,
        <div key="3" className="flex flex-col gap-0.5 items-start text-left w-full">
          <div className="flex items-center text-sm md:text-base text-gray-200 font-bold"><DiamondIcon /> VIP DROP BONUS</div>
          <HighlightMoney>10% CASHBACK + 10% CHIPS</HighlightMoney>
          <div className="text-xs md:text-sm text-yellow-200/80">On Every $1,000 Drop in Live Games</div>
        </div>,
        <div key="4" className="flex flex-col gap-0.5 items-start text-left w-full">
          <div className="flex items-center text-sm md:text-base text-gray-200 font-bold"><DiamondIcon /> LOSS PROTECTION</div>
          <HighlightMoney>5% PROMO REWARD</HighlightMoney>
          <div className="text-xs md:text-sm text-yellow-200/80">Next Day Return on $5,000+ Losses</div>
        </div>
      ]}
      scheduleTitle={data.scheduleTitle}
      schedule={data.schedule.map((s, i) => (
        <div key={i} className="flex flex-col gap-1 items-start text-left w-full py-0.5">
          <div className="flex items-center text-base md:text-lg text-yellow-200 font-bold tracking-wide"><DiamondIcon /> {s.label}</div>
          <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffe58f] via-[#ffd700] to-[#c9a227] drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]">
            {s.time}
          </div>
        </div>
      ))}
      footer={data.footer}
    />
  );
}
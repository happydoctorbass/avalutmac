import { PromoScreen, DiamondIcon, HighlightMoney } from "@/components/av-promo/PromoScreen";
import { SLOT_PROMO_DATA } from "@/config/promo-data";

export default function SlotHorizontalPromo() {
  const data = SLOT_PROMO_DATA;
  return (
    <PromoScreen
      imageSrc="/images/promo/slot_horizontal.png"
      orientation="horizontal"
      subtitle={data.subtitle}
      title={data.title}
      hook={data.hook}
      rewards={[
        <div key="1" className="flex flex-col gap-0.5 items-start text-left w-full">
          <div className="flex items-center text-sm md:text-base text-gray-200 font-bold"><DiamondIcon /> WELCOME REWARD</div>
          <HighlightMoney>1,000 KGS FREE</HighlightMoney>
          <div className="text-xs md:text-sm text-yellow-200/80">Promo Ticket on New Registration</div>
        </div>,
        <div key="2" className="flex flex-col gap-0.5 items-start text-left w-full">
          <div className="flex items-center text-sm md:text-base text-gray-200 font-bold"><DiamondIcon /> DOUBLE YOUR PLAY</div>
          <HighlightMoney>100% MATCH BONUS</HighlightMoney>
          <div className="text-xs md:text-sm text-yellow-200/80">1,000 ➔ 2,000 KGS | 2,500 ➔ 5,000 KGS</div>
        </div>,
        <div key="3" className="flex flex-col gap-0.5 items-start text-left w-full">
          <div className="flex items-center text-sm md:text-base text-gray-200 font-bold"><DiamondIcon /> HAPPY HOURS JACKPOT</div>
          <HighlightMoney>STAR MIDI 40,000 KGS</HighlightMoney>
          <div className="text-xs md:text-sm text-yellow-200/80">STAR MINI Starts from 15,000 KGS</div>
        </div>,
        <div key="4" className="flex flex-col gap-0.5 items-start text-left w-full">
          <div className="flex items-center text-sm md:text-base text-gray-200 font-bold"><DiamondIcon /> SLOT CASHBACK</div>
          <HighlightMoney>10% CASHBACK</HighlightMoney>
          <div className="text-xs md:text-sm text-yellow-200/80">Instant Return on Drops over 50,000 KGS</div>
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
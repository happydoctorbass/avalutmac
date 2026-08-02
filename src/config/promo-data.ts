export interface RewardItem {
  id: string;
  badge?: string;
  title: string;
  highlightMoney: string; // Эта сумма должна рендериться КРУПНО, ЗОЛОТЫМ И ЖИРНЫМ ШРИФТОМ
  subtitle?: string;
}

export const SLOT_PROMO_DATA = {
  subtitle: "🎰 UNLEASH YOUR FORTUNE",
  title: "SLOTS MEGA BONUS & JACKPOTS",
  hook: "1,000 KGS WELCOME BONUS",
  rewards: [
    {
      id: "welcome",
      badge: "FREE TICKET",
      title: "WELCOME REWARD",
      highlightMoney: "1,000 KGS",
      subtitle: "Promo Ticket on Registration for Every New Player"
    },
    {
      id: "match",
      badge: "100% DOUBLE",
      title: "MATCH PLAY BONUS",
      highlightMoney: "UP TO 5,000 KGS",
      subtitle: "1,000 → 2,000 KGS | 2,000 → 4,000 KGS | 2,500 → 5,000 KGS"
    },
    {
      id: "jackpot",
      badge: "2X PROGRESSIVE",
      title: "HAPPY HOURS JACKPOT",
      highlightMoney: "40,000 KGS",
      subtitle: "STAR MINI from 15,000 KGS | STAR MIDI from 40,000 KGS"
    },
    {
      id: "cashback",
      badge: "INSTANT RETURN",
      title: "SLOT CASHBACK",
      highlightMoney: "10% CASHBACK",
      subtitle: "Instant Cash Back on all Drops over 50,000 KGS"
    }
  ],
  scheduleTitle: "TIME & SCHEDULE",
  schedule: [
    { label: "MATCH PLAY (Mon–Thu)", time: "18:00h – 22:00h" },
    { label: "MATCH PLAY (Fri–Sun)", time: "20:00h – 22:00h" },
    { label: "HAPPY HOURS JACKPOT", time: "Every Night 22:00h – 04:00h" }
  ],
  footer: "ANY BET • RANDOM TIME • VALID FOR ALL VISITORS"
};

export const LIVEGAME_PROMO_DATA = {
  subtitle: "♠ HIGH STAKES & EXCLUSIVE REWARDS",
  title: "TRIPLE BOOST & CASHBACK",
  hook: "WIN UP TO $5,000 PROMO CHIPS",
  rewards: [
    {
      id: "baccarat",
      badge: "X10 MULTIPLIER",
      title: "BACCARAT TRIPLE BOOST",
      highlightMoney: "UP TO $5,000",
      subtitle: "+ 2,000 KGS Ticket | Win min. $250 on ×10 Bet"
    },
    {
      id: "niuniu",
      badge: "X10 MULTIPLIER",
      title: "NIU NIU TRIPLE BOOST",
      highlightMoney: "UP TO $2,000",
      subtitle: "+ 2,000 KGS Ticket | Win min. $250 on ×10 Bet"
    },
    {
      id: "drop_bonus",
      badge: "DOUBLE BONUS",
      title: "VIP DROP REWARD",
      highlightMoney: "10% CASHBACK + 10% CHIPS",
      subtitle: "On Every $1,000 Drop in Live Games"
    },
    {
      id: "loss_protection",
      badge: "SAFETY NET",
      title: "NEXT DAY PROTECTION",
      highlightMoney: "5% PROMO REWARD",
      subtitle: "Valid Next Day Visit on Losses over $5,000"
    }
  ],
  scheduleTitle: "DAILY BOOST SESSIONS",
  schedule: [
    { label: "SESSION 1", time: "18:00h – 20:59h" },
    { label: "SESSION 2", time: "21:00h – 23:59h" },
    { label: "SESSION 3", time: "00:00h – 03:00h" }
  ],
  footer: "PLAY WITH ELEGANCE • WIN WITH STYLE • VALID FOR ALL VISITORS"
};

export const MEGA_AUGUST_DRAW_DATA = {
  subtitle: "🔥 AUGUST MONTHLY GRAND DRAW",
  title: "MEGA DRAW $50,000 + 50,000 KGS",
  hook: "JOIN THE $50,000 SUPER DRAW",
  draws: [
    {
      date: "15 AUGUST (TOTAL $20,000 + 20,000 KGS)",
      times: [
        "22:00h ➔ 2 × $2,000 + 2 × 2,000 KGS",
        "00:00h ➔ 2 × $3,000 + 2 × 3,000 KGS",
        "02:00h ➔ 2 × $5,000 + 2 × 5,000 KGS"
      ]
    },
    {
      date: "29 AUGUST (TOTAL $30,000 + 30,000 KGS)",
      times: [
        "22:00h ➔ 3 × $2,000 + 3 × 2,000 KGS",
        "00:00h ➔ 3 × $3,000 + 3 × 3,000 KGS",
        "02:00h ➔ 3 × $5,000 + 3 × 5,000 KGS"
      ]
    }
  ],
  howToGetTickets: "Live Game $1,000 Drop = 1 Ticket | Slot 80,000 KGS Drop = 1 Ticket",
  footer: "VALID FOR ALL VISITORS • TICKETS ACCUMULATE ALL MONTH"
};
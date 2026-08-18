export type UserRole = 'developer' | 'cashier';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Currency {
  id: string;
  code: string;
  name_ru: string;
  name_en: string;
  is_active: boolean;
  position: number;
  created_at: string;
}

export interface ExchangeRate {
  id: string;
  currency_id: string;
  buy_price: number;
  sell_price: number;
  updated_at: string;
  updated_by: string | null;
  currency?: Currency;
}

export interface ExchangeHistory {
  id: string;
  currency_id: string;
  old_buy_price: number | null;
  old_sell_price: number | null;
  new_buy_price: number;
  new_sell_price: number;
  changed_by: string | null;
  created_at: string;
  currency?: Currency;
  profile?: Profile;
}

export interface AuthLog {
  id: string;
  user_id: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

import { ExchangeRate } from '../_types';

export const APP_NAME = 'Exchange Rates Live Board (KGS)';
export const BASE_CURRENCY = 'KGS';
export const BASE_CURRENCY_NAME = 'Киргизский сом';

export const CURRENCY_FLAG_MAP: Record<string, string> = {
  USD: 'US',
  EUR: 'EU',
  RUB: 'RU',
  KZT: 'KZ',
  CNY: 'CN',
  KRW: 'KR',
  JPY: 'JP',
  GBP: 'GB',
  TRY: 'TR',
  AED: 'AE',
};

export const INITIAL_FALLBACK_RATES: ExchangeRate[] = [
  {
    id: 'fb-usd',
    currency_id: 'c-usd',
    buy_price: 87.5,
    sell_price: 88.0,
    updated_at: new Date().toISOString(),
    updated_by: null,
    currency: {
      id: 'c-usd',
      code: 'USD',
      name_ru: 'Доллар США',
      name_en: 'US Dollar',
      is_active: true,
      position: 1,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'fb-eur',
    currency_id: 'c-eur',
    buy_price: 94.2,
    sell_price: 95.0,
    updated_at: new Date().toISOString(),
    updated_by: null,
    currency: {
      id: 'c-eur',
      code: 'EUR',
      name_ru: 'Евро',
      name_en: 'Euro',
      is_active: true,
      position: 2,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'fb-rub',
    currency_id: 'c-rub',
    buy_price: 0.94,
    sell_price: 0.97,
    updated_at: new Date().toISOString(),
    updated_by: null,
    currency: {
      id: 'c-rub',
      code: 'RUB',
      name_ru: 'Российский рубль',
      name_en: 'Russian Ruble',
      is_active: true,
      position: 3,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'fb-kzt',
    currency_id: 'c-kzt',
    buy_price: 0.17,
    sell_price: 0.19,
    updated_at: new Date().toISOString(),
    updated_by: null,
    currency: {
      id: 'c-kzt',
      code: 'KZT',
      name_ru: 'Казахский тенге',
      name_en: 'Kazakhstani Tenge',
      is_active: true,
      position: 4,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'fb-cny',
    currency_id: 'c-cny',
    buy_price: 12.1,
    sell_price: 12.5,
    updated_at: new Date().toISOString(),
    updated_by: null,
    currency: {
      id: 'c-cny',
      code: 'CNY',
      name_ru: 'Китайский юань',
      name_en: 'Chinese Yuan',
      is_active: true,
      position: 5,
      created_at: new Date().toISOString(),
    },
  },
];

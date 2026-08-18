'use client';

import { useState, useEffect } from 'react';

export type LanguageCode = 'ru' | 'en' | 'zh';

export interface LanguageDictionary {
  brand: string;
  title: string;
  currency: string;
  buy: string;
  sell: string;
}

export const LANGUAGE_CYCLE_ORDER: readonly LanguageCode[] = ['ru', 'en', 'zh'] as const;

export const LANGUAGE_DICTIONARY: Record<LanguageCode, LanguageDictionary> = {
  ru: {
    brand: 'ADMIRAL CASINO',
    title: 'Курсы Валют',
    currency: 'Валюта',
    buy: 'Покупка',
    sell: 'Продажа',
  },
  en: {
    brand: 'ADMIRAL CASINO',
    title: 'Exchange Rates',
    currency: 'Currency',
    buy: 'Buy',
    sell: 'Sell',
  },
  zh: {
    brand: 'ADMIRAL CASINO',
    title: '汇率',
    currency: '币种',
    buy: '购买价格',
    sell: '出售价格',
  },
};

export function useLanguageCycle(intervalMs = 4000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % LANGUAGE_CYCLE_ORDER.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  const currentLanguage = LANGUAGE_CYCLE_ORDER[index];
  const texts = LANGUAGE_DICTIONARY[currentLanguage];

  return {
    index,
    currentLanguage,
    texts,
    allLanguages: LANGUAGE_CYCLE_ORDER,
  };
}

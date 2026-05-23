'use client';

import { useState } from 'react';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { CardData } from '@/types/game';
import pageStyles from './AdminPage.module.css';

export default function AdminPage() {
  const [currentCards, setCurrentCards] = useState<CardData[]>([]);

  return (
    <div className={pageStyles.page}>
      <AdminPanel currentCards={currentCards} onCardsGenerated={setCurrentCards} />
    </div>
  );
}

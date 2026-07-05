import { ReactNode } from 'react';
import { RouletteProvider } from '@/context/RouletteContext';

export default function RouletteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#022c22] text-white font-sans w-full h-full block">
      <RouletteProvider>
        {children}
      </RouletteProvider>
    </div>
  );
}

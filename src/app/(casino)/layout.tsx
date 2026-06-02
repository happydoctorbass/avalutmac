import { ReactNode } from 'react';

export default function CasinoLayout({ children }: { children: ReactNode }) {
  // Resetting potential flex/min-h inheritance from root layout
  return (
    <div className="min-h-screen bg-black text-white font-sans w-full h-full block">
      {children}
    </div>
  );
}

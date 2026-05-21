'use client';

interface AdminInputsProps {
  playerId: string;
  betAmount: string;
  onPlayerIdChange: (value: string) => void;
  onBetAmountChange: (value: string) => void;
}

export function AdminInputs({
  playerId,
  betAmount,
  onPlayerIdChange,
  onBetAmountChange,
}: AdminInputsProps) {
  return (
    <div className="flex gap-4 mb-6 max-w-2xl">
      <label className="flex-1">
        <span className="block text-sm font-bold text-slate-500 mb-2">ID Игрока</span>
        <input
          type="text"
          value={playerId}
          onChange={(e) => onPlayerIdChange(e.target.value)}
          placeholder="Например: P-1024"
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 outline-none"
        />
      </label>
      <label className="flex-1">
        <span className="block text-sm font-bold text-slate-500 mb-2">Сумма ставки</span>
        <input
          type="number"
          min="0"
          value={betAmount}
          onChange={(e) => onBetAmountChange(e.target.value)}
          placeholder="0"
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 outline-none"
        />
      </label>
    </div>
  );
}

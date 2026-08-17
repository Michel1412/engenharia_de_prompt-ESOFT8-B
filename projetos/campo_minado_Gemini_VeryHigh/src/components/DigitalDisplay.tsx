import React from 'react';

interface DigitalDisplayProps {
  value: number;
  label?: string;
  id?: string;
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({ value, label, id }) => {
  // Format to 3 digits (-99 to 999)
  const formatNumber = (num: number): string => {
    if (num < 0) {
      const positive = Math.min(Math.abs(num), 99);
      return `-${String(positive).padStart(2, '0')}`;
    }
    const clamped = Math.min(num, 999);
    return String(clamped).padStart(3, '0');
  };

  const formatted = formatNumber(value);

  return (
    <div id={id} className="flex flex-col items-center select-none">
      {label && (
        <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 mb-1">
          {label}
        </span>
      )}
      <div className="bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded shadow-inner flex items-center justify-center font-mono">
        <span className="text-2xl sm:text-3xl font-bold tracking-widest text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
          {formatted}
        </span>
      </div>
    </div>
  );
};

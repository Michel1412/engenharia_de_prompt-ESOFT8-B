import React from 'react';
import { DigitalDisplay } from './DigitalDisplay';
import { FaceButton } from './FaceButton';

interface HUDProps {
  minesRemaining: number;
  time: number;
  emotion: 'idle' | 'scared' | 'won' | 'lost';
  onReset: () => void;
}

export const HUD: React.FC<HUDProps> = ({ minesRemaining, time, emotion, onReset }) => {
  return (
    <div
      id="game-hud"
      className="w-full bg-zinc-100 dark:bg-zinc-800/80 border-2 border-t-zinc-400 border-l-zinc-400 border-r-white/80 border-b-white/80 dark:border-t-zinc-900 dark:border-l-zinc-900 dark:border-r-zinc-600 dark:border-b-zinc-600 p-3 sm:p-4 rounded-lg flex items-center justify-between shadow-inner"
    >
      {/* Mines remaining counter */}
      <DigitalDisplay id="display-mines" value={minesRemaining} label="Minas" />

      {/* Center Face reset button */}
      <FaceButton emotion={emotion} onClick={onReset} />

      {/* Timer counter */}
      <DigitalDisplay id="display-timer" value={time} label="Tempo" />
    </div>
  );
};

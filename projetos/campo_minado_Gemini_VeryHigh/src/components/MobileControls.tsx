import React from 'react';
import { TouchMode } from '../types/minesweeper';
import { Shovel, Flag, Volume2, VolumeX, HelpCircle, RotateCcw } from 'lucide-react';

interface MobileControlsProps {
  touchMode: TouchMode;
  onSetTouchMode: (mode: TouchMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHowToPlay: () => void;
  onReset: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  touchMode,
  onSetTouchMode,
  isMuted,
  onToggleMute,
  onOpenHowToPlay,
  onReset,
}) => {
  return (
    <div
      id="mobile-action-bar"
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 shadow-lg flex items-center justify-between gap-2 select-none"
    >
      {/* Dig vs Flag Mode Toggle */}
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
        <button
          id="btn-mode-dig"
          onClick={() => onSetTouchMode('dig')}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all
            ${
              touchMode === 'dig'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }
          `}
        >
          <Shovel className="w-4 h-4" />
          <span>Abrir</span>
        </button>

        <button
          id="btn-mode-flag"
          onClick={() => onSetTouchMode('flag')}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all
            ${
              touchMode === 'flag'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }
          `}
        >
          <Flag className="w-4 h-4" />
          <span>Bandeira</span>
        </button>
      </div>

      {/* Extra Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          id="btn-sound-toggle"
          onClick={onToggleMute}
          title={isMuted ? 'Ativar som' : 'Desativar som'}
          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-blue-500" />}
        </button>

        <button
          id="btn-how-to-play"
          onClick={onOpenHowToPlay}
          title="Instruções & Dicas"
          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          id="btn-quick-reset"
          onClick={onReset}
          title="Reiniciar"
          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

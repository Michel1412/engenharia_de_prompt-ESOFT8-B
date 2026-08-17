import React from 'react';
import { Smile, Frown, Sparkles, RefreshCw, Flag, Pickaxe } from 'lucide-react';
import { GameStatus, ThemeConfig } from '../types';

interface ScoreBoardProps {
  minesLeft: number;
  timeSeconds: number;
  status: GameStatus;
  isMouseDownOnBoard?: boolean;
  theme: ThemeConfig;
  flagModeActive: boolean;
  onToggleFlagMode: () => void;
  onReset: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  minesLeft,
  timeSeconds,
  status,
  isMouseDownOnBoard = false,
  theme,
  flagModeActive,
  onToggleFlagMode,
  onReset,
}) => {
  // Format numbers to 3 digits (e.g. "010", "-05", "999")
  const formatNumber = (num: number): string => {
    if (num < 0) {
      const absVal = Math.min(Math.abs(num), 99);
      return `-${String(absVal).padStart(2, '0')}`;
    }
    const clamped = Math.min(num, 999);
    return String(clamped).padStart(3, '0');
  };

  const getStatusFace = () => {
    if (status === 'won') {
      return (
        <span className="flex items-center text-amber-300">
          <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
        </span>
      );
    }
    if (status === 'lost') {
      return <Frown className="w-6 h-6 text-rose-400" />;
    }
    if (isMouseDownOnBoard && status === 'playing') {
      return <span className="text-xl leading-none">😮</span>;
    }
    return <Smile className="w-6 h-6 text-amber-400" />;
  };

  return (
    <div
      id="scoreboard-container"
      className={`
        w-full flex items-center justify-between gap-2 px-4 py-3
        rounded-lg border mb-3 select-none
        ${theme.headerBg}
      `}
    >
      {/* Contador de Minas */}
      <div className="flex flex-col items-start">
        <span className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${theme.textSecondary}`}>
          Minas
        </span>
        <div
          id="mines-counter"
          aria-label={`${minesLeft} minas restantes`}
          className={`
            px-2.5 py-1 rounded border shadow-inner text-lg sm:text-xl font-bold tracking-widest leading-none
            ${theme.counterBg} ${theme.counterText}
          `}
        >
          {formatNumber(minesLeft)}
        </div>
      </div>

      {/* Botões Centrais (Reset Face & Flag Mode Mobile Toggle) */}
      <div className="flex items-center gap-2">
        <button
          id="reset-game-btn"
          type="button"
          onClick={onReset}
          title="Reiniciar partida"
          aria-label="Reiniciar partida"
          className={`
            w-11 h-11 flex items-center justify-center rounded-lg border
            shadow-md transition-all duration-150 active:scale-95 cursor-pointer
            ${theme.cellUnrevealed} ${theme.cellUnrevealedHover}
          `}
        >
          {getStatusFace()}
        </button>

        {/* Mobile/Touch Mode Toggle */}
        <button
          id="toggle-flag-mode-btn"
          type="button"
          onClick={onToggleFlagMode}
          title={flagModeActive ? 'Modo Bandeira ativo (Clique para Revelar)' : 'Modo Revelação ativo (Clique para Bandeira)'}
          className={`
            sm:hidden flex items-center gap-1 px-2.5 py-2 rounded-lg border text-xs font-semibold
            transition-all duration-150 cursor-pointer shadow-sm
            ${
              flagModeActive
                ? 'bg-rose-600/90 text-rose-50 border-rose-400 shadow-rose-900/40 ring-1 ring-rose-400'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }
          `}
        >
          {flagModeActive ? (
            <>
              <Flag className="w-3.5 h-3.5 fill-rose-300 text-rose-200" />
              <span>Bandeira</span>
            </>
          ) : (
            <>
              <Pickaxe className="w-3.5 h-3.5 text-slate-300" />
              <span>Cavar</span>
            </>
          )}
        </button>
      </div>

      {/* Cronômetro */}
      <div className="flex flex-col items-end">
        <span className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${theme.textSecondary}`}>
          Tempo
        </span>
        <div
          id="timer-counter"
          aria-label={`Tempo decorrido: ${timeSeconds} segundos`}
          className={`
            px-2.5 py-1 rounded border shadow-inner text-lg sm:text-xl font-bold tracking-widest leading-none
            ${theme.counterBg} ${theme.counterText}
          `}
        >
          {formatNumber(timeSeconds)}
        </div>
      </div>
    </div>
  );
};

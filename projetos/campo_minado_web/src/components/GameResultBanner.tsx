import React from 'react';
import { Trophy, Skull, RotateCcw, Clock, Target } from 'lucide-react';
import { DifficultyId, GameStatus, ThemeConfig } from '../types';
import { DIFFICULTIES } from '../constants/gameConfig';

interface GameResultBannerProps {
  status: GameStatus;
  timeSeconds: number;
  difficultyId: DifficultyId;
  theme: ThemeConfig;
  bestTime: number | null;
  onRestart: () => void;
}

export const GameResultBanner: React.FC<GameResultBannerProps> = ({
  status,
  timeSeconds,
  difficultyId,
  theme,
  bestTime,
  onRestart,
}) => {
  if (status !== 'won' && status !== 'lost') return null;

  const isWon = status === 'won';
  const difficultyName = DIFFICULTIES[difficultyId].label;

  return (
    <div
      id="game-result-banner"
      className={`
        w-full p-4 rounded-xl border mt-3 transition-all duration-300 animate-scale-in
        ${
          isWon
            ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border-emerald-500/60 shadow-xl shadow-emerald-950/40 text-emerald-100'
            : 'bg-gradient-to-r from-rose-950/90 to-stone-950/90 border-rose-500/60 shadow-xl shadow-rose-950/40 text-rose-100'
        }
      `}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              ${isWon ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-400/40' : 'bg-rose-500/20 text-rose-400 ring-2 ring-rose-400/40'}
            `}
          >
            {isWon ? <Trophy className="w-6 h-6 animate-bounce" /> : <Skull className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-lg leading-tight">
              {isWon ? 'Vitória! Campo Desarmado!' : 'Fim de Jogo! Você atingiu uma mina.'}
            </h4>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs mt-1 opacity-90">
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                {difficultyName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeSeconds}s
              </span>
              {isWon && bestTime && bestTime === timeSeconds && (
                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-semibold text-[10px]">
                  Novo Recorde!
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          id="banner-play-again-btn"
          type="button"
          onClick={onRestart}
          className={`
            w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold
            flex items-center justify-center gap-2 cursor-pointer shadow-md
            transition-all duration-150 active:scale-95
            ${
              isWon
                ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950'
                : 'bg-rose-500 hover:bg-rose-400 text-white'
            }
          `}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isWon ? 'Jogar Novamente' : 'Tentar Novamente'}</span>
        </button>
      </div>
    </div>
  );
};

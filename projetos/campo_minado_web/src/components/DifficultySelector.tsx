import React from 'react';
import { DifficultyId, ThemeConfig } from '../types';
import { DIFFICULTIES } from '../constants/gameConfig';
import { Sparkles } from 'lucide-react';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyId;
  theme: ThemeConfig;
  onSelectDifficulty: (difficulty: DifficultyId) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  theme,
  onSelectDifficulty,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${theme.textSecondary}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dificuldade</span>
        </label>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md bg-black/30 border border-white/10 ${theme.textSecondary}`}>
          {DIFFICULTIES[currentDifficulty].description}
        </span>
      </div>

      <div
        id="difficulty-selector-group"
        role="radiogroup"
        aria-label="Seleção de nível de dificuldade"
        className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-black/35 border border-white/10"
      >
        {(Object.keys(DIFFICULTIES) as DifficultyId[]).map((key) => {
          const config = DIFFICULTIES[key];
          const isSelected = currentDifficulty === key;

          return (
            <button
              key={key}
              id={`difficulty-btn-${key}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectDifficulty(key)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium
                transition-all duration-200 cursor-pointer text-center border select-none
                ${
                  isSelected
                    ? `${theme.selectorBgActive} ${theme.accentRing} font-bold scale-[1.02]`
                    : 'bg-black/25 hover:bg-white/5 border-white/10 text-white/80 hover:text-white hover:border-white/20'
                }
              `}
            >
              <span className="text-xs sm:text-sm font-semibold">{config.label}</span>
              <span className="text-[10px] opacity-85 mt-0.5 whitespace-nowrap">
                {config.rows}×{config.cols} ({config.mines}m)
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

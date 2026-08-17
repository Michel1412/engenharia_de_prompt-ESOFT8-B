import React from 'react';
import { DifficultyLevel } from '../types/minesweeper';
import { Sliders, Sparkles } from 'lucide-react';

interface DifficultySelectorProps {
  currentLevel: DifficultyLevel;
  onSelectLevel: (level: DifficultyLevel) => void;
  onOpenCustomModal: () => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentLevel,
  onSelectLevel,
  onOpenCustomModal,
}) => {
  const options: { level: Exclude<DifficultyLevel, 'custom'>; label: string; desc: string }[] = [
    { level: 'beginner', label: 'Iniciante', desc: '9×9 • 10 minas' },
    { level: 'intermediate', label: 'Intermediário', desc: '16×16 • 40 minas' },
    { level: 'expert', label: 'Especialista', desc: '30×16 • 99 minas' },
  ];

  return (
    <div id="difficulty-selector" className="w-full flex flex-wrap gap-1.5 sm:gap-2 justify-center items-center">
      {options.map(opt => {
        const isActive = currentLevel === opt.level;
        return (
          <button
            key={opt.level}
            id={`btn-diff-${opt.level}`}
            onClick={() => onSelectLevel(opt.level)}
            className={`
              px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 flex flex-col items-center
              ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/80'
              }
            `}
          >
            <span>{opt.label}</span>
            <span className={`text-[10px] sm:text-[11px] font-normal opacity-80 ${isActive ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
              {opt.desc}
            </span>
          </button>
        );
      })}

      <button
        id="btn-diff-custom"
        onClick={onOpenCustomModal}
        className={`
          px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 flex flex-col items-center
          ${
            currentLevel === 'custom'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/80'
          }
        `}
      >
        <span className="flex items-center gap-1">
          <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          Personalizado
        </span>
        <span className={`text-[10px] sm:text-[11px] font-normal opacity-80 ${currentLevel === 'custom' ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
          Definir grade
        </span>
      </button>
    </div>
  );
};

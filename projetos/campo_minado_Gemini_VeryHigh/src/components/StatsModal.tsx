import React from 'react';
import { GameStats } from '../types/minesweeper';
import { X, Trophy, Clock, Award, Trash2 } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, onResetStats }) => {
  if (!isOpen) return null;

  const categories: { key: keyof GameStats; label: string }[] = [
    { key: 'beginner', label: 'Iniciante (9×9)' },
    { key: 'intermediate', label: 'Intermediário (16×16)' },
    { key: 'expert', label: 'Especialista (30×16)' },
    { key: 'custom', label: 'Personalizado' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="stats-modal"
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-zinc-900 dark:text-zinc-100"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold">Estatísticas & Recordes</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          {categories.map(({ key, label }) => {
            const data = stats[key];
            const winRate = data.played > 0 ? Math.round((data.won / data.played) * 100) : 0;

            return (
              <div
                key={key}
                className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{label}</h3>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Jogos: <span className="font-medium text-zinc-700 dark:text-zinc-300">{data.played}</span> • Vitórias:{' '}
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{data.won}</span> ({winRate}%)
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Melhor Tempo</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-base text-amber-600 dark:text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{data.bestTime !== null ? `${data.bestTime}s` : '--'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Tem certeza que deseja zerar todas as estatísticas?')) {
                onResetStats();
              }
            }}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar Recordes
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

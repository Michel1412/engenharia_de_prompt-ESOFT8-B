import React from 'react';
import { Bomb, Trophy, HelpCircle, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  onOpenStats: () => void;
  onOpenHowToPlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStats,
  onOpenHowToPlay,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="w-full max-w-4xl flex items-center justify-between py-3 px-2 sm:px-0">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Bomb className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Campo Minado
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              Pro
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          id="btn-header-sound"
          onClick={onToggleMute}
          title={isMuted ? 'Ativar som' : 'Desativar som'}
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        </button>

        <button
          id="btn-header-stats"
          onClick={onOpenStats}
          title="Ver Estatísticas"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700/60"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Recordes</span>
        </button>

        <button
          id="btn-header-help"
          onClick={onOpenHowToPlay}
          title="Como Jogar"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700/60"
        >
          <HelpCircle className="w-4 h-4 text-blue-500" />
          <span className="hidden sm:inline">Ajuda</span>
        </button>
      </div>
    </header>
  );
};

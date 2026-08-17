import React, { useState, useEffect, useCallback } from 'react';
import { useMinesweeper } from './hooks/useMinesweeper';
import { Header } from './components/Header';
import { DifficultySelector } from './components/DifficultySelector';
import { HUD } from './components/HUD';
import { Board } from './components/Board';
import { MobileControls } from './components/MobileControls';
import { CustomDifficultyModal } from './components/CustomDifficultyModal';
import { StatsModal } from './components/StatsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { Trophy, Skull, RotateCcw } from 'lucide-react';

export default function App() {
  const {
    grid,
    gameStatus,
    difficulty,
    config,
    time,
    minesRemaining,
    touchMode,
    isMuted,
    faceEmotion,
    stats,
    setTouchMode,
    setFaceEmotion,
    resetGame,
    changeDifficulty,
    handleCellClick,
    handleCellContextMenu,
    handleCellDoubleClick,
    handleToggleFlag,
    toggleMute,
    resetStats,
  } = useMinesweeper();

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Global keyboard shortcuts (R for reset, Space for mode toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modal or input is focused
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        resetGame();
      } else if (e.code === 'Space') {
        e.preventDefault();
        setTouchMode(prev => (prev === 'dig' ? 'flag' : 'dig'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetGame, setTouchMode]);

  const handleMouseDownUnrevealed = useCallback(() => {
    setFaceEmotion('scared');
  }, [setFaceEmotion]);

  const handleMouseUpUnrevealed = useCallback(() => {
    if (gameStatus === 'playing' || gameStatus === 'idle') {
      setFaceEmotion('idle');
    }
  }, [gameStatus, setFaceEmotion]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-zinc-50 dark:bg-zinc-950 px-3 sm:px-6 py-4 transition-colors duration-200">
      {/* Top Header */}
      <Header
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      <main className="w-full max-w-4xl flex flex-col items-center gap-4 my-auto pb-6">
        {/* Difficulty Selector */}
        <DifficultySelector
          currentLevel={difficulty}
          onSelectLevel={level => changeDifficulty(level)}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
        />

        {/* Game Window Card */}
        <div
          id="minesweeper-window"
          className="w-full max-w-full bg-zinc-200 dark:bg-zinc-800/90 border-2 border-t-white border-l-white border-r-zinc-400 border-b-zinc-400 dark:border-t-zinc-600 dark:border-l-zinc-600 dark:border-r-zinc-900 dark:border-b-zinc-900 p-3 sm:p-5 rounded-2xl shadow-xl flex flex-col gap-3 sm:gap-4 items-center"
        >
          {/* HUD Area */}
          <HUD
            minesRemaining={minesRemaining}
            time={time}
            emotion={faceEmotion}
            onReset={() => resetGame()}
          />

          {/* Game Outcome Toast Banner */}
          {gameStatus === 'won' && (
            <div className="w-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-4 py-2.5 rounded-xl flex items-center justify-between text-sm font-semibold animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Vitória espetacular! Tempo: <strong>{time}s</strong></span>
              </div>
              <button
                onClick={() => resetGame()}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Jogar Novamente
              </button>
            </div>
          )}

          {gameStatus === 'lost' && (
            <div className="w-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 px-4 py-2.5 rounded-xl flex items-center justify-between text-sm font-semibold animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-rose-500" />
                <span>Boom! Uma mina explodiu.</span>
              </div>
              <button
                onClick={() => resetGame()}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Tentar de Novo
              </button>
            </div>
          )}

          {/* Board Grid */}
          <Board
            grid={grid}
            rows={config.rows}
            cols={config.cols}
            gameStatus={gameStatus}
            onCellClick={handleCellClick}
            onCellContextMenu={handleCellContextMenu}
            onCellDoubleClick={handleCellDoubleClick}
            onCellLongPress={handleToggleFlag}
            onMouseDownUnrevealed={handleMouseDownUnrevealed}
            onMouseUpUnrevealed={handleMouseUpUnrevealed}
          />
        </div>

        {/* Mobile & Quick Actions Bar */}
        <MobileControls
          touchMode={touchMode}
          onSetTouchMode={setTouchMode}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onReset={() => resetGame()}
        />

        {/* Quick keyboard & interaction hint */}
        <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 hidden sm:block select-none">
          <span className="font-semibold text-zinc-500 dark:text-zinc-400">Atalhos:</span> Clique com botão direito para bandeira • Clique em número para <strong>Chording</strong> • <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-[11px]">R</kbd> reiniciar • <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-[11px]">Espaço</kbd> alternar modo
        </div>
      </main>

      {/* Modals */}
      <CustomDifficultyModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        initialRows={config.rows}
        initialCols={config.cols}
        initialMines={config.mines}
        onApply={(r, c, m) => changeDifficulty('custom', { rows: r, cols: c, mines: m })}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
        onResetStats={resetStats}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}

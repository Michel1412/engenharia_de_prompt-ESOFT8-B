/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle, RefreshCw, Shield } from 'lucide-react';
import { DifficultyId, GameStatus, ThemeId, CellData } from './types';
import { DIFFICULTIES, THEMES } from './constants/gameConfig';
import {
  createEmptyBoard,
  populateMines,
  revealCell,
  toggleFlag,
  chordCell,
  revealAllMines,
  flagAllMinesOnWin,
  checkWinCondition,
  countFlags,
} from './utils/minesweeper';
import { ScoreBoard } from './components/ScoreBoard';
import { Board } from './components/Board';
import { DifficultySelector } from './components/DifficultySelector';
import { ThemeSelector } from './components/ThemeSelector';
import { InstructionsModal } from './components/InstructionsModal';
import { GameResultBanner } from './components/GameResultBanner';

export default function App() {
  const [difficulty, setDifficulty] = useState<DifficultyId>('easy');
  const [themeId, setThemeId] = useState<ThemeId>('classic-green');
  const [board, setBoard] = useState<CellData[][]>(() =>
    createEmptyBoard(DIFFICULTIES.easy.rows, DIFFICULTIES.easy.cols)
  );
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [flagModeActive, setFlagModeActive] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [bestTimes, setBestTimes] = useState<Record<DifficultyId, number | null>>(() => {
    try {
      const saved = localStorage.getItem('campo_minado_best_times');
      return saved ? JSON.parse(saved) : { easy: null, medium: null, hard: null };
    } catch {
      return { easy: null, medium: null, hard: null };
    }
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTheme = THEMES[themeId] || THEMES['classic-green'];
  const currentDiffConfig = DIFFICULTIES[difficulty];

  // Initialize or reset game
  const resetGame = useCallback(
    (newDiff?: DifficultyId) => {
      const diffToUse = newDiff || difficulty;
      const config = DIFFICULTIES[diffToUse];
      setBoard(createEmptyBoard(config.rows, config.cols));
      setStatus('idle');
      setTimeSeconds(0);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    },
    [difficulty]
  );

  // Switch difficulty
  const handleSelectDifficulty = (newDiff: DifficultyId) => {
    if (newDiff === difficulty) return;
    setDifficulty(newDiff);
    resetGame(newDiff);
  };

  // Switch visual scenario (theme) - does not affect board or game state
  const handleSelectTheme = (newTheme: ThemeId) => {
    setThemeId(newTheme);
  };

  // Timer logic
  useEffect(() => {
    if (status === 'playing') {
      timerIntervalRef.current = setInterval(() => {
        setTimeSeconds((prev) => (prev < 999 ? prev + 1 : 999));
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [status]);

  // Handle cell reveal (Left Click / Tap)
  const handleReveal = (row: number, col: number) => {
    if (status === 'won' || status === 'lost') return;

    let activeBoard = board;

    // First click: generate mines safely
    if (status === 'idle') {
      activeBoard = populateMines(
        board,
        currentDiffConfig.rows,
        currentDiffConfig.cols,
        currentDiffConfig.mines,
        row,
        col
      );
      setStatus('playing');
    }

    const { newBoard, hitMine } = revealCell(
      activeBoard,
      row,
      col,
      currentDiffConfig.rows,
      currentDiffConfig.cols
    );

    if (hitMine) {
      const revealedBoard = revealAllMines(
        newBoard,
        currentDiffConfig.rows,
        currentDiffConfig.cols
      );
      setBoard(revealedBoard);
      setStatus('lost');
      return;
    }

    // Check if player won
    const isWin = checkWinCondition(
      newBoard,
      currentDiffConfig.rows,
      currentDiffConfig.cols,
      currentDiffConfig.mines
    );

    if (isWin) {
      const flaggedBoard = flagAllMinesOnWin(
        newBoard,
        currentDiffConfig.rows,
        currentDiffConfig.cols
      );
      setBoard(flaggedBoard);
      setStatus('won');

      // Update best time
      setBestTimes((prev) => {
        const currentBest = prev[difficulty];
        const currentTime = timeSeconds || 1;
        const newBest = currentBest === null || currentTime < currentBest ? currentTime : currentBest;
        const updated = { ...prev, [difficulty]: newBest };
        try {
          localStorage.setItem('campo_minado_best_times', JSON.stringify(updated));
        } catch {
          // ignore storage error
        }
        return updated;
      });
      return;
    }

    setBoard(newBoard);
  };

  // Handle flag toggle (Right Click / Long Press / Flag mode)
  const handleToggleFlag = (row: number, col: number) => {
    if (status === 'won' || status === 'lost') return;
    const newBoard = toggleFlag(board, row, col);
    setBoard(newBoard);
  };

  // Handle chording on already revealed numbers
  const handleChord = (row: number, col: number) => {
    if (status !== 'playing') return;

    const { newBoard, hitMine, revealedAny } = chordCell(
      board,
      row,
      col,
      currentDiffConfig.rows,
      currentDiffConfig.cols
    );

    if (!revealedAny) return;

    if (hitMine) {
      const revealedBoard = revealAllMines(
        newBoard,
        currentDiffConfig.rows,
        currentDiffConfig.cols
      );
      setBoard(revealedBoard);
      setStatus('lost');
      return;
    }

    const isWin = checkWinCondition(
      newBoard,
      currentDiffConfig.rows,
      currentDiffConfig.cols,
      currentDiffConfig.mines
    );

    if (isWin) {
      const flaggedBoard = flagAllMinesOnWin(
        newBoard,
        currentDiffConfig.rows,
        currentDiffConfig.cols
      );
      setBoard(flaggedBoard);
      setStatus('won');
      return;
    }

    setBoard(newBoard);
  };

  const flagsPlaced = countFlags(board);
  const minesLeft = currentDiffConfig.mines - flagsPlaced;

  return (
    <div
      className={`
        min-h-screen w-full flex flex-col items-center justify-start p-3 sm:p-6
        bg-gradient-to-br ${currentTheme.bgGradient} transition-colors duration-500
        text-white font-sans selection:bg-white/20
      `}
    >
      {/* Container Principal */}
      <main
        className={`
          w-full max-w-4xl flex flex-col items-center rounded-2xl p-4 sm:p-6
          border ${currentTheme.cardBg} transition-all duration-300
        `}
      >
        {/* Cabeçalho do Jogo */}
        <header className="w-full flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-black/40 border border-white/10 ${currentTheme.accent}`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>Campo Minado</span>
                <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border ${currentTheme.badgeBg}`}>
                  {currentTheme.name}
                </span>
              </h1>
              <p className={`text-xs ${currentTheme.textSecondary}`}>
                Desarme as {currentDiffConfig.mines} minas ocultas no tabuleiro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="help-guide-btn"
              type="button"
              onClick={() => setIsHelpOpen(true)}
              aria-label="Abrir guia de instruções"
              title="Como jogar"
              className="p-2 rounded-lg bg-black/30 hover:bg-black/50 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              id="restart-game-header-btn"
              type="button"
              onClick={() => resetGame()}
              aria-label="Reiniciar partida"
              title="Nova partida"
              className="p-2 rounded-lg bg-black/30 hover:bg-black/50 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>

        {/* Seletores de Dificuldade e Cenário Visual */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <DifficultySelector
            currentDifficulty={difficulty}
            theme={currentTheme}
            onSelectDifficulty={handleSelectDifficulty}
          />
          <ThemeSelector
            currentThemeId={themeId}
            theme={currentTheme}
            onSelectTheme={handleSelectTheme}
          />
        </section>

        {/* Painel do Jogo (Scoreboard + Tabuleiro) */}
        <section className="w-full flex flex-col items-center">
          <div className="w-full max-w-full flex flex-col items-center">
            <ScoreBoard
              minesLeft={minesLeft}
              timeSeconds={timeSeconds}
              status={status}
              isMouseDownOnBoard={isMouseDown}
              theme={currentTheme}
              flagModeActive={flagModeActive}
              onToggleFlagMode={() => setFlagModeActive((prev) => !prev)}
              onReset={() => resetGame()}
            />

            <Board
              board={board}
              theme={currentTheme}
              status={status}
              flagModeActive={flagModeActive}
              onReveal={handleReveal}
              onToggleFlag={handleToggleFlag}
              onChord={handleChord}
              onMouseDownBoard={() => setIsMouseDown(true)}
              onMouseUpBoard={() => setIsMouseDown(false)}
            />

            {/* Banner de Vitória / Derrota */}
            <GameResultBanner
              status={status}
              timeSeconds={timeSeconds}
              difficultyId={difficulty}
              theme={currentTheme}
              bestTime={bestTimes[difficulty]}
              onRestart={() => resetGame()}
            />
          </div>
        </section>

        {/* Rodapé / Informações Rápidas */}
        <footer className="w-full flex flex-wrap items-center justify-between gap-2 mt-5 pt-3 border-t border-white/10 text-xs text-white/60">
          <div className="flex items-center gap-3">
            <span>
              Recorde ({currentDiffConfig.label}):{' '}
              <strong className="text-white">
                {bestTimes[difficulty] !== null ? `${bestTimes[difficulty]}s` : '—'}
              </strong>
            </span>
          </div>

          <div className="text-[11px] text-white/50">
            Dica: Clique com o botão direito para posicionar bandeiras 🚩
          </div>
        </footer>
      </main>

      {/* Modal de Instruções */}
      <InstructionsModal
        isOpen={isHelpOpen}
        theme={currentTheme}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

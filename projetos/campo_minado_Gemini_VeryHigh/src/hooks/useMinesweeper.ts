import React, { useState, useEffect, useCallback, useRef, MouseEvent } from 'react';
import confetti from 'canvas-confetti';
import {
  Cell,
  GameStatus,
  DifficultyLevel,
  DifficultyConfig,
  DIFFICULTY_PRESETS,
  TouchMode,
  GameStats,
} from '../types/minesweeper';
import {
  createEmptyGrid,
  populateMinesAndNeighbors,
  executeReveal,
  executeChord,
  toggleFlag as engineToggleFlag,
} from '../engine/minesweeperEngine';
import { soundManager } from '../utils/audio';

const STATS_STORAGE_KEY = 'minesweeper_pro_stats';

const DEFAULT_STATS: GameStats = {
  beginner: { bestTime: null, played: 0, won: 0 },
  intermediate: { bestTime: null, played: 0, won: 0 },
  expert: { bestTime: null, played: 0, won: 0 },
  custom: { bestTime: null, played: 0, won: 0 },
};

export function useMinesweeper() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [config, setConfig] = useState<DifficultyConfig>(DIFFICULTY_PRESETS.beginner);
  const [grid, setGrid] = useState<Cell[][]>(() =>
    createEmptyGrid(DIFFICULTY_PRESETS.beginner.rows, DIFFICULTY_PRESETS.beginner.cols)
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [time, setTime] = useState<number>(0);
  const [firstClickDone, setFirstClickDone] = useState<boolean>(false);
  const [touchMode, setTouchMode] = useState<TouchMode>('dig');
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());
  const [faceEmotion, setFaceEmotion] = useState<'idle' | 'scared' | 'won' | 'lost'>('idle');

  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_STATS;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate flags count
  const flagCount = grid.reduce(
    (total, row) => total + row.filter(cell => cell.isFlagged).length,
    0
  );
  const minesRemaining = config.mines - flagCount;

  // Save stats to localStorage
  const saveStats = useCallback((updated: GameStats) => {
    setStats(updated);
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  // Update stats on win or loss
  const recordGameResult = useCallback(
    (won: boolean, finalTime: number) => {
      const levelKey = difficulty;
      const currentLevelStats = stats[levelKey] || { bestTime: null, played: 0, won: 0 };

      const updatedPlayed = currentLevelStats.played + 1;
      const updatedWon = won ? currentLevelStats.won + 1 : currentLevelStats.won;
      const updatedBest =
        won && (currentLevelStats.bestTime === null || finalTime < currentLevelStats.bestTime)
          ? finalTime
          : currentLevelStats.bestTime;

      const newStats: GameStats = {
        ...stats,
        [levelKey]: {
          played: updatedPlayed,
          won: updatedWon,
          bestTime: updatedBest,
        },
      };

      saveStats(newStats);
    },
    [difficulty, stats, saveStats]
  );

  // Timer interval control
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTime(prev => Math.min(prev + 1, 999));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStatus]);

  // Sync emotion with game status
  useEffect(() => {
    if (gameStatus === 'won') {
      setFaceEmotion('won');
    } else if (gameStatus === 'lost') {
      setFaceEmotion('lost');
    } else {
      setFaceEmotion('idle');
    }
  }, [gameStatus]);

  // Start / Reset game
  const resetGame = useCallback(
    (newConfig?: DifficultyConfig) => {
      const targetConfig = newConfig || config;
      if (newConfig) {
        setConfig(newConfig);
        setDifficulty(newConfig.level);
      }
      setGrid(createEmptyGrid(targetConfig.rows, targetConfig.cols));
      setGameStatus('idle');
      setTime(0);
      setFirstClickDone(false);
      setFaceEmotion('idle');
    },
    [config]
  );

  // Change preset difficulty
  const changeDifficulty = useCallback(
    (level: DifficultyLevel, customParams?: { rows: number; cols: number; mines: number }) => {
      let nextConfig: DifficultyConfig;
      if (level === 'custom' && customParams) {
        nextConfig = {
          name: 'Personalizado',
          level: 'custom',
          rows: customParams.rows,
          cols: customParams.cols,
          mines: customParams.mines,
        };
      } else if (level !== 'custom') {
        nextConfig = DIFFICULTY_PRESETS[level];
      } else {
        return;
      }
      resetGame(nextConfig);
    },
    [resetGame]
  );

  // Flag toggle handler
  const handleToggleFlag = useCallback(
    (r: number, c: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost') return;

      const cell = grid[r][c];
      if (cell.isRevealed) return;

      const willBeFlagged = !cell.isFlagged;
      const updatedGrid = engineToggleFlag(grid, r, c);
      setGrid(updatedGrid);

      if (willBeFlagged) {
        soundManager.playFlag();
      } else {
        soundManager.playUnflag();
      }
    },
    [grid, gameStatus]
  );

  // Cell reveal / dig handler
  const handleReveal = useCallback(
    (r: number, c: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost') return;

      const cell = grid[r][c];
      if (cell.isRevealed || cell.isFlagged) return;

      let currentWorkingGrid = grid;

      // Safe First Click Protection: Initialize mines if this is the very first move
      if (!firstClickDone) {
        currentWorkingGrid = populateMinesAndNeighbors(
          grid,
          config.rows,
          config.cols,
          config.mines,
          r,
          c
        );
        setFirstClickDone(true);
        setGameStatus('playing');
      }

      const { newGrid, hitMine, won } = executeReveal(
        currentWorkingGrid,
        config.rows,
        config.cols,
        config.mines,
        r,
        c
      );

      setGrid(newGrid);

      if (hitMine) {
        soundManager.playExplosion();
        setGameStatus('lost');
        recordGameResult(false, time);
      } else if (won) {
        soundManager.playVictory();
        setGameStatus('won');
        recordGameResult(true, time);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        soundManager.playDig();
      }
    },
    [gameStatus, grid, firstClickDone, config, time, recordGameResult]
  );

  // Chording handler
  const handleChord = useCallback(
    (r: number, c: number) => {
      if (gameStatus !== 'playing') return;

      const cell = grid[r][c];
      if (!cell.isRevealed || cell.neighborMines === 0) return;

      const { newGrid, hitMine, won, executed } = executeChord(
        grid,
        config.rows,
        config.cols,
        config.mines,
        r,
        c
      );

      if (!executed) return;

      setGrid(newGrid);

      if (hitMine) {
        soundManager.playExplosion();
        setGameStatus('lost');
        recordGameResult(false, time);
      } else if (won) {
        soundManager.playVictory();
        setGameStatus('won');
        recordGameResult(true, time);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        soundManager.playChord();
      }
    },
    [gameStatus, grid, config, time, recordGameResult]
  );

  // Unified click handler (handles both Desktop clicks and Touch Mode actions)
  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost') return;

      const cell = grid[r][c];

      // If clicked on an already revealed number, try Chording immediately
      if (cell.isRevealed) {
        if (cell.neighborMines > 0) {
          handleChord(r, c);
        }
        return;
      }

      // Mobile Touch Mode routing
      if (touchMode === 'flag') {
        handleToggleFlag(r, c);
      } else {
        handleReveal(r, c);
      }
    },
    [gameStatus, grid, touchMode, handleChord, handleToggleFlag, handleReveal]
  );

  // Mouse Right Click (Flagging)
  const handleCellContextMenu = useCallback(
    (r: number, c: number, e: React.MouseEvent) => {
      e.preventDefault();
      handleToggleFlag(r, c);
    },
    [handleToggleFlag]
  );

  // Double Click explicitly for desktop Chording
  const handleCellDoubleClick = useCallback(
    (r: number, c: number) => {
      handleChord(r, c);
    },
    [handleChord]
  );

  // Sound toggle
  const toggleMute = useCallback(() => {
    const nextMute = soundManager.toggleMute();
    setIsMuted(nextMute);
  }, []);

  // Reset Stats
  const resetStats = useCallback(() => {
    saveStats(DEFAULT_STATS);
  }, [saveStats]);

  return {
    grid,
    gameStatus,
    difficulty,
    config,
    time,
    flagCount,
    minesRemaining,
    firstClickDone,
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
    handleChord,
    toggleMute,
    resetStats,
  };
}

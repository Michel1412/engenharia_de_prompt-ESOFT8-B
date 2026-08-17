export interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  isExploded?: boolean;
  isWrongFlag?: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert' | 'custom';

export interface DifficultyConfig {
  name: string;
  level: DifficultyLevel;
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTY_PRESETS: Record<Exclude<DifficultyLevel, 'custom'>, DifficultyConfig> = {
  beginner: {
    name: 'Iniciante',
    level: 'beginner',
    rows: 9,
    cols: 9,
    mines: 10,
  },
  intermediate: {
    name: 'Intermediário',
    level: 'intermediate',
    rows: 16,
    cols: 16,
    mines: 40,
  },
  expert: {
    name: 'Especialista',
    level: 'expert',
    rows: 16,
    cols: 30,
    mines: 99,
  },
};

export type TouchMode = 'dig' | 'flag';

export interface GameStats {
  beginner: { bestTime: number | null; played: number; won: number };
  intermediate: { bestTime: number | null; played: number; won: number };
  expert: { bestTime: number | null; played: number; won: number };
  custom: { bestTime: number | null; played: number; won: number };
}

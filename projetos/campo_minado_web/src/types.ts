export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type DifficultyId = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  rows: number;
  cols: number;
  mines: number;
  description: string;
}

export type ThemeId = 'classic-green' | 'night' | 'snow' | 'desert';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  themeTag: string;
  bgGradient: string;
  cardBg: string;
  boardBg: string;
  boardBorder: string;
  cellUnrevealed: string;
  cellUnrevealedHover: string;
  cellRevealed: string;
  cellRevealedMine: string;
  cellBorder: string;
  headerBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  counterBg: string;
  counterText: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  accentRing: string;
  selectorBgActive: string;
  swatchColors: [string, string, string];
}

export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  isExploded?: boolean;
  isWrongFlag?: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: Record<DifficultyId, number | null>;
}

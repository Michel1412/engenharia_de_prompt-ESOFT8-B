export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameStatus = 'menu' | 'playing' | 'won' | 'lost'

export type CardKind = 'help' | 'penalty'

export type CardId =
  | 'radar'
  | 'safe_hint'
  | 'sweep'
  | 'fog'
  | 'tremors'
  | 'blindness'

export interface Cell {
  row: number
  col: number
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
  /** Mina marcada pelo Radar (visível sem explodir). */
  radarMarked: boolean
  /** Reserva visual (Dica Segura agora revela células diretamente). */
  safeHint: boolean
}

export interface CardDefinition {
  id: CardId
  kind: CardKind
  name: string
  description: string
  /** Duração em ms; null = efeito instantâneo permanente na partida. */
  durationMs: number | null
}

export interface DrawnCardEvent {
  card: CardDefinition
  drawnAtElapsedMs: number
  message: string
}

export interface GameState {
  status: GameStatus
  difficulty: Difficulty
  rows: number
  cols: number
  mineCount: number
  board: Cell[][]
  flagsLeft: number
  revealedSafe: number
  totalSafe: number
  firstClickDone: boolean
  /** Tempo de jogo acumulado (pausa em menu / fim). */
  elapsedMs: number
  /** Âncora de relógio real para calcular delta no TICK. */
  clockAnchorMs: number | null
  /** Quantas cartas já foram sorteadas nesta partida. */
  cardsDrawn: number
  /** Contagem regressiva até a próxima carta (ms). */
  nextCardInMs: number
  /** Efeitos temporários ativos (expiram por elapsedMs). */
  fogUntilMs: number
  blindnessUntilMs: number
  shakeUntilMs: number
  lastCard: DrawnCardEvent | null
  /** Histórico curto para HUD. */
  cardHistory: DrawnCardEvent[]
}

export type GameAction =
  | { type: 'SELECT_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'START_GAME'; difficulty: Difficulty }
  | { type: 'REVEAL'; row: number; col: number }
  | { type: 'TOGGLE_FLAG'; row: number; col: number }
  | { type: 'TICK'; nowMs: number }
  | { type: 'DISMISS_CARD' }
  | { type: 'BACK_TO_MENU' }
  | { type: 'RESTART' }

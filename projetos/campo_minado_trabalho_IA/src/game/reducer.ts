import { CARD_INTERVAL_MS, createEmptyBoard, DIFFICULTY_CONFIG, placeMines, revealCell, toggleFlag } from './board'
import { applyCard, drawRandomCard } from './cards'
import type { Difficulty, DrawnCardEvent, GameAction, GameState } from './types'

export function createInitialState(): GameState {
  return {
    status: 'menu',
    difficulty: 'easy',
    rows: 9,
    cols: 9,
    mineCount: 10,
    board: [],
    flagsLeft: 10,
    revealedSafe: 0,
    totalSafe: 71,
    firstClickDone: false,
    elapsedMs: 0,
    clockAnchorMs: null,
    cardsDrawn: 0,
    nextCardInMs: CARD_INTERVAL_MS,
    fogUntilMs: 0,
    blindnessUntilMs: 0,
    shakeUntilMs: 0,
    lastCard: null,
    cardHistory: [],
  }
}

function startFresh(difficulty: Difficulty): GameState {
  const cfg = DIFFICULTY_CONFIG[difficulty]
  const totalSafe = cfg.rows * cfg.cols - cfg.mines
  return {
    ...createInitialState(),
    status: 'playing',
    difficulty,
    rows: cfg.rows,
    cols: cfg.cols,
    mineCount: cfg.mines,
    board: createEmptyBoard(cfg.rows, cfg.cols),
    flagsLeft: cfg.mines,
    totalSafe,
    clockAnchorMs: Date.now(),
    nextCardInMs: CARD_INTERVAL_MS,
  }
}

function maybeDrawCards(state: GameState): GameState {
  if (state.status !== 'playing') return state

  const expectedCards = Math.floor(state.elapsedMs / CARD_INTERVAL_MS)
  if (expectedCards <= state.cardsDrawn) {
    return {
      ...state,
      nextCardInMs: CARD_INTERVAL_MS - (state.elapsedMs % CARD_INTERVAL_MS),
    }
  }

  let next = { ...state }
  for (let i = state.cardsDrawn; i < expectedCards; i += 1) {
    const card = drawRandomCard()
    const applied = applyCard(next, card)
    const event: DrawnCardEvent = {
      card,
      drawnAtElapsedMs: (i + 1) * CARD_INTERVAL_MS,
      message: applied.message,
    }
    next = {
      ...next,
      ...applied,
      cardsDrawn: i + 1,
      lastCard: event,
      cardHistory: [event, ...next.cardHistory].slice(0, 6),
    }
    if (next.status === 'won' || next.status === 'lost') break
  }

  return {
    ...next,
    nextCardInMs:
      next.status === 'playing'
        ? CARD_INTERVAL_MS - (next.elapsedMs % CARD_INTERVAL_MS)
        : next.nextCardInMs,
    clockAnchorMs: next.status === 'playing' ? next.clockAnchorMs : null,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_DIFFICULTY':
      return { ...state, difficulty: action.difficulty }

    case 'START_GAME':
      return startFresh(action.difficulty)

    case 'BACK_TO_MENU':
      return createInitialState()

    case 'RESTART':
      return startFresh(state.difficulty)

    case 'DISMISS_CARD':
      return {
        ...state,
        lastCard: null,
        clockAnchorMs: state.status === 'playing' ? Date.now() : null,
      }

    case 'TICK': {
      if (state.status !== 'playing' || state.clockAnchorMs == null) return state
      const delta = Math.max(0, action.nowMs - state.clockAnchorMs)
      const elapsedMs = state.elapsedMs + delta
      const ticking: GameState = {
        ...state,
        elapsedMs,
        clockAnchorMs: action.nowMs,
        nextCardInMs: CARD_INTERVAL_MS - (elapsedMs % CARD_INTERVAL_MS),
      }
      return maybeDrawCards(ticking)
    }

    case 'TOGGLE_FLAG': {
      if (state.status !== 'playing') return state
      const cell = state.board[action.row]?.[action.col]
      if (!cell || cell.isRevealed) return state
      if (!cell.isFlagged && state.flagsLeft <= 0) return state

      const board = toggleFlag(state.board, action.row, action.col)
      const flagged = board[action.row][action.col].isFlagged
      return {
        ...state,
        board,
        flagsLeft: state.flagsLeft + (flagged ? -1 : 1),
      }
    }

    case 'REVEAL': {
      if (state.status !== 'playing') return state
      const target = state.board[action.row]?.[action.col]
      if (!target || target.isRevealed || target.isFlagged) return state

      let board = state.board
      let firstClickDone = state.firstClickDone

      if (!firstClickDone) {
        board = placeMines(board, state.mineCount, action.row, action.col)
        firstClickDone = true
      }

      const result = revealCell(board, action.row, action.col)
      if (result.hitMine) {
        return {
          ...state,
          board: result.board,
          firstClickDone,
          status: 'lost',
          clockAnchorMs: null,
        }
      }

      const revealedSafe = state.revealedSafe + result.newlyRevealed
      const won = revealedSafe >= state.totalSafe

      return {
        ...state,
        board: result.board,
        firstClickDone,
        revealedSafe,
        status: won ? 'won' : 'playing',
        clockAnchorMs: won ? null : state.clockAnchorMs,
        flagsLeft: state.mineCount - countFlags(result.board),
      }
    }

    default:
      return state
  }
}

function countFlags(board: GameState['board']): number {
  let n = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) n += 1
    }
  }
  return n
}

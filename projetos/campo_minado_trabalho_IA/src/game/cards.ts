import type { CardDefinition, CardId, GameState } from './types'
import {
  clearAllFlags,
  markRandomMine,
  revealSafeCluster,
  revealSafeHints,
  SAFE_HINT_REVEALS,
} from './board'

export const CARDS: Record<CardId, CardDefinition> = {
  radar: {
    id: 'radar',
    kind: 'help',
    name: 'Radar',
    description: 'Revela a posição de uma mina oculta sem detoná-la.',
    durationMs: null,
  },
  safe_hint: {
    id: 'safe_hint',
    kind: 'help',
    name: 'Dica Segura',
    description:
      'Revela células seguras conforme a dificuldade (Fácil 3, Médio 12, Difícil 18).',
    durationMs: null,
  },
  sweep: {
    id: 'sweep',
    kind: 'help',
    name: 'Varredura',
    description: 'Abre automaticamente um pequeno grupo de células seguras.',
    durationMs: null,
  },
  fog: {
    id: 'fog',
    kind: 'penalty',
    name: 'Névoa',
    description: 'Oculta os números das células reveladas por 12 segundos.',
    durationMs: 12_000,
  },
  tremors: {
    id: 'tremors',
    kind: 'penalty',
    name: 'Tremores',
    description: 'Remove todas as bandeiras e sacode o tabuleiro por 4 segundos.',
    durationMs: 4_000,
  },
  blindness: {
    id: 'blindness',
    kind: 'penalty',
    name: 'Cegueira',
    description: 'Ofusca o conteúdo visual das células por 8 segundos.',
    durationMs: 8_000,
  },
}

const ALL_CARD_IDS = Object.keys(CARDS) as CardId[]

export function drawRandomCard(): CardDefinition {
  const id = ALL_CARD_IDS[Math.floor(Math.random() * ALL_CARD_IDS.length)]
  return CARDS[id]
}

export function applyCard(
  state: GameState,
  card: CardDefinition,
): Pick<
  GameState,
  | 'board'
  | 'flagsLeft'
  | 'revealedSafe'
  | 'fogUntilMs'
  | 'blindnessUntilMs'
  | 'shakeUntilMs'
  | 'status'
> & { message: string } {
  const elapsed = state.elapsedMs

  switch (card.id) {
    case 'radar': {
      const { board, message } = markRandomMine(state.board)
      return {
        board,
        flagsLeft: state.mineCount - countFlagsOn(board),
        revealedSafe: state.revealedSafe,
        fogUntilMs: state.fogUntilMs,
        blindnessUntilMs: state.blindnessUntilMs,
        shakeUntilMs: state.shakeUntilMs,
        status: state.status,
        message,
      }
    }
    case 'safe_hint': {
      const count = SAFE_HINT_REVEALS[state.difficulty]
      const { board, revealed, message } = revealSafeHints(state.board, count)
      const revealedSafe = state.revealedSafe + revealed
      const won = revealedSafe >= state.totalSafe
      return {
        board,
        flagsLeft: state.mineCount - countFlagsOn(board),
        revealedSafe,
        fogUntilMs: state.fogUntilMs,
        blindnessUntilMs: state.blindnessUntilMs,
        shakeUntilMs: state.shakeUntilMs,
        status: won ? 'won' : state.status,
        message,
      }
    }
    case 'sweep': {
      const { board, revealed, message } = revealSafeCluster(state.board, 5)
      const revealedSafe = state.revealedSafe + revealed
      const won = revealedSafe >= state.totalSafe
      return {
        board,
        flagsLeft: state.mineCount - countFlagsOn(board),
        revealedSafe,
        fogUntilMs: state.fogUntilMs,
        blindnessUntilMs: state.blindnessUntilMs,
        shakeUntilMs: state.shakeUntilMs,
        status: won ? 'won' : state.status,
        message,
      }
    }
    case 'fog': {
      return {
        board: state.board,
        flagsLeft: state.flagsLeft,
        revealedSafe: state.revealedSafe,
        fogUntilMs: Math.max(state.fogUntilMs, elapsed + (card.durationMs ?? 0)),
        blindnessUntilMs: state.blindnessUntilMs,
        shakeUntilMs: state.shakeUntilMs,
        status: state.status,
        message: 'Névoa densa: os números sumiram temporariamente.',
      }
    }
    case 'tremors': {
      const { board, flagsCleared } = clearAllFlags(state.board)
      return {
        board,
        flagsLeft: state.mineCount,
        revealedSafe: state.revealedSafe,
        fogUntilMs: state.fogUntilMs,
        blindnessUntilMs: state.blindnessUntilMs,
        shakeUntilMs: Math.max(state.shakeUntilMs, elapsed + (card.durationMs ?? 0)),
        status: state.status,
        message:
          flagsCleared > 0
            ? `Tremores derrubaram ${flagsCleared} bandeira${flagsCleared === 1 ? '' : 's'}.`
            : 'O chão tremeu, mas não havia bandeiras.',
      }
    }
    case 'blindness': {
      return {
        board: state.board,
        flagsLeft: state.flagsLeft,
        revealedSafe: state.revealedSafe,
        fogUntilMs: state.fogUntilMs,
        blindnessUntilMs: Math.max(
          state.blindnessUntilMs,
          elapsed + (card.durationMs ?? 0),
        ),
        shakeUntilMs: state.shakeUntilMs,
        status: state.status,
        message: 'Cegueira: o tabuleiro ficou ofuscado.',
      }
    }
  }
}

function countFlagsOn(board: GameState['board']): number {
  let n = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) n += 1
    }
  }
  return n
}

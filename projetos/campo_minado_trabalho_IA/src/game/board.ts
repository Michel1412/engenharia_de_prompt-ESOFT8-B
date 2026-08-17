import type { Cell, Difficulty } from './types'

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { rows: number; cols: number; mines: number; label: string }
> = {
  easy: { rows: 9, cols: 9, mines: 10, label: 'Fácil' },
  medium: { rows: 16, cols: 16, mines: 40, label: 'Médio' },
  hard: { rows: 16, cols: 30, mines: 99, label: 'Difícil' },
}

export const CARD_INTERVAL_MS = 60_000

export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
      radarMarked: false,
      safeHint: false,
    })),
  )
}

function inBounds(rows: number, cols: number, r: number, c: number) {
  return r >= 0 && r < rows && c >= 0 && c < cols
}

export function neighbors(rows: number, cols: number, row: number, col: number) {
  const result: Array<[number, number]> = []
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (inBounds(rows, cols, nr, nc)) result.push([nr, nc])
    }
  }
  return result
}

function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

/** Coloca minas evitando a célula do primeiro clique e seus vizinhos. */
export function placeMines(
  board: Cell[][],
  mineCount: number,
  safeRow: number,
  safeCol: number,
): Cell[][] {
  const next = cloneBoard(board)
  const rows = next.length
  const cols = next[0].length
  const forbidden = new Set<string>([`${safeRow},${safeCol}`])
  for (const [nr, nc] of neighbors(rows, cols, safeRow, safeCol)) {
    forbidden.add(`${nr},${nc}`)
  }

  const candidates: Array<[number, number]> = []
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (!forbidden.has(`${r},${c}`)) candidates.push([r, c])
    }
  }

  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  const minesToPlace = Math.min(mineCount, candidates.length)
  for (let i = 0; i < minesToPlace; i += 1) {
    const [r, c] = candidates[i]
    next[r][c].isMine = true
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (next[r][c].isMine) {
        next[r][c].adjacentMines = 0
        continue
      }
      let count = 0
      for (const [nr, nc] of neighbors(rows, cols, r, c)) {
        if (next[nr][nc].isMine) count += 1
      }
      next[r][c].adjacentMines = count
    }
  }

  return next
}

export function revealCell(
  board: Cell[][],
  row: number,
  col: number,
): { board: Cell[][]; hitMine: boolean; newlyRevealed: number } {
  const next = cloneBoard(board)
  const cell = next[row][col]
  if (cell.isRevealed || cell.isFlagged) {
    return { board: next, hitMine: false, newlyRevealed: 0 }
  }

  if (cell.isMine) {
    cell.isRevealed = true
    cell.safeHint = false
    // Revela todas as minas na derrota
    for (const line of next) {
      for (const c of line) {
        if (c.isMine) c.isRevealed = true
      }
    }
    return { board: next, hitMine: true, newlyRevealed: 0 }
  }

  let newlyRevealed = 0
  const queue: Array<[number, number]> = [[row, col]]

  while (queue.length > 0) {
    const [r, c] = queue.shift()!
    const current = next[r][c]
    if (current.isRevealed || current.isFlagged || current.isMine) continue

    current.isRevealed = true
    current.safeHint = false
    current.radarMarked = false
    newlyRevealed += 1

    if (current.adjacentMines === 0) {
      for (const [nr, nc] of neighbors(next.length, next[0].length, r, c)) {
        const n = next[nr][nc]
        if (!n.isRevealed && !n.isFlagged && !n.isMine) {
          queue.push([nr, nc])
        }
      }
    }
  }

  return { board: next, hitMine: false, newlyRevealed }
}

export function toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
  const next = cloneBoard(board)
  const cell = next[row][col]
  if (cell.isRevealed) return next
  cell.isFlagged = !cell.isFlagged
  return next
}

export function clearAllFlags(board: Cell[][]): { board: Cell[][]; flagsCleared: number } {
  const next = cloneBoard(board)
  let flagsCleared = 0
  for (const row of next) {
    for (const cell of row) {
      if (cell.isFlagged) {
        cell.isFlagged = false
        flagsCleared += 1
      }
    }
  }
  return { board: next, flagsCleared }
}

export function countFlags(board: Cell[][]): number {
  let n = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) n += 1
    }
  }
  return n
}

export function revealSafeCluster(
  board: Cell[][],
  maxCells: number,
): { board: Cell[][]; revealed: number; message: string } {
  const next = cloneBoard(board)
  const rows = next.length
  const cols = next[0].length
  const starts: Array<[number, number]> = []

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cell = next[r][c]
      if (!cell.isMine && !cell.isRevealed && !cell.isFlagged) {
        starts.push([r, c])
      }
    }
  }

  if (starts.length === 0) {
    return { board: next, revealed: 0, message: 'Não havia células seguras para varrer.' }
  }

  const [sr, sc] = starts[Math.floor(Math.random() * starts.length)]
  const queue: Array<[number, number]> = [[sr, sc]]
  const visited = new Set<string>()
  let revealed = 0

  while (queue.length > 0 && revealed < maxCells) {
    const [r, c] = queue.shift()!
    const key = `${r},${c}`
    if (visited.has(key)) continue
    visited.add(key)

    const cell = next[r][c]
    if (cell.isMine || cell.isRevealed || cell.isFlagged) continue

    cell.isRevealed = true
    cell.safeHint = false
    cell.radarMarked = false
    revealed += 1

    for (const [nr, nc] of neighbors(rows, cols, r, c)) {
      const n = next[nr][nc]
      if (!n.isMine && !n.isRevealed && !n.isFlagged) {
        queue.push([nr, nc])
      }
    }
  }

  return {
    board: next,
    revealed,
    message: `Varredura abriu ${revealed} célula${revealed === 1 ? '' : 's'} segura${revealed === 1 ? '' : 's'}.`,
  }
}

export function markRandomMine(board: Cell[][]): { board: Cell[][]; message: string } {
  const next = cloneBoard(board)
  const candidates: Cell[] = []
  for (const row of next) {
    for (const cell of row) {
      if (cell.isMine && !cell.isRevealed && !cell.radarMarked) {
        candidates.push(cell)
      }
    }
  }

  if (candidates.length === 0) {
    return { board: next, message: 'Todas as minas ocultas já estavam marcadas.' }
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)]
  pick.radarMarked = true
  if (pick.isFlagged) pick.isFlagged = false

  return {
    board: next,
    message: `Radar localizou uma mina em (${pick.row + 1}, ${pick.col + 1}).`,
  }
}

/** Quantidade de células seguras reveladas pela Dica Segura por dificuldade. */
export const SAFE_HINT_REVEALS: Record<Difficulty, number> = {
  easy: 3,
  medium: 12,
  hard: 18,
}

/** Revela até `count` células seguras aleatórias (sem flood fill). */
export function revealSafeHints(
  board: Cell[][],
  count: number,
): { board: Cell[][]; revealed: number; message: string } {
  const next = cloneBoard(board)

  for (const row of next) {
    for (const cell of row) {
      cell.safeHint = false
    }
  }

  const candidates: Cell[] = []
  for (const row of next) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isRevealed) {
        candidates.push(cell)
      }
    }
  }

  if (candidates.length === 0) {
    return { board: next, revealed: 0, message: 'Não restavam células seguras para revelar.' }
  }

  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  const toReveal = Math.min(count, candidates.length)
  for (let i = 0; i < toReveal; i += 1) {
    const cell = candidates[i]
    cell.isRevealed = true
    cell.isFlagged = false
    cell.radarMarked = false
    cell.safeHint = false
  }

  return {
    board: next,
    revealed: toReveal,
    message: `Dica Segura revelou ${toReveal} célula${toReveal === 1 ? '' : 's'} segura${toReveal === 1 ? '' : 's'}.`,
  }
}

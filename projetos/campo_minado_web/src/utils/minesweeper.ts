import { CellData } from '../types';

/**
 * Creates an empty board of given dimensions
 */
export function createEmptyBoard(rows: number, cols: number): CellData[][] {
  const board: CellData[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      });
    }
    board.push(row);
  }
  return board;
}

/**
 * Populates mines ensuring the first clicked cell (and immediate neighbors if space permits) is safe
 */
export function populateMines(
  board: CellData[][],
  rows: number,
  cols: number,
  minesCount: number,
  safeRow: number,
  safeCol: number
): CellData[][] {
  const newBoard: CellData[][] = board.map((row) => row.map((cell) => ({ ...cell })));
  const totalCells = rows * cols;
  const clampedMines = Math.min(minesCount, totalCells - 1);

  // Exclude initial clicked cell and ideally adjacent cells from having mines
  const excludedCoords = new Set<string>();
  excludedCoords.add(`${safeRow},${safeCol}`);

  // If there's enough space, also exclude 8 neighbors for a guaranteed open patch
  if (totalCells - 9 >= clampedMines) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = safeRow + dr;
        const nc = safeCol + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          excludedCoords.add(`${nr},${nc}`);
        }
      }
    }
  }

  // Create list of candidate coordinates
  const candidates: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!excludedCoords.has(`${r},${c}`)) {
        candidates.push([r, c]);
      }
    }
  }

  // If candidates aren't enough (edge case), add other cells back except safeRow, safeCol
  if (candidates.length < clampedMines) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === safeRow && c === safeCol) continue;
        if (!candidates.some(([cr, cc]) => cr === r && cc === c)) {
          candidates.push([r, c]);
        }
      }
    }
  }

  // Randomly select mine positions
  let minesPlaced = 0;
  while (minesPlaced < clampedMines && candidates.length > 0) {
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const [r, c] = candidates.splice(randomIndex, 1)[0];
    newBoard[r][c].isMine = true;
    minesPlaced++;
  }

  // Calculate neighbor numbers
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
            count++;
          }
        }
      }
      newBoard[r][c].neighborMines = count;
    }
  }

  return newBoard;
}

/**
 * Revela uma célula e realiza flood-fill caso neighborMines === 0
 */
export function revealCell(
  board: CellData[][],
  row: number,
  col: number,
  rows: number,
  cols: number
): { newBoard: CellData[][]; hitMine: boolean } {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const target = newBoard[row][col];

  if (target.isRevealed || target.isFlagged) {
    return { newBoard, hitMine: false };
  }

  if (target.isMine) {
    target.isRevealed = true;
    target.isExploded = true;
    return { newBoard, hitMine: true };
  }

  // Flood fill BFS
  const queue: [number, number][] = [[row, col]];
  target.isRevealed = true;

  while (queue.length > 0) {
    const [currR, currC] = queue.shift()!;
    const currCell = newBoard[currR][currC];

    // Only expand neighbors if current cell has zero adjacent mines
    if (currCell.neighborMines === 0 && !currCell.isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = currR + dr;
          const nc = currC + dc;

          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const neighbor = newBoard[nr][nc];
            if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
              neighbor.isRevealed = true;
              if (neighbor.neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }
  }

  return { newBoard, hitMine: false };
}

/**
 * Toggles a flag on an unrevealed cell
 */
export function toggleFlag(board: CellData[][], row: number, col: number): CellData[][] {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const cell = newBoard[row][col];
  if (!cell.isRevealed) {
    cell.isFlagged = !cell.isFlagged;
  }
  return newBoard;
}

/**
 * Handles Chording (revealing adjacent unflagged cells if flagged count matches neighbor number)
 */
export function chordCell(
  board: CellData[][],
  row: number,
  col: number,
  rows: number,
  cols: number
): { newBoard: CellData[][]; hitMine: boolean; revealedAny: boolean } {
  const cell = board[row][col];
  if (!cell.isRevealed || cell.neighborMines === 0) {
    return { newBoard: board, hitMine: false, revealedAny: false };
  }

  // Count flags around
  let flagCount = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isFlagged) {
        flagCount++;
      }
    }
  }

  if (flagCount !== cell.neighborMines) {
    return { newBoard: board, hitMine: false, revealedAny: false };
  }

  let currentBoard = board;
  let hitMine = false;
  let revealedAny = false;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighbor = currentBoard[nr][nc];
        if (!neighbor.isRevealed && !neighbor.isFlagged) {
          revealedAny = true;
          const result = revealCell(currentBoard, nr, nc, rows, cols);
          currentBoard = result.newBoard;
          if (result.hitMine) {
            hitMine = true;
          }
        }
      }
    }
  }

  return { newBoard: currentBoard, hitMine, revealedAny };
}

/**
 * Revela todas as minas ao perder e destaca bandeiras incorretas
 */
export function revealAllMines(board: CellData[][], rows: number, cols: number): CellData[][] {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = newBoard[r][c];
      if (cell.isMine && !cell.isFlagged) {
        cell.isRevealed = true;
      } else if (!cell.isMine && cell.isFlagged) {
        cell.isWrongFlag = true;
      }
    }
  }
  return newBoard;
}

/**
 * Coloca bandeiras em todas as minas ao vencer
 */
export function flagAllMinesOnWin(board: CellData[][], rows: number, cols: number): CellData[][] {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = newBoard[r][c];
      if (cell.isMine) {
        cell.isFlagged = true;
      }
    }
  }
  return newBoard;
}

/**
 * Checks if the player won the game
 */
export function checkWinCondition(
  board: CellData[][],
  rows: number,
  cols: number,
  minesCount: number
): boolean {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isRevealed && !board[r][c].isMine) {
        revealedCount++;
      }
    }
  }
  return revealedCount === rows * cols - minesCount;
}

/**
 * Counts total placed flags
 */
export function countFlags(board: CellData[][]): number {
  let count = 0;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].isFlagged) {
        count++;
      }
    }
  }
  return count;
}

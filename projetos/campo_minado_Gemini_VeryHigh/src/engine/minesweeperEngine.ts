import { Cell } from '../types/minesweeper';

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

/**
 * Creates an initial empty grid without mines
 */
export function createEmptyGrid(rows: number, cols: number): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        r,
        c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
        isExploded: false,
        isWrongFlag: false,
      });
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Gets valid adjacent neighbor coordinates
 */
export function getNeighbors(r: number, c: number, rows: number, cols: number): [number, number][] {
  const neighbors: [number, number][] = [];
  for (const [dr, dc] of DIRECTIONS) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      neighbors.push([nr, nc]);
    }
  }
  return neighbors;
}

/**
 * Clones a 2D cell grid immutably
 */
export function cloneGrid(grid: Cell[][]): Cell[][] {
  return grid.map(row => row.map(cell => ({ ...cell })));
}

/**
 * Populates mines after the first click.
 * Guarantees that (startRow, startCol) AND its immediate 8 neighbors have 0 mines,
 * so the initial click always produces a 0-value safe cell with flood fill.
 */
export function populateMinesAndNeighbors(
  grid: Cell[][],
  rows: number,
  cols: number,
  minesCount: number,
  startRow: number,
  startCol: number
): Cell[][] {
  const newGrid = cloneGrid(grid);
  const totalCells = rows * cols;

  // Safe set: start cell + immediate neighbors
  const safeCoords = new Set<string>();
  safeCoords.add(`${startRow},${startCol}`);
  for (const [nr, nc] of getNeighbors(startRow, startCol, rows, cols)) {
    safeCoords.add(`${nr},${nc}`);
  }

  // Available candidate positions for mines
  const candidateCoords: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safeCoords.has(`${r},${c}`)) {
        candidateCoords.push([r, c]);
      }
    }
  }

  // Fallback: If board has so many mines that safe zone cannot be fully respected,
  // ensure at least the start cell itself is safe.
  const actualMinesToPlace = Math.min(minesCount, candidateCoords.length);
  
  if (actualMinesToPlace < minesCount && candidateCoords.length < minesCount) {
    // Highly dense custom board edge case: make only start cell safe
    candidateCoords.length = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r !== startRow || c !== startCol) {
          candidateCoords.push([r, c]);
        }
      }
    }
  }

  // Fisher-Yates shuffle on candidates to pick mine locations
  for (let i = candidateCoords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidateCoords[i], candidateCoords[j]] = [candidateCoords[j], candidateCoords[i]];
  }

  const finalMines = Math.min(minesCount, candidateCoords.length);
  for (let i = 0; i < finalMines; i++) {
    const [r, c] = candidateCoords[i];
    newGrid[r][c].isMine = true;
  }

  // Calculate neighborMines for all cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newGrid[r][c].isMine) {
        newGrid[r][c].neighborMines = 0;
        continue;
      }
      let count = 0;
      for (const [nr, nc] of getNeighbors(r, c, rows, cols)) {
        if (newGrid[nr][nc].isMine) {
          count++;
        }
      }
      newGrid[r][c].neighborMines = count;
    }
  }

  return newGrid;
}

/**
 * BFS Flood Fill algorithm to expand open spaces starting from a 0-neighbor cell
 */
export function floodFill(grid: Cell[][], rows: number, cols: number, startR: number, startC: number): void {
  const queue: [number, number][] = [[startR, startC]];
  const visited = new Set<string>();
  visited.add(`${startR},${startC}`);

  grid[startR][startC].isRevealed = true;
  grid[startR][startC].isFlagged = false;

  while (queue.length > 0) {
    const [currR, currC] = queue.shift()!;
    const cell = grid[currR][currC];

    // If current cell is 0, we can safely reveal and queue its neighbors
    if (cell.neighborMines === 0 && !cell.isMine) {
      for (const [nr, nc] of getNeighbors(currR, currC, rows, cols)) {
        const neighbor = grid[nr][nc];
        const key = `${nr},${nc}`;

        if (!neighbor.isRevealed && !neighbor.isFlagged && !visited.has(key)) {
          visited.add(key);
          neighbor.isRevealed = true;

          // If neighbor is also an empty (0) cell, continue the BFS expansion
          if (neighbor.neighborMines === 0 && !neighbor.isMine) {
            queue.push([nr, nc]);
          }
        }
      }
    }
  }
}

/**
 * Checks if the player has won (all non-mine cells are revealed)
 */
export function checkWinCondition(grid: Cell[][], rows: number, cols: number, mines: number): boolean {
  let revealedCount = 0;
  const totalSafeCells = rows * cols - mines;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].isRevealed && !grid[r][c].isMine) {
        revealedCount++;
      }
    }
  }

  return revealedCount === totalSafeCells;
}

/**
 * Handles Game Over state: reveals all mines, highlights exploded mine,
 * and marks false flags (flagged safe cells) with isWrongFlag = true.
 */
export function revealAllMinesOnDefeat(
  grid: Cell[][],
  rows: number,
  cols: number,
  explodedR?: number,
  explodedC?: number
): Cell[][] {
  const newGrid = cloneGrid(grid);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = newGrid[r][c];

      if (r === explodedR && c === explodedC) {
        cell.isRevealed = true;
        cell.isExploded = true;
      } else if (cell.isMine && !cell.isFlagged) {
        cell.isRevealed = true;
      } else if (!cell.isMine && cell.isFlagged) {
        cell.isWrongFlag = true;
      }
    }
  }

  return newGrid;
}

/**
 * Handles Win state: automatically places flags on all mines if not already flagged
 */
export function flagAllMinesOnWin(grid: Cell[][], rows: number, cols: number): Cell[][] {
  const newGrid = cloneGrid(grid);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newGrid[r][c].isMine) {
        newGrid[r][c].isFlagged = true;
      }
    }
  }
  return newGrid;
}

export interface RevealResult {
  newGrid: Cell[][];
  hitMine: boolean;
  won: boolean;
  cellsRevealedCount: number;
}

/**
 * Reveals a single cell, executing flood fill if 0 or game over if mine
 */
export function executeReveal(
  currentGrid: Cell[][],
  rows: number,
  cols: number,
  mines: number,
  r: number,
  c: number
): RevealResult {
  const cell = currentGrid[r][c];

  // If already revealed or flagged, do nothing
  if (cell.isRevealed || cell.isFlagged) {
    return {
      newGrid: currentGrid,
      hitMine: false,
      won: false,
      cellsRevealedCount: 0,
    };
  }

  // Hit a mine!
  if (cell.isMine) {
    const defeatedGrid = revealAllMinesOnDefeat(currentGrid, rows, cols, r, c);
    return {
      newGrid: defeatedGrid,
      hitMine: true,
      won: false,
      cellsRevealedCount: 0,
    };
  }

  // Safe cell
  const newGrid = cloneGrid(currentGrid);
  if (newGrid[r][c].neighborMines === 0) {
    floodFill(newGrid, rows, cols, r, c);
  } else {
    newGrid[r][c].isRevealed = true;
    newGrid[r][c].isFlagged = false;
  }

  const isWon = checkWinCondition(newGrid, rows, cols, mines);
  const finalGrid = isWon ? flagAllMinesOnWin(newGrid, rows, cols) : newGrid;

  return {
    newGrid: finalGrid,
    hitMine: false,
    won: isWon,
    cellsRevealedCount: 1,
  };
}

export interface ChordResult {
  newGrid: Cell[][];
  hitMine: boolean;
  won: boolean;
  executed: boolean;
  explodedCoords?: [number, number];
}

/**
 * Executes the "Chording" mechanic on a revealed numbered cell.
 * If surrounding flags equal neighborMines:
 * - Uncovers all non-flagged adjacent cells.
 * - If any unflagged neighbor has a mine, triggers game over with that mine highlighted.
 * - Otherwise reveals safe cells and runs flood fill on any 0s.
 */
export function executeChord(
  currentGrid: Cell[][],
  rows: number,
  cols: number,
  mines: number,
  r: number,
  c: number
): ChordResult {
  const cell = currentGrid[r][c];

  // Must be already revealed with at least 1 neighbor mine
  if (!cell.isRevealed || cell.neighborMines === 0) {
    return { newGrid: currentGrid, hitMine: false, won: false, executed: false };
  }

  const neighbors = getNeighbors(r, c, rows, cols);
  let flagCount = 0;
  for (const [nr, nc] of neighbors) {
    if (currentGrid[nr][nc].isFlagged) {
      flagCount++;
    }
  }

  // Chording only triggers if exact flag count matches number of neighbor mines
  if (flagCount !== cell.neighborMines) {
    return { newGrid: currentGrid, hitMine: false, won: false, executed: false };
  }

  let newGrid = cloneGrid(currentGrid);
  let hitMine = false;
  let explodedR = -1;
  let explodedC = -1;

  // Check if any unflagged neighbor is a mine (bad chording)
  for (const [nr, nc] of neighbors) {
    const neighbor = newGrid[nr][nc];
    if (!neighbor.isRevealed && !neighbor.isFlagged) {
      if (neighbor.isMine) {
        hitMine = true;
        explodedR = nr;
        explodedC = nc;
        break;
      }
    }
  }

  if (hitMine) {
    const defeatedGrid = revealAllMinesOnDefeat(newGrid, rows, cols, explodedR, explodedC);
    return {
      newGrid: defeatedGrid,
      hitMine: true,
      won: false,
      executed: true,
      explodedCoords: [explodedR, explodedC],
    };
  }

  // All unflagged neighbors are safe - reveal them!
  for (const [nr, nc] of neighbors) {
    const neighbor = newGrid[nr][nc];
    if (!neighbor.isRevealed && !neighbor.isFlagged) {
      if (neighbor.neighborMines === 0) {
        floodFill(newGrid, rows, cols, nr, nc);
      } else {
        neighbor.isRevealed = true;
      }
    }
  }

  const isWon = checkWinCondition(newGrid, rows, cols, mines);
  if (isWon) {
    newGrid = flagAllMinesOnWin(newGrid, rows, cols);
  }

  return {
    newGrid,
    hitMine: false,
    won: isWon,
    executed: true,
  };
}

/**
 * Toggles a flag on an unrevealed cell
 */
export function toggleFlag(grid: Cell[][], r: number, c: number): Cell[][] {
  const cell = grid[r][c];
  if (cell.isRevealed) return grid;

  const newGrid = cloneGrid(grid);
  newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
  return newGrid;
}

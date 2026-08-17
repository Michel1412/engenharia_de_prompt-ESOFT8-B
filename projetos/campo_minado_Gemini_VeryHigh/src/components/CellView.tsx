import React, { useRef } from 'react';
import { Flag, Bomb, X } from 'lucide-react';
import { Cell } from '../types/minesweeper';

interface CellViewProps {
  cell: Cell;
  cellSize?: number; // Size in px
  onClick: (r: number, c: number) => void;
  onContextMenu: (r: number, c: number, e: React.MouseEvent) => void;
  onDoubleClick: (r: number, c: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onLongPress: (r: number, c: number) => void;
}

const NUMBER_COLOR_CLASSES: Record<number, string> = {
  1: 'text-blue-600 dark:text-blue-400',
  2: 'text-emerald-600 dark:text-emerald-400',
  3: 'text-rose-600 dark:text-rose-400',
  4: 'text-indigo-900 dark:text-indigo-300',
  5: 'text-amber-800 dark:text-amber-500',
  6: 'text-cyan-700 dark:text-cyan-400',
  7: 'text-zinc-900 dark:text-zinc-200',
  8: 'text-zinc-500 dark:text-zinc-400',
};

export const CellView: React.FC<CellViewProps> = ({
  cell,
  cellSize = 34,
  onClick,
  onContextMenu,
  onDoubleClick,
  onMouseDown,
  onMouseUp,
  onLongPress,
}) => {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef<boolean>(false);

  const handleTouchStart = () => {
    isLongPressTriggered.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      onLongPress(cell.r, cell.c);
    }, 380); // 380ms long-press threshold
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isLongPressTriggered.current) {
      e.preventDefault();
    }
  };

  const handleTouchCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPressTriggered.current) {
      isLongPressTriggered.current = false;
      return;
    }
    onClick(cell.r, cell.c);
  };

  const { isRevealed, isMine, isFlagged, neighborMines, isExploded, isWrongFlag } = cell;

  // Base dimensions
  const style = {
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    fontSize: `${Math.max(12, Math.floor(cellSize * 0.48))}px`,
  };

  // Determine appearance classes
  let cellClass =
    'relative flex items-center justify-center font-bold font-mono select-none rounded-[3px] transition-colors duration-75 cursor-pointer ';

  if (!isRevealed) {
    if (isWrongFlag) {
      // Wrong flag revealed at game over
      cellClass += 'bg-rose-100 dark:bg-rose-950/40 border border-rose-400 text-rose-600 ';
    } else {
      // Unrevealed standard cell (beveled modern tile)
      cellClass +=
        'bg-zinc-200 hover:bg-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 border-t-2 border-l-2 border-r-2 border-b-2 border-t-white/80 border-l-white/80 border-r-zinc-400 border-b-zinc-400 dark:border-t-zinc-500 dark:border-l-zinc-500 dark:border-r-zinc-900 dark:border-b-zinc-900 shadow-sm active:border-zinc-400 ';
    }
  } else {
    // Revealed cell
    if (isExploded) {
      cellClass +=
        'bg-rose-600 text-white border border-rose-700 animate-pulse shadow-[inset_0_0_8px_rgba(0,0,0,0.4)] ';
    } else if (isMine) {
      cellClass +=
        'bg-zinc-300 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-400 dark:border-zinc-700 ';
    } else {
      cellClass +=
        'bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-300/80 dark:border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] ';
    }
  }

  return (
    <div
      id={`cell-${cell.r}-${cell.c}`}
      style={style}
      className={cellClass}
      onClick={handleClick}
      onContextMenu={(e) => onContextMenu(cell.r, cell.c, e)}
      onDoubleClick={() => onDoubleClick(cell.r, cell.c)}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      role="button"
      tabIndex={0}
      aria-label={`Linha ${cell.r + 1}, Coluna ${cell.c + 1}`}
    >
      {/* Flag placed */}
      {!isRevealed && isFlagged && !isWrongFlag && (
        <Flag
          className="text-rose-600 drop-shadow-sm fill-rose-500"
          style={{ width: `${Math.floor(cellSize * 0.52)}px`, height: `${Math.floor(cellSize * 0.52)}px` }}
        />
      )}

      {/* False Flag at Game Over (crossed out) */}
      {isWrongFlag && (
        <div className="relative flex items-center justify-center">
          <Bomb
            className="text-zinc-400"
            style={{ width: `${Math.floor(cellSize * 0.48)}px`, height: `${Math.floor(cellSize * 0.48)}px` }}
          />
          <X
            className="absolute text-rose-600 stroke-[3.5]"
            style={{ width: `${Math.floor(cellSize * 0.65)}px`, height: `${Math.floor(cellSize * 0.65)}px` }}
          />
        </div>
      )}

      {/* Exploded Mine */}
      {isRevealed && isMine && isExploded && (
        <Bomb
          className="text-white fill-zinc-950 animate-bounce"
          style={{ width: `${Math.floor(cellSize * 0.55)}px`, height: `${Math.floor(cellSize * 0.55)}px` }}
        />
      )}

      {/* Normal Revealed Mine (Game Over) */}
      {isRevealed && isMine && !isExploded && (
        <Bomb
          className="text-zinc-900 dark:text-zinc-100 fill-zinc-800 dark:fill-zinc-200"
          style={{ width: `${Math.floor(cellSize * 0.52)}px`, height: `${Math.floor(cellSize * 0.52)}px` }}
        />
      )}

      {/* Revealed Number */}
      {isRevealed && !isMine && neighborMines > 0 && (
        <span className={`${NUMBER_COLOR_CLASSES[neighborMines]} font-black select-none leading-none`}>
          {neighborMines}
        </span>
      )}
    </div>
  );
};

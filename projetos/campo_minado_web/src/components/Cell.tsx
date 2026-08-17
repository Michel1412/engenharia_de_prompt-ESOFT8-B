import React, { useRef } from 'react';
import { Flag, Bomb, X } from 'lucide-react';
import { CellData, ThemeConfig } from '../types';
import { NUMBER_COLORS } from '../constants/gameConfig';

interface CellProps {
  cell: CellData;
  theme: ThemeConfig;
  disabled: boolean;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
  flagModeActive?: boolean;
}

export const Cell: React.FC<CellProps> = ({
  cell,
  theme,
  disabled,
  onReveal,
  onToggleFlag,
  onChord,
  flagModeActive = false,
}) => {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (flagModeActive && !cell.isRevealed) {
      onToggleFlag(cell.row, cell.col);
      return;
    }

    if (!cell.isRevealed) {
      if (!cell.isFlagged) {
        onReveal(cell.row, cell.col);
      }
    } else if (cell.neighborMines > 0) {
      onChord(cell.row, cell.col);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled || cell.isRevealed) return;
    onToggleFlag(cell.row, cell.col);
  };

  // Touch handling for mobile devices (long press = flag)
  const handleTouchStart = () => {
    if (disabled || cell.isRevealed) return;
    isLongPressTriggered.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      onToggleFlag(cell.row, cell.col);
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate(50);
        } catch {
          // ignore vibration errors
        }
      }
    }, 450);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isLongPressTriggered.current) {
      e.preventDefault();
      isLongPressTriggered.current = false;
    }
  };

  const renderContent = () => {
    if (cell.isWrongFlag) {
      return (
        <div className="relative flex items-center justify-center text-rose-300">
          <Flag className="w-4 h-4 text-rose-300 fill-rose-300/40" />
          <X className="w-5 h-5 absolute text-rose-500 stroke-[3]" />
        </div>
      );
    }

    if (cell.isFlagged) {
      return (
        <span className="flex items-center justify-center animate-scale-in">
          <Flag className="w-4 h-4 text-rose-400 fill-rose-500 drop-shadow-sm" />
        </span>
      );
    }

    if (!cell.isRevealed) {
      return null;
    }

    if (cell.isMine) {
      return (
        <span className={`flex items-center justify-center ${cell.isExploded ? 'animate-bounce' : ''}`}>
          <Bomb className={`w-4 h-4 ${cell.isExploded ? 'text-white fill-rose-200' : 'text-slate-900 fill-slate-800'}`} />
        </span>
      );
    }

    if (cell.neighborMines > 0) {
      const colorClass = NUMBER_COLORS[cell.neighborMines] || 'text-white';
      return (
        <span className={`select-none font-bold text-sm md:text-base leading-none ${colorClass}`}>
          {cell.neighborMines}
        </span>
      );
    }

    return null;
  };

  let cellStyle = '';
  if (!cell.isRevealed) {
    cellStyle = `${theme.cellUnrevealed} ${!disabled ? theme.cellUnrevealedHover : 'cursor-default'}`;
  } else if (cell.isMine) {
    cellStyle = cell.isExploded
      ? 'bg-rose-600 border-rose-500 shadow-inner'
      : theme.cellRevealedMine;
  } else {
    cellStyle = `${theme.cellRevealed} shadow-inner`;
  }

  return (
    <button
      id={`cell-${cell.row}-${cell.col}`}
      type="button"
      tabIndex={-1}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      disabled={disabled && !cell.isRevealed}
      aria-label={`Linha ${cell.row + 1}, Coluna ${cell.col + 1}${
        cell.isRevealed
          ? cell.isMine
            ? ', Mina'
            : `, ${cell.neighborMines} minas adjacentes`
          : cell.isFlagged
          ? ', Bandeira'
          : ', Oculta'
      }`}
      className={`
        w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
        flex items-center justify-center
        rounded-[3px] text-xs sm:text-sm font-semibold
        transition-all duration-75 select-none
        border cursor-pointer active:scale-[0.97]
        ${cellStyle}
      `}
    >
      {renderContent()}
    </button>
  );
};

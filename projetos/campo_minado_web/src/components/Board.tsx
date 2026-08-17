import React from 'react';
import { CellData, GameStatus, ThemeConfig } from '../types';
import { Cell } from './Cell';

interface BoardProps {
  board: CellData[][];
  theme: ThemeConfig;
  status: GameStatus;
  flagModeActive: boolean;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
  onMouseDownBoard: () => void;
  onMouseUpBoard: () => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  theme,
  status,
  flagModeActive,
  onReveal,
  onToggleFlag,
  onChord,
  onMouseDownBoard,
  onMouseUpBoard,
}) => {
  const rows = board.length;
  const cols = board[0]?.length || 0;
  const isGameOver = status === 'won' || status === 'lost';

  return (
    <div
      id="minesweeper-board-wrapper"
      onMouseDown={onMouseDownBoard}
      onMouseUp={onMouseUpBoard}
      onMouseLeave={onMouseUpBoard}
      className={`
        relative p-2 sm:p-3 rounded-lg border shadow-inner max-w-full overflow-auto
        flex items-center justify-start sm:justify-center
        ${theme.boardBg} ${theme.boardBorder}
      `}
      style={{
        scrollbarWidth: 'thin',
      }}
    >
      <div
        id="minesweeper-board-grid"
        className="grid gap-1 sm:gap-1.5 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          width: 'max-content',
        }}
      >
        {board.map((rowArr, r) =>
          rowArr.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              cell={cell}
              theme={theme}
              disabled={isGameOver}
              onReveal={onReveal}
              onToggleFlag={onToggleFlag}
              onChord={onChord}
              flagModeActive={flagModeActive}
            />
          ))
        )}
      </div>
    </div>
  );
};

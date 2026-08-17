import React, { useState, useRef, useEffect } from 'react';
import { Cell } from '../types/minesweeper';
import { CellView } from './CellView';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface BoardProps {
  grid: Cell[][];
  rows: number;
  cols: number;
  gameStatus: string;
  onCellClick: (r: number, c: number) => void;
  onCellContextMenu: (r: number, c: number, e: React.MouseEvent) => void;
  onCellDoubleClick: (r: number, c: number) => void;
  onCellLongPress: (r: number, c: number) => void;
  onMouseDownUnrevealed: () => void;
  onMouseUpUnrevealed: () => void;
}

export const Board: React.FC<BoardProps> = ({
  grid,
  rows,
  cols,
  gameStatus,
  onCellClick,
  onCellContextMenu,
  onCellDoubleClick,
  onCellLongPress,
  onMouseDownUnrevealed,
  onMouseUpUnrevealed,
}) => {
  // Zoom scale state: default adaptive based on column count
  const [zoomLevel, setZoomLevel] = useState<number>(() => (cols > 20 ? 0.9 : 1.0));
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatically adjust zoom if columns change
  useEffect(() => {
    if (cols > 20) {
      setZoomLevel(0.85);
    } else if (cols > 12) {
      setZoomLevel(0.95);
    } else {
      setZoomLevel(1.0);
    }
  }, [cols]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.6));
  const handleResetZoom = () => setZoomLevel(1.0);

  // Base cell size modulated by zoom
  const baseCellSize = 34;
  const currentCellSize = Math.round(baseCellSize * zoomLevel);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Zoom / Board Bar */}
      <div className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1">
          <span className="font-mono font-medium">
            {cols} × {rows}
          </span>
          <span className="opacity-50">•</span>
          <span className="hidden sm:inline">Zoom: {Math.round(zoomLevel * 100)}%</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            aria-label="Diminuir zoom"
            title="Diminuir zoom"
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            aria-label="Restaurar zoom"
            title="Restaurar zoom original"
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomIn}
            aria-label="Aumentar zoom"
            title="Aumentar zoom"
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Container with scroll/pan support */}
      <div
        ref={containerRef}
        id="board-scroll-area"
        className="w-full max-w-full overflow-auto rounded-lg border-2 border-t-zinc-400 border-l-zinc-400 border-r-white border-b-white dark:border-t-zinc-900 dark:border-l-zinc-900 dark:border-r-zinc-600 dark:border-b-zinc-600 bg-zinc-300 dark:bg-zinc-900/90 p-2 sm:p-3 shadow-inner flex justify-center items-start min-h-[300px]"
      >
        <div
          id="minesweeper-grid"
          className="inline-grid gap-[2px] transition-all duration-75 select-none"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            width: `${cols * (currentCellSize + 2)}px`,
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <CellView
                key={`${r}-${c}`}
                cell={cell}
                cellSize={currentCellSize}
                onClick={onCellClick}
                onContextMenu={onCellContextMenu}
                onDoubleClick={onCellDoubleClick}
                onLongPress={onCellLongPress}
                onMouseDown={() => {
                  if (!cell.isRevealed && !cell.isFlagged && gameStatus !== 'lost' && gameStatus !== 'won') {
                    onMouseDownUnrevealed();
                  }
                }}
                onMouseUp={() => {
                  if (gameStatus !== 'lost' && gameStatus !== 'won') {
                    onMouseUpUnrevealed();
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

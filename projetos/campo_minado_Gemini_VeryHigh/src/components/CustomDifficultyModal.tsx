import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';

interface CustomDifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (rows: number, cols: number, mines: number) => void;
  initialRows?: number;
  initialCols?: number;
  initialMines?: number;
}

export const CustomDifficultyModal: React.FC<CustomDifficultyModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialRows = 16,
  initialCols = 16,
  initialMines = 40,
}) => {
  const [rows, setRows] = useState<number>(initialRows);
  const [cols, setCols] = useState<number>(initialCols);
  const [mines, setMines] = useState<number>(initialMines);

  if (!isOpen) return null;

  const totalCells = rows * cols;
  // Maximum mines allowed while leaving safe first-click buffer
  const maxMines = Math.max(1, Math.min(totalCells - 9, Math.floor(totalCells * 0.85)));
  const currentMines = Math.min(mines, maxMines);
  const density = ((currentMines / totalCells) * 100).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(rows, cols, currentMines);
    onClose();
  };

  const handleSetPreset = (r: number, c: number, m: number) => {
    setRows(r);
    setCols(c);
    setMines(m);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="custom-difficulty-modal"
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-zinc-900 dark:text-zinc-100"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold">Grade Personalizada</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Quick presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Predefinições Rápidas</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSetPreset(8, 8, 8)}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                Mini (8×8, 8m)
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(20, 20, 70)}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                Grande (20×20, 70m)
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(16, 32, 110)}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                Ultra Larga (16×32, 110m)
              </button>
            </div>
          </div>

          {/* Rows input */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <label htmlFor="input-rows">Linhas (Altura):</label>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{rows}</span>
            </div>
            <input
              id="input-rows"
              type="range"
              min="8"
              max="24"
              value={rows}
              onChange={e => setRows(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Cols input */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <label htmlFor="input-cols">Colunas (Largura):</label>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{cols}</span>
            </div>
            <input
              id="input-cols"
              type="range"
              min="8"
              max="36"
              value={cols}
              onChange={e => setCols(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Mines input */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <label htmlFor="input-mines">Minas Totais:</label>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {currentMines} <span className="text-xs font-normal text-zinc-500">({density}% densidade)</span>
              </span>
            </div>
            <input
              id="input-mines"
              type="range"
              min="5"
              max={maxMines}
              value={currentMines}
              onChange={e => setMines(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-apply-custom"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Aplicar e Jogar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

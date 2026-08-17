import type { Cell as CellModel } from '../game/types'
import { Cell } from './Cell'

interface BoardProps {
  board: CellModel[][]
  cols: number
  shaking: boolean
  fogActive: boolean
  blindnessActive: boolean
  disabled: boolean
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
}

export function Board({
  board,
  cols,
  shaking,
  fogActive,
  blindnessActive,
  disabled,
  onReveal,
  onFlag,
}: BoardProps) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[min(96vw,920px)] overflow-hidden rounded-md border border-mist/20 bg-ink/60 p-2 backdrop-blur-sm ${
        shaking ? 'board-shake' : ''
      }`}
    >
      {blindnessActive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgb(11_22_18/0.55)_55%,rgb(11_22_18/0.82)_100%)]"
        />
      )}
      {fogActive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(120deg,rgb(143_185_166/0.18),transparent_40%,rgb(143_185_166/0.22))]"
        />
      )}
      <div
        className="relative z-0 grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {board.map((row) =>
          row.map((cell) => (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              fogActive={fogActive}
              blindnessActive={blindnessActive}
              disabled={disabled}
              onReveal={onReveal}
              onFlag={onFlag}
            />
          )),
        )}
      </div>
    </div>
  )
}

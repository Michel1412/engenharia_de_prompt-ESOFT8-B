import type { MouseEvent, ReactNode } from 'react'
import type { Cell as CellModel } from '../game/types'

const NUMBER_COLORS = [
  '',
  'text-sky-300',
  'text-emerald-300',
  'text-rose-300',
  'text-violet-300',
  'text-amber-300',
  'text-cyan-200',
  'text-orange-300',
  'text-foam',
]

interface CellProps {
  cell: CellModel
  fogActive: boolean
  blindnessActive: boolean
  disabled: boolean
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
}

export function Cell({
  cell,
  fogActive,
  blindnessActive,
  disabled,
  onReveal,
  onFlag,
}: CellProps) {
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    if (!disabled) onFlag(cell.row, cell.col)
  }

  let content: ReactNode = null
  let className =
    'relative flex aspect-square w-full select-none items-center justify-center rounded-[3px] text-[clamp(0.65rem,1.8vw,0.95rem)] font-bold transition-colors duration-150'

  if (blindnessActive && !cell.isRevealed) {
    className += ' bg-pine/80 cursor-pointer hover:bg-moss/70'
  } else if (!cell.isRevealed) {
    className +=
      ' bg-gradient-to-b from-moss to-pine cursor-pointer hover:from-moss/90 hover:to-pine/90 border border-mist/15'
    if (cell.radarMarked) {
      className += ' ring-2 ring-ember hint-pulse'
      content = <span className="text-ember text-xs tracking-wide">MINA</span>
    } else if (cell.safeHint) {
      className += ' ring-2 ring-signal hint-pulse'
      content = <span className="text-signal text-xs">SAFE</span>
    } else if (cell.isFlagged) {
      content = <span className="text-signal">⚑</span>
    }
  } else if (cell.isMine) {
    className += ' bg-ember/90 text-ink'
    content = blindnessActive ? null : <span>✸</span>
  } else {
    className += ' bg-foam/10 border border-foam/10'
    if (!fogActive && !blindnessActive && cell.adjacentMines > 0) {
      content = (
        <span className={NUMBER_COLORS[cell.adjacentMines]}>{cell.adjacentMines}</span>
      )
    }
  }

  return (
    <button
      type="button"
      aria-label={`Célula ${cell.row + 1}, ${cell.col + 1}`}
      disabled={disabled || cell.isRevealed}
      className={className}
      onClick={() => onReveal(cell.row, cell.col)}
      onContextMenu={handleContextMenu}
    >
      {content}
    </button>
  )
}

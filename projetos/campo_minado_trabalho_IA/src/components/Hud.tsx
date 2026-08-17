import { formatTime } from '../game/useGameEngine'
import type { GameState } from '../game/types'

interface HudProps {
  state: GameState
  onRestart: () => void
  onMenu: () => void
}

export function Hud({ state, onRestart, onMenu }: HudProps) {
  const fogActive = state.elapsedMs < state.fogUntilMs
  const blindnessActive = state.elapsedMs < state.blindnessUntilMs
  const shaking = state.elapsedMs < state.shakeUntilMs

  return (
    <header className="mx-auto flex w-full max-w-[min(96vw,920px)] flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-foam sm:text-3xl">
            Mina das Cartas
          </p>
          <p className="text-sm text-mist">
            Clique esquerdo revela · direito marca bandeira
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="border border-mist/25 px-3 py-2 text-sm text-foam transition hover:border-signal/50 hover:text-signal"
          >
            Reiniciar
          </button>
          <button
            type="button"
            onClick={onMenu}
            className="border border-mist/25 px-3 py-2 text-sm text-foam transition hover:border-signal/50 hover:text-signal"
          >
            Menu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Tempo" value={formatTime(state.elapsedMs)} />
        <Stat label="Minas" value={String(state.flagsLeft)} />
        <Stat label="Próxima carta" value={formatTime(state.nextCardInMs)} accent />
        <Stat
          label="Efeitos"
          value={
            [fogActive && 'Névoa', blindnessActive && 'Cegueira', shaking && 'Tremor']
              .filter(Boolean)
              .join(' · ') || 'Nenhum'
          }
        />
      </div>
    </header>
  )
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="border border-mist/15 bg-pine/40 px-3 py-2">
      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mist">{label}</p>
      <p
        className={`mt-1 font-display text-lg font-semibold ${
          accent ? 'text-signal' : 'text-foam'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

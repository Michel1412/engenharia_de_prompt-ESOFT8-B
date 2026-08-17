import { formatTime } from '../game/useGameEngine'

interface GameOverOverlayProps {
  won: boolean
  elapsedMs: number
  onRestart: () => void
  onMenu: () => void
}

export function GameOverOverlay({
  won,
  elapsedMs,
  onRestart,
  onMenu,
}: GameOverOverlayProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/70 p-4">
      <div className="card-rise w-full max-w-sm border border-mist/25 bg-pine px-6 py-8 text-center">
        <h2 className="font-display text-3xl font-bold text-foam">
          {won ? 'Mina limpa' : 'Detonação'}
        </h2>
        <p className="mt-2 text-mist">
          {won
            ? `Todas as células seguras reveladas em ${formatTime(elapsedMs)}.`
            : 'Você pisou em uma mina. As cartas não perdoam.'}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="bg-signal px-4 py-3 font-semibold text-ink hover:bg-signal/90"
          >
            Jogar de novo
          </button>
          <button
            type="button"
            onClick={onMenu}
            className="border border-mist/30 px-4 py-3 text-foam hover:border-signal/40"
          >
            Voltar ao menu
          </button>
        </div>
      </div>
    </div>
  )
}

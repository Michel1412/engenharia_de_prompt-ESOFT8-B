import type { DrawnCardEvent } from '../game/types'

interface CardAlertProps {
  event: DrawnCardEvent
  onDismiss: () => void
}

export function CardAlert({ event, onDismiss }: CardAlertProps) {
  const isHelp = event.card.kind === 'help'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-title"
        className={`card-rise w-full max-w-md border px-6 py-7 ${
          isHelp
            ? 'border-signal/40 bg-gradient-to-br from-pine to-ink'
            : 'border-ember/45 bg-gradient-to-br from-[#3a1d18] to-ink'
        }`}
      >
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-mist">
          {isHelp ? 'Carta de ajuda' : 'Carta de penalidade'} · minuto{' '}
          {Math.floor(event.drawnAtElapsedMs / 60000)}
        </p>
        <h2 id="card-title" className="font-display text-3xl font-bold text-foam">
          {event.card.name}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-foam/80">{event.card.description}</p>
        <p className="mt-4 border-t border-foam/10 pt-4 text-sm text-mist">{event.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className={`mt-6 w-full px-4 py-3 text-sm font-semibold tracking-wide transition ${
            isHelp
              ? 'bg-signal text-ink hover:bg-signal/90'
              : 'bg-ember text-foam hover:bg-ember/90'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

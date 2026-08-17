import { Board } from './components/Board'
import { CardAlert } from './components/CardAlert'
import { DifficultyMenu } from './components/DifficultyMenu'
import { GameOverOverlay } from './components/GameOverOverlay'
import { Hud } from './components/Hud'
import { useGameEngine } from './game/useGameEngine'

export default function App() {
  const { state, dispatch } = useGameEngine()

  if (state.status === 'menu') {
    return (
      <DifficultyMenu
        selected={state.difficulty}
        onSelect={(difficulty) => dispatch({ type: 'SELECT_DIFFICULTY', difficulty })}
        onStart={(difficulty) => dispatch({ type: 'START_GAME', difficulty })}
      />
    )
  }

  const fogActive = state.elapsedMs < state.fogUntilMs
  const blindnessActive = state.elapsedMs < state.blindnessUntilMs
  const shaking = state.elapsedMs < state.shakeUntilMs
  const boardDisabled = state.status !== 'playing'

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(31_77_58/0.45),transparent_55%),linear-gradient(180deg,#0b1612,#10251c_40%,#0b1612)]"
      />

      <main className="relative z-10 mx-auto flex w-full flex-col gap-5 px-3 py-6 sm:px-6 sm:py-8">
        <Hud
          state={state}
          onRestart={() => dispatch({ type: 'RESTART' })}
          onMenu={() => dispatch({ type: 'BACK_TO_MENU' })}
        />

        <Board
          board={state.board}
          cols={state.cols}
          shaking={shaking}
          fogActive={fogActive}
          blindnessActive={blindnessActive}
          disabled={boardDisabled}
          onReveal={(row, col) => dispatch({ type: 'REVEAL', row, col })}
          onFlag={(row, col) => dispatch({ type: 'TOGGLE_FLAG', row, col })}
        />

        {state.cardHistory.length > 0 && (
          <aside className="mx-auto w-full max-w-[min(96vw,920px)] border-t border-mist/15 pt-4">
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-mist">Cartas recentes</p>
            <ul className="flex flex-wrap gap-2">
              {state.cardHistory.map((event) => (
                <li
                  key={`${event.card.id}-${event.drawnAtElapsedMs}`}
                  className={`border px-3 py-1.5 text-sm ${
                    event.card.kind === 'help'
                      ? 'border-signal/35 text-signal'
                      : 'border-ember/40 text-ember'
                  }`}
                >
                  {event.card.name}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>

      {state.lastCard && (
        <CardAlert
          event={state.lastCard}
          onDismiss={() => dispatch({ type: 'DISMISS_CARD' })}
        />
      )}

      {(state.status === 'won' || state.status === 'lost') && !state.lastCard && (
        <GameOverOverlay
          won={state.status === 'won'}
          elapsedMs={state.elapsedMs}
          onRestart={() => dispatch({ type: 'RESTART' })}
          onMenu={() => dispatch({ type: 'BACK_TO_MENU' })}
        />
      )}
    </div>
  )
}

import { DIFFICULTY_CONFIG } from '../game/board'
import type { Difficulty } from '../game/types'

interface DifficultyMenuProps {
  selected: Difficulty
  onSelect: (d: Difficulty) => void
  onStart: (d: Difficulty) => void
}

const ORDER: Difficulty[] = ['easy', 'medium', 'hard']

export function DifficultyMenu({ selected, onSelect, onStart }: DifficultyMenuProps) {
  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-16 pt-24 sm:justify-center sm:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgb(31_77_58/0.55),transparent_50%),radial-gradient(ellipse_at_80%_0%,rgb(228_178_74/0.12),transparent_40%),linear-gradient(165deg,#0b1612_0%,#143328_48%,#0b1612_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(215_239_228/0.35) 1px, transparent 1px), linear-gradient(90deg, rgb(215_239_228/0.35) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-xl">
        <p className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-foam sm:text-7xl">
          Mina das Cartas
        </p>
        <p className="mt-4 max-w-md text-base leading-relaxed text-mist sm:text-lg">
          Campo minado clássico com cartas roguelike a cada minuto — ajuda ou caos, sem aviso.
        </p>

        <div className="mt-10 flex flex-col gap-2">
          {ORDER.map((key) => {
            const cfg = DIFFICULTY_CONFIG[key]
            const active = selected === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                className={`flex items-center justify-between border px-4 py-3 text-left transition ${
                  active
                    ? 'border-signal bg-signal/10 text-foam'
                    : 'border-mist/20 bg-ink/30 text-foam/80 hover:border-mist/40'
                }`}
              >
                <span className="font-display text-lg font-semibold">{cfg.label}</span>
                <span className="text-sm text-mist">
                  {cfg.rows}×{cfg.cols} · {cfg.mines} minas
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onStart(selected)}
          className="mt-6 w-full bg-signal px-5 py-3.5 font-display text-lg font-bold text-ink transition hover:bg-signal/90"
        >
          Entrar na mina
        </button>
      </div>
    </section>
  )
}

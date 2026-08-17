import { useEffect, useReducer } from 'react'
import { createInitialState, gameReducer } from './reducer'

export function useGameEngine() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)

  useEffect(() => {
    if (state.status !== 'playing' || state.lastCard) return

    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', nowMs: Date.now() })
    }, 100)

    return () => window.clearInterval(id)
  }, [state.status, state.lastCard])

  return { state, dispatch }
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

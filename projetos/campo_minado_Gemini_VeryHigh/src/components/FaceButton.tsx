import React from 'react';
import { Smile, Frown, Meh, Sparkles, Skull } from 'lucide-react';

interface FaceButtonProps {
  emotion: 'idle' | 'scared' | 'won' | 'lost';
  onClick: () => void;
  id?: string;
}

export const FaceButton: React.FC<FaceButtonProps> = ({ emotion, onClick, id }) => {
  return (
    <button
      id={id || 'btn-reset-face'}
      onClick={onClick}
      aria-label="Reiniciar jogo"
      title="Reiniciar jogo"
      className={`
        w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-150
        border-2 shadow-sm active:translate-y-0.5 select-none
        ${
          emotion === 'won'
            ? 'bg-amber-400 border-amber-300 text-zinc-950 shadow-amber-500/20'
            : emotion === 'lost'
            ? 'bg-rose-500 border-rose-400 text-white shadow-rose-500/20'
            : emotion === 'scared'
            ? 'bg-amber-300 border-amber-200 text-zinc-900 animate-pulse'
            : 'bg-amber-400 hover:bg-amber-300 border-amber-200 text-zinc-900'
        }
      `}
    >
      {emotion === 'won' && (
        <span className="text-2xl" role="img" aria-label="Vitória">
          😎
        </span>
      )}
      {emotion === 'lost' && (
        <span className="text-2xl" role="img" aria-label="Derrota">
          😵
        </span>
      )}
      {emotion === 'scared' && (
        <span className="text-2xl" role="img" aria-label="Cuidado">
          😮
        </span>
      )}
      {emotion === 'idle' && (
        <span className="text-2xl" role="img" aria-label="Pronto">
          🙂
        </span>
      )}
    </button>
  );
};

import React from 'react';
import { HelpCircle, X, MousePointer, Flag, Zap, ShieldCheck } from 'lucide-react';
import { ThemeConfig } from '../types';

interface InstructionsModalProps {
  isOpen: boolean;
  theme: ThemeConfig;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  theme,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="help-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="help-modal-content"
        className={`
          w-full max-w-md rounded-xl p-5 border shadow-2xl relative
          ${theme.cardBg} ${theme.textPrimary}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className={`w-5 h-5 ${theme.accent}`} />
            <h3 className="font-bold text-base sm:text-lg">Como Jogar Campo Minado</h3>
          </div>
          <button
            id="close-help-modal-btn"
            type="button"
            onClick={onClose}
            aria-label="Fechar ajuda"
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-200">
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-black/20 border border-white/5">
            <MousePointer className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Clique Esquerdo (ou Toque)</span>
              <p className="text-white/80">Revela o conteúdo da célula. O primeiro clique da partida é sempre seguro.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-black/20 border border-white/5">
            <Flag className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Clique Direito (ou Toque Longo)</span>
              <p className="text-white/80">
                Coloca ou remove uma bandeira para marcar onde você suspeita que há uma mina. No celular, você também pode alternar para o botão "Bandeira".
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-black/20 border border-white/5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Acorde Rápido (Chording)</span>
              <p className="text-white/80">
                Ao clicar em um número já revelado com a quantidade correta de bandeiras vizinhas, todas as outras células adjacentes são reveladas automaticamente.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-black/20 border border-white/5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Condição de Vitória</span>
              <p className="text-white/80">
                Você vence ao revelar todas as células que não possuem minas!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            id="help-modal-understood-btn"
            type="button"
            onClick={onClose}
            className={`
              px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer
              transition-all duration-150 active:scale-95
              ${theme.cellUnrevealed} ${theme.cellUnrevealedHover}
            `}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, HelpCircle, ShieldCheck, Zap, MousePointer, Smartphone, Flag, Bomb } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="how-to-play-modal"
        className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-zinc-900 dark:text-zinc-100 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold">Como Jogar & Mecânicas</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 overflow-y-auto text-sm">
          {/* Regra Básica */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/50 space-y-1.5">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Bomb className="w-4 h-4 text-rose-500" />
              Objetivo
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed">
              Descubra todos os quadrados que não contêm minas. O número em cada célula indica quantas minas existem nas 8
              posições adjacentes (ao redor dela).
            </p>
          </div>

          {/* Proteção do 1º Clique */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40 space-y-1.5">
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Proteção do 1º Clique
            </h3>
            <p className="text-emerald-900/80 dark:text-emerald-200/80 text-xs leading-relaxed">
              As minas só são sorteadas <strong>após o seu primeiro clique</strong>. A primeira célula clicada é
              garantida com o valor <strong>0</strong> (nenhuma mina nela nem nas 8 vizinhas), abrindo imediatamente uma
              área ampla com o algoritmo de Flood Fill!
            </p>
          </div>

          {/* Chording */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/40 space-y-1.5">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              Mecânica Avançada: Chording
            </h3>
            <p className="text-blue-900/80 dark:text-blue-200/80 text-xs leading-relaxed">
              Clique (ou clique duplo) em uma <strong>célula numerada já aberta</strong> que tenha ao seu redor o número
              exato de bandeiras correspondente. O jogo abrirá instantaneamente todos os vizinhos não marcados.
              <br />
              <span className="text-rose-600 dark:text-rose-400 font-semibold">Atenção:</span> Se você tiver posicionado
              uma bandeira no lugar errado, a mina explodirá e o jogo terminará!
            </p>
          </div>

          {/* Controles Desktop e Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700/50 space-y-1">
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5 text-zinc-500" />
                Desktop
              </span>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5 list-disc list-inside">
                <li>Clique Esquerdo: Revelar</li>
                <li>Clique Direito: Colocar Bandeira</li>
                <li>Clique em Número: Chording</li>
              </ul>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700/50 space-y-1">
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                Mobile / Touch
              </span>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5 list-disc list-inside">
                <li>Botão Alternador (Abrir / Bandeira)</li>
                <li>Toque Longo (segurar): Bandeira rápida</li>
                <li>Zoom (+ / -) para navegar na grade</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            Entendi, vamos jogar!
          </button>
        </div>
      </div>
    </div>
  );
};

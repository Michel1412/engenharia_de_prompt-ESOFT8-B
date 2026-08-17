import React from 'react';
import { ThemeConfig, ThemeId } from '../types';
import { THEMES } from '../constants/gameConfig';
import { Palette, Check, Trees, Moon, Snowflake, Sun } from 'lucide-react';

interface ThemeSelectorProps {
  currentThemeId: ThemeId;
  theme: ThemeConfig;
  onSelectTheme: (themeId: ThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeId,
  theme,
  onSelectTheme,
}) => {
  const getThemeIcon = (id: ThemeId, isSelected: boolean) => {
    const iconClass = `w-4 h-4 shrink-0 transition-transform ${isSelected ? 'scale-110' : 'opacity-80'}`;
    switch (id) {
      case 'classic-green':
        return <Trees className={`${iconClass} ${isSelected ? 'text-emerald-300' : 'text-emerald-400'}`} />;
      case 'night':
        return <Moon className={`${iconClass} ${isSelected ? 'text-purple-300' : 'text-purple-400'}`} />;
      case 'snow':
        return <Snowflake className={`${iconClass} ${isSelected ? 'text-cyan-200' : 'text-cyan-300'}`} />;
      case 'desert':
        return <Sun className={`${iconClass} ${isSelected ? 'text-amber-300' : 'text-amber-400'}`} />;
      default:
        return <Palette className={iconClass} />;
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${theme.textSecondary}`}>
          <Palette className="w-3.5 h-3.5" />
          <span>Cenário Visual</span>
        </label>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md bg-black/30 border border-white/10 ${theme.textSecondary}`}>
          {THEMES[currentThemeId].name} • {THEMES[currentThemeId].themeTag}
        </span>
      </div>

      <div
        id="theme-selector-group"
        role="radiogroup"
        aria-label="Seleção de cenário visual"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-xl bg-black/35 border border-white/10"
      >
        {(Object.keys(THEMES) as ThemeId[]).map((id) => {
          const t = THEMES[id];
          const isSelected = currentThemeId === id;

          return (
            <button
              key={id}
              id={`theme-btn-${id}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Selecionar cenário ${t.name} (${t.themeTag})`}
              onClick={() => onSelectTheme(id)}
              className={`
                relative flex flex-col p-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer
                border select-none outline-none
                ${
                  isSelected
                    ? `${t.selectorBgActive} ${t.accentRing} font-bold scale-[1.02]`
                    : 'bg-black/25 hover:bg-white/5 border-white/10 text-white/80 hover:text-white hover:border-white/20'
                }
              `}
            >
              {/* Header: Icon + Name + Active Check */}
              <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                <div className="flex items-center gap-1.5">
                  {getThemeIcon(id, isSelected)}
                  <span className="text-xs sm:text-sm font-semibold truncate leading-none">
                    {t.name}
                  </span>
                </div>
                {isSelected && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 border border-white/40">
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Sublabel / Tag */}
              <span className={`text-[10px] sm:text-[11px] font-normal leading-tight mb-2 truncate ${isSelected ? 'text-white/90' : 'text-white/60'}`}>
                {t.themeTag}
              </span>

              {/* Palette preview swatch bar */}
              <div className="flex items-center gap-1 w-full pt-1.5 border-t border-white/10">
                {t.swatchColors.map((colorClass, idx) => (
                  <span
                    key={idx}
                    className={`h-2 flex-1 rounded-sm ${colorClass} ${isSelected ? 'ring-1 ring-white/30' : 'opacity-80'}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

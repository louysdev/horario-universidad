import { Calendar, RotateCcw, GraduationCap } from 'lucide-react';
import { ThemeSwitcher, ActionsMenu } from '../ui';

/**
 * Header de la aplicación - Estilo UNAPEC
 * Componente presentacional puro
 */
export const Header = ({ 
  theme, 
  setTheme, 
  onExport, 
  onImport, 
  onPrint, 
  onClear, 
  canExport 
}) => {
  return (
    <header className="bg-gradient-to-r from-[#1e4a7d] to-[#2d5a8f] dark:from-slate-800 dark:to-slate-900 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 z-[60] shadow-lg print-hidden relative">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2">
        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-xl font-bold text-white flex items-center gap-2 leading-tight">
              <span className="hidden sm:inline">Mi Horario Universitario</span>
              <span className="sm:hidden">Mi Horario</span>
            </h1>
            <span className="text-[10px] sm:text-xs text-blue-200 dark:text-slate-400 font-medium hidden sm:block">
              Organiza tu semestre fácilmente
            </span>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ActionsMenu 
            onExport={onExport}
            onImport={onImport}
            onPrint={onPrint}
            canExport={canExport}
          />
          
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          
          <button 
            onClick={onClear}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 hover:border-white/30"
            title="Reiniciar horario"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

import { DAYS, START_HOUR, HOURS_COUNT, PIXELS_PER_HOUR } from '../../constants/schedule';
import { formatHour } from '../../utils';
import { SubjectBlock } from './SubjectBlock';

// Altura para impresión (cabe en una página landscape)
const PRINT_PIXELS_PER_HOUR = 38;

/**
 * Grid visual del calendario semanal
 * Componente presentacional puro que recibe datos
 */
export const ScheduleGrid = ({ subjects, onDeleteSubject }) => {
  return (
    <div className="lg:col-span-9 print:!col-span-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full print:shadow-none print:border print:border-slate-300 print:rounded-lg">
      <div className="overflow-auto flex-1 custom-scrollbar print:overflow-visible">
        <div className="min-w-[700px] pb-8 print:min-w-0 print:pb-0">
          
          {/* Header con días - Estilo UNAPEC */}
          <div className="sticky top-0 z-20 bg-gradient-to-r from-[#1e4a7d] to-[#2d5a8f] dark:from-slate-700 dark:to-slate-800 shadow-md print:relative">
            <div className="grid grid-cols-8">
              <div className="p-2 sm:p-3 print:p-1 text-center text-blue-200 dark:text-slate-400 font-bold text-[10px] sm:text-xs print:text-[9px] flex items-end justify-center pb-2 print:pb-1">
                HORA
              </div>
              {DAYS.map(day => (
                <div 
                  key={day.id} 
                  className="p-2 sm:p-3 print:p-1 text-center font-bold text-white dark:text-slate-200 uppercase text-[10px] sm:text-sm print:text-[9px] border-l border-white/10 dark:border-slate-600"
                >
                  <span className="hidden sm:inline print:inline">{day.label}</span>
                  <span className="sm:hidden print:hidden">{day.short}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de horas - CSS variable para print */}
          <div 
            className="relative print-grid-hours" 
            style={{ 
              height: `${HOURS_COUNT * PIXELS_PER_HOUR}px`,
              '--print-height': `${HOURS_COUNT * PRINT_PIXELS_PER_HOUR}px`
            }}
          >
            {Array.from({ length: HOURS_COUNT }).map((_, i) => {
              const hour = START_HOUR + i;
              return (
                <div 
                  key={i} 
                  className="absolute w-full border-t border-slate-100 dark:border-slate-700/50 print:border-slate-200 flex items-start text-xs text-slate-400 dark:text-slate-500 print-hour-row"
                  style={{ 
                    top: `${i * PIXELS_PER_HOUR}px`, 
                    height: `${PIXELS_PER_HOUR}px`,
                    '--print-top': `${i * PRINT_PIXELS_PER_HOUR}px`,
                    '--print-height': `${PRINT_PIXELS_PER_HOUR}px`
                  }}
                >
                  <div className="w-[12.5%] text-right pr-2 sm:pr-4 print:pr-1 -mt-2.5 print:-mt-1.5 font-mono text-[9px] sm:text-[11px] print:text-[8px] font-medium text-slate-400 dark:text-slate-500 select-none">
                    {formatHour(hour)}
                  </div>
                  {DAYS.map((_, dIndex) => (
                    <div 
                      key={dIndex} 
                      className="flex-1 h-full border-l border-slate-50 dark:border-slate-700/30 print:border-slate-100 even:bg-slate-50/40 dark:even:bg-slate-900/20"
                    />
                  ))}
                </div>
              );
            })}

            {/* Bloques de materias */}
            <div className="absolute top-0 right-0 w-[87.5%] h-full grid grid-cols-7 pointer-events-none">
              {DAYS.map(day => (
                <div key={day.id} className="relative h-full pointer-events-auto">
                  {subjects
                    .filter(sub => sub.day === day.id)
                    .map(sub => (
                      <SubjectBlock 
                        key={sub.id} 
                        subject={sub} 
                        onDelete={onDeleteSubject}
                        printPixelsPerHour={PRINT_PIXELS_PER_HOUR}
                      />
                    ))
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

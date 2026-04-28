import { Trash2, Clock, User, Wifi, MapPin } from 'lucide-react';
import { getMinutes } from '../../utils';
import { hexToRgba } from '../../utils/color';
import { START_HOUR, PIXELS_PER_HOUR, COLORS } from '../../constants/schedule';

/**
 * Bloque visual de una materia en el calendario
 * Componente presentacional puro
 */
export const SubjectBlock = ({ subject, onDelete, printPixelsPerHour = 38 }) => {
  const startMinutes = getMinutes(subject.startTime);
  const endMinutes = getMinutes(subject.endTime);
  const durationMinutes = endMinutes - startMinutes;
  
  const startOfDayMinutes = START_HOUR * 60;
  const topOffset = ((startMinutes - startOfDayMinutes) / 60) * PIXELS_PER_HOUR;
  const height = (durationMinutes / 60) * PIXELS_PER_HOUR;
  
  // Valores para impresión
  const printTopOffset = ((startMinutes - startOfDayMinutes) / 60) * printPixelsPerHour;
  const printHeight = (durationMinutes / 60) * printPixelsPerHour;

  let style = {
    top: `${topOffset}px`,
    height: `${height}px`,
    '--print-top': `${printTopOffset}px`,
    '--print-height': `${printHeight}px`,
  };
  
  let className = `absolute w-[95%] left-[2.5%] rounded-md border p-1 sm:p-2 print:p-0.5 text-xs print:text-[7px] overflow-hidden transition-all shadow-sm group z-10 cursor-pointer hover:brightness-95 print-subject-block`;

  if (subject.color?.isCustom) {
    const isDark = document.documentElement.classList.contains('dark');
    style = {
      ...style,
      backgroundColor: hexToRgba(subject.color.hex, isDark ? 0.25 : 0.15),
      borderColor: subject.color.hex,
      color: isDark ? hexToRgba(subject.color.hex, 1) : subject.color.hex
    };
  } else {
    const colorObj = subject.color || COLORS[0];
    className += ` ${colorObj.bg} ${colorObj.border} ${colorObj.text}`;
  }

  return (
    <div
      className={className}
      style={style}
      title={`${subject.name} con ${subject.professor || 'Sin profesor'} (${subject.startTime} - ${subject.endTime})`}
    >
      <div className="flex justify-between items-start h-full">
        <div className="flex flex-col h-full overflow-hidden w-full">
          <div className="flex items-center gap-1 print:gap-0.5">
            <span className="font-bold truncate print:text-[6px]">{subject.name}</span>
            {subject.modality === 'virtual' ? (
              <Wifi size={10} className="flex-shrink-0 opacity-75 print:hidden" title="Virtual" />
            ) : (
              <MapPin size={10} className="flex-shrink-0 opacity-75 print:hidden" title="Presencial" />
            )}
          </div>
          <span className="text-[10px] sm:text-xs print:text-[6px] opacity-90 truncate flex items-center gap-1 print:gap-0.5">
            <Clock size={10} className="print:hidden" /> {subject.startTime} - {subject.endTime}
          </span>
          {subject.professor && (
            <span className="text-[10px] sm:text-xs print:hidden opacity-90 truncate flex items-center gap-1">
              <User size={10} /> {subject.professor}
            </span>
          )}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(subject.groupId); }}
          className="opacity-0 group-hover:opacity-100 bg-white/50 dark:bg-slate-800/50 rounded-full p-0.5 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-opacity absolute top-1 right-1 print:hidden"
          title="Eliminar curso completo"
        >
          <Trash2 size={12} className="text-red-600 dark:text-red-400" />
        </button>
      </div>
    </div>
  );
};

import { Trash2, List } from 'lucide-react';
import { getMinutes } from '../../utils';

/**
 * Lista de materias agregadas
 * Componente presentacional puro
 */
export const SubjectsList = ({ subjects, onDelete }) => {
  const sortedSubjects = [...subjects].sort(
    (a, b) => getMinutes(a.startTime) - getMinutes(b.startTime)
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-slate-100 dark:border-slate-700 flex-1">
      <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 text-sm flex items-center justify-between">
        <span className="flex items-center gap-2">
          <List size={16} className="text-[#1e4a7d] dark:text-blue-400" />
          Lista de Materias
        </span>
        {subjects.length > 0 && (
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
            {subjects.length} {subjects.length === 1 ? 'materia' : 'materias'}
          </span>
        )}
      </h3>
      <div className="space-y-2">
        {subjects.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-4">
            Sin materias aún.
          </p>
        ) : (
          sortedSubjects.map(sub => (
            <div 
              key={sub.id} 
              className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-700 group"
            >
              <div className="overflow-hidden">
                <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                  {sub.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex gap-1">
                  <span className="font-semibold">{sub.day.slice(0, 3)}</span> 
                  {sub.startTime}-{sub.endTime}
                  {sub.professor && (
                    <span className="text-slate-400 dark:text-slate-500">
                      {' '}• {sub.professor}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => onDelete(sub.groupId)} 
                className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0 ml-2" 
                title="Borrar curso"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

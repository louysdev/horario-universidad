import { useState, useRef } from 'react';
import { Menu, ChevronDown, FileJson, Upload, Download } from 'lucide-react';

/**
 * Menú desplegable de acciones (exportar, importar, imprimir)
 */
export const ActionsMenu = ({ onExport, onImport, onPrint, canExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white flex items-center gap-1 text-sm font-medium border border-white/20 hover:border-white/30"
      >
        <Menu size={16} />
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
          <div 
            className="fixed w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-[100]"
            style={{ top: menuPosition.top, right: menuPosition.right }}
          >
            <button
              onClick={() => { onExport(); setIsOpen(false); }}
              disabled={!canExport}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileJson size={16} />
              Exportar JSON
            </button>
            
            <label className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer">
              <Upload size={16} />
              Importar JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => { onImport(e); setIsOpen(false); }}
                className="hidden"
              />
            </label>
            
            <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
            
            <button
              onClick={() => { onPrint(); setIsOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
            >
              <Download size={16} />
              Descargar PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

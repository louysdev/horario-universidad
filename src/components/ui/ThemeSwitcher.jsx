import { useState, useRef } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

const THEME_OPTIONS = [
  { value: 'light', icon: Sun, label: 'Claro' },
  { value: 'dark', icon: Moon, label: 'Oscuro' },
  { value: 'system', icon: Monitor, label: 'Sistema' },
];

/**
 * Componente para cambiar entre temas (light/dark/system)
 * Componente presentacional puro - recibe datos y callbacks
 */
export const ThemeSwitcher = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const currentOption = THEME_OPTIONS.find(o => o.value === theme) || THEME_OPTIONS[2];
  const CurrentIcon = currentOption.icon;

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
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20 hover:border-white/30"
        title="Cambiar tema"
      >
        <CurrentIcon size={18} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
          <div 
            className="fixed w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-[100]"
            style={{ top: menuPosition.top, right: menuPosition.right }}
          >
            {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => { setTheme(value); setIsOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                  theme === value 
                    ? 'text-[#1e4a7d] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

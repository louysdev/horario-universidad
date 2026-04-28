import { useState, useEffect } from 'react';

/**
 * Hook genérico para persistencia en localStorage
 * Esto es REUTILIZABLE en cualquier proyecto
 * 
 * @param {string} key - Clave del localStorage
 * @param {any} initialValue - Valor inicial si no hay nada guardado
 * @returns {[any, Function]} - [valor, setter]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

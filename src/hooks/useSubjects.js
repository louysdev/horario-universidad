import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, COLORS } from '../constants/schedule';
import { getMinutes, hasTimeOverlap } from '../utils';

/**
 * Hook que encapsula TODA la lógica de negocio de las materias
 * Este es el "cerebro" del dominio de horarios
 */
export const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos del localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (savedSubjects) {
      try {
        const parsed = JSON.parse(savedSubjects);
        // Migración de datos antiguos
        const migrated = parsed.map(sub => ({
          ...sub,
          groupId: sub.groupId || sub.id,
          professor: sub.professor || sub.room || '',
        }));
        setSubjects(migrated);
      } catch (e) {
        console.error("Error cargando datos", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar datos (solo después de cargar)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(subjects));
    }
  }, [subjects, isLoaded]);

  /**
   * Valida un horario único contra las materias existentes
   */
  const validateSingleTime = useCallback((day, startStr, endStr, excludeGroupId = null) => {
    const start = getMinutes(startStr);
    const end = getMinutes(endStr);
    
    if (end <= start) {
      return "La hora de fin debe ser posterior a la de inicio.";
    }

    const subjectsToCheck = excludeGroupId 
      ? subjects.filter(s => s.groupId !== excludeGroupId)
      : subjects;

    const conflict = subjectsToCheck.find(sub => 
      sub.day === day && hasTimeOverlap(start, end, getMinutes(sub.startTime), getMinutes(sub.endTime))
    );

    if (conflict) {
      return `Conflicto el ${day} con "${conflict.name}".`;
    }
    
    return null;
  }, [subjects]);

  /**
   * Agrega una nueva materia (puede ser con 1 o 2 horarios)
   */
  const addSubject = useCallback((formData, showSecondDay) => {
    const groupId = Date.now().toString();
    const newSubjectsBlock = [];

    const finalColor = formData.colorIndex === -1 
      ? { isCustom: true, hex: formData.customColor } 
      : COLORS[formData.colorIndex];

    const baseSubject = {
      name: formData.name,
      professor: formData.professor,
      modality: formData.modality,
      color: finalColor,
      groupId: groupId
    };

    newSubjectsBlock.push({
      ...baseSubject,
      id: groupId + '_1',
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
    });

    if (showSecondDay) {
      newSubjectsBlock.push({
        ...baseSubject,
        id: groupId + '_2',
        day: formData.day2,
        startTime: formData.startTime2,
        endTime: formData.endTime2,
      });
    }

    setSubjects(prev => [...prev, ...newSubjectsBlock]);
    return true;
  }, []);

  /**
   * Elimina una materia por su groupId (elimina todos los horarios asociados)
   */
  const deleteSubject = useCallback((groupId) => {
    setSubjects(prev => prev.filter(sub => sub.groupId !== groupId));
  }, []);

  /**
   * Limpia todo el horario
   */
  const clearSchedule = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el horario?')) {
      setSubjects([]);
      return true;
    }
    return false;
  }, []);

  /**
   * Exporta el horario a JSON
   */
  const exportSchedule = useCallback(() => {
    const dataStr = JSON.stringify(subjects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mi-horario-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [subjects]);

  /**
   * Importa un horario desde un archivo JSON
   */
  const importSchedule = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result);
        
        if (!Array.isArray(imported)) {
          alert('Error: El archivo no contiene un horario válido.');
          return;
        }

        const isValid = imported.every(sub => 
          sub.name && sub.day && sub.startTime && sub.endTime && sub.id
        );

        if (!isValid) {
          alert('Error: El archivo contiene datos incompletos o inválidos.');
          return;
        }

        const confirmImport = window.confirm(
          `Se importarán ${imported.length} bloques de horario. ¿Querés reemplazar el horario actual o agregar a lo existente?\n\nAceptar = Reemplazar\nCancelar = Agregar`
        );

        if (confirmImport) {
          setSubjects(imported);
        } else {
          const newSubjects = imported.map(sub => ({
            ...sub,
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            groupId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }));
          setSubjects(prev => [...prev, ...newSubjects]);
        }
      } catch (err) {
        alert('Error al leer el archivo. Asegurate de que sea un JSON válido.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, []);

  return {
    subjects,
    isLoaded,
    validateSingleTime,
    addSubject,
    deleteSubject,
    clearSchedule,
    exportSchedule,
    importSchedule,
  };
};

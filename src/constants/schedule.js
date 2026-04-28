/**
 * Constantes del dominio de horarios universitarios
 * Acá definimos TODO lo que es configuración estática de la aplicación
 */

export const DAYS = [
  { id: 'Lunes', label: 'Lunes', short: 'Lun' },
  { id: 'Martes', label: 'Martes', short: 'Mar' },
  { id: 'Miércoles', label: 'Miércoles', short: 'Mié' },
  { id: 'Jueves', label: 'Jueves', short: 'Jue' },
  { id: 'Viernes', label: 'Viernes', short: 'Vie' },
  { id: 'Sábado', label: 'Sábado', short: 'Sáb' },
  { id: 'Domingo', label: 'Domingo', short: 'Dom' },
];

export const MODALITY = [
  { id: 'presencial', label: 'Presencial' },
  { id: 'virtual', label: 'Virtual' },
];

// Configuración del grid de horarios
export const START_HOUR = 7;
export const END_HOUR = 22;
export const HOURS_COUNT = END_HOUR - START_HOUR + 1;
export const PIXELS_PER_HOUR = 50;

// Paleta de colores predefinida para las materias
export const COLORS = [
  { bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-800 dark:text-blue-200' },
  { bg: 'bg-green-100 dark:bg-green-900/40', border: 'border-green-300 dark:border-green-700', text: 'text-green-800 dark:text-green-200' },
  { bg: 'bg-purple-100 dark:bg-purple-900/40', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-800 dark:text-purple-200' },
  { bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-800 dark:text-orange-200' },
  { bg: 'bg-pink-100 dark:bg-pink-900/40', border: 'border-pink-300 dark:border-pink-700', text: 'text-pink-800 dark:text-pink-200' },
  { bg: 'bg-teal-100 dark:bg-teal-900/40', border: 'border-teal-300 dark:border-teal-700', text: 'text-teal-800 dark:text-teal-200' },
  { bg: 'bg-yellow-100 dark:bg-yellow-900/40', border: 'border-yellow-300 dark:border-yellow-700', text: 'text-yellow-800 dark:text-yellow-200' },
  { bg: 'bg-red-100 dark:bg-red-900/40', border: 'border-red-300 dark:border-red-700', text: 'text-red-800 dark:text-red-200' },
];

// Estado inicial del formulario
export const INITIAL_FORM_STATE = {
  name: '',
  professor: '',
  modality: 'presencial',
  day: 'Lunes',
  startTime: '08:00',
  endTime: '10:00',
  day2: 'Miércoles',
  startTime2: '08:00',
  endTime2: '10:00',
  colorIndex: 0,
  customColor: '#6366f1'
};

// Keys de localStorage
export const STORAGE_KEYS = {
  SCHEDULE: 'uniSchedule',
  THEME: 'theme'
};

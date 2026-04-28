/**
 * Utilidades para manejo de tiempo
 * Funciones puras, sin side effects, fáciles de testear
 */

/**
 * Convierte un string de tiempo (HH:MM) a minutos desde medianoche
 * @param {string} timeStr - Tiempo en formato "HH:MM"
 * @returns {number} - Minutos desde las 00:00
 */
export const getMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Formatea una hora en formato 12h con AM/PM
 * @param {number} hour - Hora en formato 24h
 * @returns {string} - Hora formateada (ej: "2:00 PM")
 */
export const formatHour = (hour) => {
  return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
};

/**
 * Verifica si dos rangos de tiempo se solapan
 * @param {number} start1 - Inicio del primer rango (en minutos)
 * @param {number} end1 - Fin del primer rango (en minutos)
 * @param {number} start2 - Inicio del segundo rango (en minutos)
 * @param {number} end2 - Fin del segundo rango (en minutos)
 * @returns {boolean} - true si hay solapamiento
 */
export const hasTimeOverlap = (start1, end1, start2, end2) => {
  return (start1 >= start2 && start1 < end2) ||
         (end1 > start2 && end1 <= end2) ||
         (start1 <= start2 && end1 >= end2);
};

import { useState } from 'react';
import { Plus, AlertCircle, X, Palette, MapPin, Wifi, BookPlus, Save } from 'lucide-react';
import { DAYS, MODALITY, COLORS, INITIAL_FORM_STATE } from '../../constants/schedule';
import { getMinutes } from '../../utils';

/**
 * Formulario para agregar nuevas materias
 * Componente con estado local para el form
 */
export const SubjectForm = ({ onSubmit, validateSingleTime, onClose }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showSecondDay, setShowSecondDay] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
  };

  const handleColorChange = (index) => {
    setForm({ ...form, colorIndex: index });
  };

  const handleCustomColorChange = (e) => {
    setForm({ ...form, customColor: e.target.value, colorIndex: -1 });
  };

  const validateForm = () => {
    const err1 = validateSingleTime(form.day, form.startTime, form.endTime);
    if (err1) return err1;

    if (showSecondDay) {
      const err2 = validateSingleTime(form.day2, form.startTime2, form.endTime2);
      if (err2) return err2;
      
      if (form.day === form.day2) {
        const s1 = getMinutes(form.startTime);
        const e1 = getMinutes(form.endTime);
        const s2 = getMinutes(form.startTime2);
        const e2 = getMinutes(form.endTime2);
        
        if ((s2 >= s1 && s2 < e1) || (e2 > s1 && e2 <= e1)) {
          return "Los dos horarios de esta materia se solapan entre sí.";
        }
      }
    }
    
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationMsg = validateForm();
    
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    onSubmit(form, showSecondDay);
    
    // Reset form
    setForm({
      ...INITIAL_FORM_STATE,
      colorIndex: form.colorIndex === -1 ? -1 : (form.colorIndex + 1) % COLORS.length,
      customColor: form.customColor
    });
    setShowSecondDay(false);
    setError('');
    
    if (onClose) onClose();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-slate-100 dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
        <BookPlus size={20} className="text-[#1e4a7d] dark:text-blue-400" />
        Nueva Materia
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Datos básicos */}
        <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Nombre
            </label>
            <input
              required
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Ej. Cálculo Integral"
              className="w-full px-3 py-2 mt-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#1e4a7d] dark:focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Profesor
            </label>
            <input
              type="text"
              name="professor"
              value={form.professor}
              onChange={handleInputChange}
              placeholder="Ej. Ing. Martinez"
              className="w-full px-3 py-2 mt-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#1e4a7d] dark:focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Modalidad
            </label>
            <div className="flex gap-2 mt-1">
              {MODALITY.map(mod => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setForm({ ...form, modality: mod.id })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all flex items-center justify-center gap-2 ${
                    form.modality === mod.id
                      ? 'bg-blue-50 dark:bg-blue-900/40 border-[#1e4a7d] dark:border-blue-700 text-[#1e4a7d] dark:text-blue-300'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {mod.id === 'presencial' ? <MapPin size={14} /> : <Wifi size={14} />}
                  {mod.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horario 1 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1e4a7d] dark:text-blue-400 uppercase tracking-wide">
            Horario 1
          </label>
          
          <select
            name="day"
            value={form.day}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#1e4a7d] dark:focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            {DAYS.map(day => (
              <option key={day.id} value={day.id}>{day.label}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#1e4a7d] dark:focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#1e4a7d] dark:focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Horario 2 (opcional) */}
        {!showSecondDay ? (
          <button 
            type="button" 
            onClick={() => setShowSecondDay(true)}
            className="text-xs font-medium text-[#1e4a7d] dark:text-blue-400 hover:text-[#163a63] dark:hover:text-blue-300 flex items-center gap-1 py-1"
          >
            <Plus size={14} />
            Agregar otro día/horario
          </button>
        ) : (
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg relative">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#1e4a7d] dark:text-blue-400 uppercase tracking-wide">
                Horario 2
              </label>
              <button 
                type="button" 
                onClick={() => setShowSecondDay(false)}
                className="text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                title="Quitar este horario"
              >
                <X size={14} />
              </button>
            </div>

            <select
              name="day2"
              value={form.day2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#1e4a7d] dark:focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              {DAYS.map(day => (
                <option key={day.id} value={day.id}>{day.label}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                name="startTime2"
                value={form.startTime2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#1e4a7d] dark:focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
              <input
                type="time"
                name="endTime2"
                value={form.endTime2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#1e4a7d] dark:focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        )}

        {/* Selector de colores */}
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block mt-2">
            Color
          </label>
          <div className="flex gap-2 flex-wrap items-center">
            {COLORS.map((color, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleColorChange(index)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color.bg} ${color.border} ${form.colorIndex === index ? 'ring-2 ring-offset-1 ring-[#1e4a7d] dark:ring-blue-500 dark:ring-offset-slate-800 scale-110' : ''}`}
              />
            ))}
            
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>

            <div className="relative group">
              <div className={`w-8 h-8 rounded-full border-2 cursor-pointer flex items-center justify-center overflow-hidden relative ${form.colorIndex === -1 ? 'ring-2 ring-offset-1 ring-[#1e4a7d] dark:ring-blue-500 dark:ring-offset-slate-800 scale-110' : 'hover:scale-110'} transition-all bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600`}>
                {form.colorIndex === -1 ? (
                  <div className="w-full h-full" style={{ backgroundColor: form.customColor }}></div>
                ) : (
                  <Palette size={14} className="text-slate-500 dark:text-slate-400" />
                )}
                <input
                  type="color"
                  value={form.customColor}
                  onChange={handleCustomColorChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Elegir color personalizado"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#1e4a7d] dark:bg-blue-600 text-white py-2.5 rounded-lg hover:bg-[#163a63] dark:hover:bg-blue-700 font-medium shadow-md hover:shadow-lg active:scale-[0.98] transition-all mt-2 flex items-center justify-center"
          title="Guardar Materia"
        >
          <Save size={20} />
        </button>
      </form>
    </div>
  );
};

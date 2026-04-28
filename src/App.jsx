import { useState } from 'react';
import { Plus, List, Clock, User, MapPin, Wifi } from 'lucide-react';

// Hooks
import { useTheme, useSubjects } from './hooks';

// Components
import { 
  Header, 
  MobileDrawer, 
  SubjectForm, 
  SubjectsList, 
  ScheduleGrid 
} from './components';

/**
 * Componente para imprimir lista de materias (Página 2 del PDF)
 */
const PrintableSubjectsList = ({ subjects }) => {
  // Agrupar por groupId para mostrar cada materia una sola vez
  const uniqueSubjects = subjects.reduce((acc, sub) => {
    if (!acc.find(s => s.groupId === sub.groupId)) {
      // Buscar todas las instancias de esta materia
      const instances = subjects.filter(s => s.groupId === sub.groupId);
      acc.push({ ...sub, instances });
    }
    return acc;
  }, []);

  return (
    <div className="hidden print-page-list bg-white p-8">
      <div className="mb-6 border-b-2 border-[#1e4a7d] pb-4">
        <h1 className="text-2xl font-bold text-[#1e4a7d] flex items-center gap-3">
          <List size={28} />
          Listado de Materias
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Total: {uniqueSubjects.length} {uniqueSubjects.length === 1 ? 'materia' : 'materias'}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {uniqueSubjects.map((sub, idx) => (
          <div 
            key={sub.groupId} 
            className="border border-slate-200 rounded-lg p-4 bg-slate-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-base">
                  {idx + 1}. {sub.name}
                </h3>
                {sub.professor && (
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                    <User size={14} /> {sub.professor}
                  </p>
                )}
                <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                  {sub.modality === 'virtual' ? <Wifi size={14} /> : <MapPin size={14} />}
                  {sub.modality === 'virtual' ? 'Virtual' : 'Presencial'}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-500 mb-2">Horarios:</p>
              {sub.instances.map((inst, i) => (
                <p key={i} className="text-sm text-slate-700 flex items-center gap-2">
                  <Clock size={12} />
                  <span className="font-medium">{inst.day}:</span> 
                  {inst.startTime} - {inst.endTime}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * App - Componente orquestador
 * 
 * Este componente NO contiene lógica de negocio.
 * Solo conecta hooks con componentes (Container pattern)
 */
export default function App() {
  // Theme management
  const { theme, setTheme } = useTheme();
  
  // Subjects management (toda la lógica de negocio está encapsulada acá)
  const {
    subjects,
    validateSingleTime,
    addSubject,
    deleteSubject,
    clearSchedule,
    exportSchedule,
    importSchedule,
  } = useSubjects();

  // UI state (local al componente porque es solo UI)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handlePrint = () => window.print();

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans flex flex-col overflow-hidden">
      
      {/* Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        onExport={exportSchedule}
        onImport={importSchedule}
        onPrint={handlePrint}
        onClear={clearSchedule}
        canExport={subjects.length > 0}
      />

      {/* Contenido Principal - Página 1 del print */}
      <div className="flex-1 overflow-hidden print-page-schedule">
        <div className="max-w-[1600px] mx-auto h-full p-2 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Panel Lateral - Solo visible en desktop, oculto en print */}
          <div className="hidden lg:flex lg:col-span-3 h-full flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4 print-hidden">
            <SubjectForm 
              onSubmit={addSubject}
              validateSingleTime={validateSingleTime}
            />
            <SubjectsList 
              subjects={subjects} 
              onDelete={deleteSubject} 
            />
          </div>

          {/* Área del Horario */}
          <ScheduleGrid 
            subjects={subjects} 
            onDeleteSubject={deleteSubject} 
          />
        
        </div>
      </div>

      {/* Página 2 del print - Lista de materias */}
      <PrintableSubjectsList subjects={subjects} />

      {/* Botón flotante para agregar materia (mobile) */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#1e4a7d] dark:bg-blue-600 text-white rounded-full shadow-lg hover:bg-[#163a63] dark:hover:bg-blue-700 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center z-40 print-hidden"
      >
        <Plus size={24} />
      </button>

      {/* Drawer para mobile */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <SubjectForm 
          onSubmit={addSubject}
          validateSingleTime={validateSingleTime}
          onClose={() => setIsDrawerOpen(false)}
        />
        <div className="mt-4">
          <SubjectsList 
            subjects={subjects} 
            onDelete={deleteSubject} 
          />
        </div>
      </MobileDrawer>
    </div>
  );
}

import { 
  Search, Plus, MoreHorizontal, 
  Pi, Network, Binary, BookOpen, PenTool, Database,
  Calculator, FlaskConical, Globe, Cpu, Loader2, X, Heart, Archive, Trash2
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";

const availableIcons = [
  { id: 'math', icon: <Pi className="w-5 h-5 text-current" /> },
  { id: 'code', icon: <Binary className="w-5 h-5 text-current" /> },
  { id: 'network', icon: <Network className="w-5 h-5 text-current" /> },
  { id: 'database', icon: <Database className="w-5 h-5 text-current" /> },
  { id: 'book', icon: <BookOpen className="w-5 h-5 text-current" /> },
  { id: 'pen', icon: <PenTool className="w-5 h-5 text-current" /> },
  { id: 'calc', icon: <Calculator className="w-5 h-5 text-current" /> },
  { id: 'science', icon: <FlaskConical className="w-5 h-5 text-current" /> },
  { id: 'world', icon: <Globe className="w-5 h-5 text-current" /> },
  { id: 'tech', icon: <Cpu className="w-5 h-5 text-current" /> },
];

const availableColors = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", 
  "bg-purple-500", "bg-rose-400", "bg-teal-500"
];

const initialMaterias = [
  { 
    id: 1,
    name: "Cálculo Integral", 
    professor: "Dr. Roberto Gómez",
    semester: "4to Semestre",
    color: "bg-blue-500",
    iconId: "math",
    notesCount: 12,
    expectedNotes: 20
  },
  { 
    id: 2,
    name: "Programación II", 
    professor: "Ing. Ana Silva",
    semester: "4to Semestre",
    color: "bg-emerald-500",
    iconId: "code",
    notesCount: 24,
    expectedNotes: 30
  },
  { 
    id: 3,
    name: "Física Mecánica", 
    professor: "Dra. Elena Vargas",
    semester: "4to Semestre",
    color: "bg-amber-500",
    iconId: "network",
    notesCount: 8,
    expectedNotes: 15
  },
  { 
    id: 4,
    name: "Estructura de Datos", 
    professor: "Ing. Carlos Mendoza",
    semester: "4to Semestre",
    color: "bg-purple-500",
    iconId: "database",
    notesCount: 15,
    expectedNotes: 18
  },
  { 
    id: 5,
    name: "Humanidades", 
    professor: "Lic. Marta Pérez",
    semester: "4to Semestre",
    color: "bg-rose-400",
    iconId: "book",
    notesCount: 4,
    expectedNotes: 10
  },
  { 
    id: 6,
    name: "Expresión Gráfica", 
    professor: "Arq. Luis Castro",
    semester: "4to Semestre",
    color: "bg-teal-500",
    iconId: "pen",
    notesCount: 6,
    expectedNotes: 12
  }
];

export function SubjectsPage() {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState(initialMaterias);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openNewSubjectModal) {
      setIsModalOpen(true);
      setEditingSubjectId(null);
      // Clean up the state so it doesn't reopen unexpectedly 
      window.history.replaceState({}, '');
    }
  }, [location]);

  // Handle outside clicks for the dropdown menu
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [newSubject, setNewSubject] = useState({
    name: '',
    professor: '',
    semester: '',
    color: availableColors[0],
    iconId: availableIcons[0].id
  });

  const toggleFavorite = (id: number) => {
    setMaterias(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !(m as any).isFavorite } : m));
    setActiveMenuId(null);
  };

  const toggleArchive = (id: number) => {
    setMaterias(prev => prev.map(m => m.id === id ? { ...m, isArchived: !(m as any).isArchived } : m));
    setActiveMenuId(null);
  };

  const deleteSubject = (id: number) => {
    setMaterias(prev => prev.filter(m => m.id !== id));
    setActiveMenuId(null);
  };

  const openEditModal = (materia: any) => {
    setEditingSubjectId(materia.id);
    setNewSubject({
      name: materia.name,
      professor: materia.professor,
      semester: materia.semester,
      color: materia.color,
      iconId: materia.iconId || availableIcons[0].id
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setEditingSubjectId(null);
    setNewSubject({
      name: '',
      professor: '',
      semester: '',
      color: availableColors[0],
      iconId: availableIcons[0].id
    });
  };

  const handleSubmitSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name) return;

    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      if (editingSubjectId) {
        setMaterias(prev => prev.map(m => 
          m.id === editingSubjectId ? { ...m, ...newSubject } : m
        ));
      } else {
        setMaterias(prev => [...prev, {
          id: Date.now(),
          ...newSubject,
          notesCount: 0,
          expectedNotes: 0,
          isFavorite: false,
          isArchived: false
        } as any]);
      }
      setIsSubmitting(false);
      closeAndResetModal();
    }, 1000);
  };
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative z-10">
        
        {/* Subtle Watermark - Lardi */}
        <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[800px] h-[800px] text-[#112613]">
            <path d="M15.236 22a3 3 0 0 0-2.2-1.026c-1.393.003-2.903.003-4.048.003A4 4 0 0 1 5 16.974V15a2 2 0 0 1 2-2h4M18 10a4 4 0 0 0-4-4h-1a4 4 0 0 0-4 4v6M18 10v4.293a1 1 0 0 1-.293.707l-2 2M15 10v2M12 10v2M8.1 4H8C5.239 4 3 6.239 3 9v2.5a2.5 2.5 0 0 0 2.5 2.5h.5"/>
            <path d="M12 4a3 3 0 0 1 6 0 3 3 0 0 1 3 3v2"/>
            <path d="M21 9v2a2 2 0 0 1-2 2h-.5"/>
          </svg>
        </div>

        <div className="px-8 py-10 md:px-12 xl:px-16 md:py-12 relative z-10 max-w-[1400px] mx-auto">
          {/* Header */}
          <header className="flex flex-col gap-6 md:flex-row md:items-center justify-between mb-8">
            <div className="flex-1 max-w-xl">
              <h1 className="text-3xl font-sans font-bold tracking-tight mb-6 text-[#112613]">
                Mis Materias
              </h1>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#112613]/40" />
                <input 
                  type="text" 
                  placeholder="Buscar por materia o profesor..." 
                  className="w-full bg-white border border-acorn-400/20 rounded-lg pl-12 pr-4 py-3.5 text-[#112613] font-body outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 transition-all shadow-sm"
                />
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="self-start md:self-end mt-2 md:mt-0 flex items-center justify-center gap-2 bg-transparent text-[#112613] border border-[#112613]/20 hover:border-[#112613] hover:bg-[#112613]/5 px-6 py-3 rounded-md font-bold transition-all shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir Materia</span>
            </button>
          </header>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-4 py-1.5 rounded-full bg-[#112613] text-[#F9F6F0] font-medium text-sm whitespace-nowrap">
              Semestre Actual
            </button>
            <button className="px-4 py-1.5 rounded-full bg-white border border-acorn-400/20 text-[#112613] hover:bg-acorn-50 font-medium text-sm whitespace-nowrap transition-colors">
              Mis Favoritas
            </button>
            <button className="px-4 py-1.5 rounded-full bg-white border border-acorn-400/20 text-[#112613] hover:bg-acorn-50 font-medium text-sm whitespace-nowrap transition-colors">
              Archivadas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
            {materias.map((materia) => (
              <motion.div 
                key={materia.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate('/materias/' + materia.id)}
                className={`bg-white rounded-xl border border-acorn-400/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-[220px] ${(materia as any).isArchived ? 'opacity-50 grayscale-[0.5]' : ''}`}
              >
                {/* Header Strip */}
                <div className={`${materia.color} h-2 w-full relative`}>
                  {/* Settings Icon and Dropdown */}
                  <div className="absolute top-3 right-3 z-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === materia.id ? null : materia.id);
                      }}
                      className={`p-1.5 bg-white/90 rounded-md text-[#112613] transition-opacity hover:bg-white shadow-sm ${activeMenuId === materia.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {activeMenuId === materia.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-acorn-400/10 py-1 flex flex-col z-20 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#112613] hover:bg-acorn-50 transition-colors w-full text-left font-medium"
                            onClick={(e) => { e.stopPropagation(); openEditModal(materia); }}
                          >
                            <PenTool className="w-4 h-4 text-[#112613]" />
                            Editar materia
                          </button>
                          <button 
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#112613] hover:bg-acorn-50 transition-colors w-full text-left font-medium"
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(materia.id); }}
                          >
                            <Heart className={`w-4 h-4 ${(materia as any).isFavorite ? 'text-rose-500 fill-rose-500' : 'text-rose-500'}`} />
                            {(materia as any).isFavorite ? 'Quitar de favoritas' : 'Agregar a favoritas'}
                          </button>
                          <button 
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#112613] hover:bg-acorn-50 transition-colors w-full text-left font-medium"
                            onClick={(e) => { e.stopPropagation(); toggleArchive(materia.id); }}
                          >
                            <Archive className={`w-4 h-4 ${(materia as any).isArchived ? 'text-acorn-500 fill-acorn-500' : 'text-acorn-500'}`} />
                            {(materia as any).isArchived ? 'Desarchivar materia' : 'Archivar materia'}
                          </button>
                          <button 
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left font-medium"
                            onClick={(e) => { e.stopPropagation(); deleteSubject(materia.id); }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                            Borrar materia
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`p-2.5 rounded-lg text-white ${materia.color} shadow-sm shrink-0`}>
                      {availableIcons.find(icon => icon.id === materia.iconId)?.icon}
                    </div>
                    <div className="min-w-0 pr-4 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h2 className="text-[#112613] font-sans font-bold text-lg leading-tight truncate">
                          {materia.name}
                        </h2>
                        {(materia as any).isFavorite && <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />}
                      </div>
                    </div>
                  </div>

                  {/* Subtitles */}
                  <div className="flex flex-col gap-1 mt-auto mb-5">
                    <p className="text-sm font-medium text-[#112613]/70 truncate">
                      Profesor: {materia.professor}
                    </p>
                    <p className="text-xs font-medium text-[#112613]/50">
                      Semestre: {materia.semester}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-xs font-bold text-moss-700">Progreso de Apuntes</span>
                      <span className="text-xs font-medium text-acorn-500">{materia.notesCount} / {materia.expectedNotes}</span>
                    </div>
                    <div className="w-full h-1.5 bg-acorn-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${materia.color} rounded-full`} 
                        style={{ width: `${(materia.notesCount / materia.expectedNotes) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>

          <div className="h-24"></div>
        </div>

        {/* Modal Nueva Asignatura */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112613]/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
              >
                {/* Dynamic color indicator bar */}
                <div className={`h-2 w-full transition-colors duration-300 ${newSubject.color}`}></div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-sans font-bold text-[#112613]">{editingSubjectId ? "Editar Asignatura" : "Nueva Asignatura"}</h2>
                    <button 
                      onClick={closeAndResetModal}
                      className="text-[#112613]/40 hover:text-[#112613] p-1 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitSubject} className="flex flex-col gap-8">
                    
                    {/* Subject Name Input */}
                    <div className="flex flex-col gap-2 relative group mt-2">
                      <input 
                        type="text" 
                        id="subjectName"
                        required
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                        className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                        placeholder="Ej: Estructuras de Datos"
                      />
                      <label 
                        htmlFor="subjectName" 
                        className={`absolute left-0 transition-all cursor-text
                          peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold 
                          ${newSubject.name ? '-top-4 text-xs font-bold text-[#112613]' : 'top-2 text-[#112613]/50'}
                        `}
                      >
                        Nombre de la Materia
                      </label>
                      <div className={`absolute bottom-0 left-0 w-0 h-[2px] ${newSubject.color} transition-all duration-300 peer-focus:w-full`}></div>
                    </div>

                    {/* Color & Icon Selectors */}
                    <div className="flex flex-col gap-5">
                      <h3 className="text-sm font-bold text-[#112613]/70 font-mono tracking-widest uppercase">Identidad Visual</h3>
                      
                      {/* Color dots */}
                      <div className="flex items-center gap-3">
                        {availableColors.map((colorValue) => (
                          <button
                            key={colorValue}
                            type="button"
                            onClick={() => setNewSubject({...newSubject, color: colorValue})}
                            className={`w-8 h-8 rounded-full ${colorValue} border-2 transition-transform ${newSubject.color === colorValue ? 'border-[#112613] scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                          />
                        ))}
                      </div>

                      {/* Icons Grid */}
                      <div className="grid grid-cols-5 gap-3 mt-1">
                        {availableIcons.map((i) => (
                          <button
                            key={i.id}
                            type="button"
                            onClick={() => setNewSubject({...newSubject, iconId: i.id})}
                            className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                              newSubject.iconId === i.id 
                                ? `bg-white border-[#112613] text-[#112613] shadow-sm` 
                                : `border-transparent bg-acorn-50 text-acorn-500 hover:bg-acorn-100 hover:text-[#112613]`
                            }`}
                          >
                            {i.icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Academic Information Grid */}
                    <div className="flex flex-col gap-5">
                      <h3 className="text-sm font-bold text-[#112613]/70 font-mono tracking-widest uppercase mt-2">Información Académica</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Professor Input */}
                        <div className="flex flex-col gap-2 relative group mt-2">
                          <input 
                            type="text" 
                            id="professorName"
                            value={newSubject.professor}
                            onChange={(e) => setNewSubject({...newSubject, professor: e.target.value})}
                            className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                            placeholder="Ej: Ing. Carlos Mendoza"
                          />
                          <label 
                            htmlFor="professorName" 
                            className={`absolute left-0 transition-all cursor-text
                              peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold 
                              ${newSubject.professor ? '-top-4 text-xs font-bold text-[#112613]' : 'top-2 text-[#112613]/50'}
                            `}
                          >
                            Nombre del Profesor
                          </label>
                          <div className={`absolute bottom-0 left-0 w-0 h-[2px] ${newSubject.color} transition-all duration-300 peer-focus:w-full`}></div>
                        </div>

                        {/* Semester Input */}
                        <div className="flex flex-col gap-2 relative group mt-2">
                          <input 
                            type="number"
                            id="semesterName"
                            required
                            min="1"
                            max="20"
                            value={newSubject.semester}
                            onChange={(e) => setNewSubject({...newSubject, semester: e.target.value})}
                            className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                            placeholder="Ej: 4"
                          />
                          <label 
                            htmlFor="semesterName" 
                            className={`absolute left-0 transition-all cursor-text
                              peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold 
                              ${newSubject.semester ? '-top-4 text-xs font-bold text-[#112613]' : 'top-2 text-[#112613]/50'}
                            `}
                          >
                            Semestre
                          </label>
                          <div className={`absolute bottom-0 left-0 w-0 h-[2px] ${newSubject.color} transition-all duration-300 peer-focus:w-full`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 mt-6">
                      <button 
                        type="button"
                        onClick={closeAndResetModal}
                        className="text-[#112613]/50 hover:text-[#112613] font-medium transition-colors px-4 py-2"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting || !newSubject.name}
                        className="flex items-center justify-center gap-2 bg-[#112613] hover:bg-moss-900 focus:bg-moss-900 text-[#F9F6F0] px-8 py-3 rounded-md font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          editingSubjectId ? "Guardar Cambios" : "Crear Materia"
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

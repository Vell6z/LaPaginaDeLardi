import { 
  Search, Plus, Pi, Network, Binary, BookOpen, PenTool, Database,
  Calculator, FlaskConical, Globe, Cpu
} from "lucide-react";
import { Sidebar } from "../../../shared/layout/Sidebar";
import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import { SubjectCard } from "../components/SubjectCard";
import { SubjectModal } from "../components/SubjectModal";

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
  { id: 1, name: "Cálculo Integral", professor: "Dr. Roberto Gómez", semester: "4to Semestre", color: "bg-blue-500", iconId: "math", notesCount: 12, expectedNotes: 20 },
  { id: 2, name: "Programación II", professor: "Ing. Ana Silva", semester: "4to Semestre", color: "bg-emerald-500", iconId: "code", notesCount: 24, expectedNotes: 30 },
  { id: 3, name: "Física Mecánica", professor: "Dra. Elena Vargas", semester: "4to Semestre", color: "bg-amber-500", iconId: "network", notesCount: 8, expectedNotes: 15 },
  { id: 4, name: "Estructura de Datos", professor: "Ing. Carlos Mendoza", semester: "4to Semestre", color: "bg-purple-500", iconId: "database", notesCount: 15, expectedNotes: 18 },
  { id: 5, name: "Humanidades", professor: "Lic. Marta Pérez", semester: "4to Semestre", color: "bg-rose-400", iconId: "book", notesCount: 4, expectedNotes: 10 },
  { id: 6, name: "Expresión Gráfica", professor: "Arq. Luis Castro", semester: "4to Semestre", color: "bg-teal-500", iconId: "pen", notesCount: 6, expectedNotes: 12 }
];

export function SubjectsPage() {
  const [materias, setMaterias] = useState(initialMaterias);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    if ((location.state as any)?.openNewSubjectModal) {
      setIsModalOpen(true);
      setEditingSubjectId(null);
      window.history.replaceState({}, '');
    }
  }, [location]);

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
      <Sidebar />
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
              <SubjectCard 
                key={materia.id}
                materia={materia}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                openEditModal={openEditModal}
                toggleFavorite={toggleFavorite}
                toggleArchive={toggleArchive}
                deleteSubject={deleteSubject}
                availableIcons={availableIcons}
              />
            ))}
            </AnimatePresence>
          </div>

          <div className="h-24"></div>
        </div>

        {/* Modal Nueva Asignatura */}
        <AnimatePresence>
          {isModalOpen && (
            <SubjectModal 
              editingSubjectId={editingSubjectId}
              closeAndResetModal={closeAndResetModal}
              handleSubmitSubject={handleSubmitSubject}
              newSubject={newSubject}
              setNewSubject={setNewSubject}
              isSubmitting={isSubmitting}
              availableColors={availableColors}
              availableIcons={availableIcons}
            />
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

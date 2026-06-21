import { 
  Search, Plus, Pi, Network, Binary, BookOpen, PenTool, Database,
  Calculator, FlaskConical, Globe, Cpu, Layers, LayoutGrid, AlertTriangle, ChevronRight, Activity, Clock, MoreVertical, Archive, Star, Trash2, Edit2
} from "lucide-react";
import { Sidebar } from "../../../shared/layout/Sidebar";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, Link, useNavigate } from "react-router-dom";
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
  const [materias, setMaterias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'current'|'favorites'|'archived'>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    if ((location.state as any)?.openNewSubjectModal) {
      setIsModalOpen(true);
      setEditingSubjectId(null);
      window.history.replaceState({}, '');
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchMaterias = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/subjects', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        // Mapear _id a id para el frontend y colorId a color
        const mappedData = data.map((m: any) => ({
          ...m,
          id: m._id,
          color: m.colorId,
          notesCount: 0,
          expectedNotes: 0
        }));
        setMaterias(mappedData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterias();
  }, []);

  const [newSubject, setNewSubject] = useState({
    name: '',
    professor: '',
    semester: '',
    color: availableColors[0],
    iconId: availableIcons[0].id
  });

  const toggleFavorite = async (id: string) => {
    const materia = materias.find(m => m.id === id);
    if (!materia) return;
    const newStatus = !materia.isFavorite;
    setMaterias(prev => prev.map(m => m.id === id ? { ...m, isFavorite: newStatus } : m));
    setActiveMenuId(null);
    try {
      await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isFavorite: newStatus })
      });
    } catch (e) { console.error(e); }
  };

  const toggleArchive = async (id: string) => {
    const materia = materias.find(m => m.id === id);
    if (!materia) return;
    const newStatus = !materia.isArchived;
    setMaterias(prev => prev.map(m => m.id === id ? { ...m, isArchived: newStatus } : m));
    setActiveMenuId(null);
    try {
      await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isArchived: newStatus })
      });
    } catch (e) { console.error(e); }
  };

  const deleteSubject = async (id: string) => {
    setActiveMenuId(null);
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const previousMaterias = [...materias];
    setMaterias(prev => prev.filter(m => m.id !== deleteConfirmId));
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/${deleteConfirmId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Error deleting subject');
    } catch (e) {
      console.error(e);
      setMaterias(previousMaterias); // rollback on error
    } finally {
      setDeleteConfirmId(null);
    }
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

  const handleSubmitSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name) return;

    setIsSubmitting(true);
    
    const payload = {
      name: newSubject.name,
      professor: newSubject.professor,
      semester: newSubject.semester,
      colorId: newSubject.color,
      iconId: newSubject.iconId
    };

    try {
      if (editingSubjectId) {
        const res = await fetch(`http://localhost:5000/api/subjects/${editingSubjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setMaterias(prev => prev.map(m => m.id === editingSubjectId ? { ...m, ...payload, color: payload.colorId } : m));
        }
      } else {
        const res = await fetch(`http://localhost:5000/api/subjects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setMaterias(prev => [{
            ...created,
            id: created._id,
            color: created.colorId,
            notesCount: 0,
            expectedNotes: 0
          }, ...prev]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
      closeAndResetModal();
    }
  };

  const filteredMaterias = materias.filter(m => {
    if (filter === 'current') return !m.isArchived;
    if (filter === 'favorites') return m.isFavorite && !m.isArchived;
    if (filter === 'archived') return m.isArchived;
    return true;
  }).filter(m => {
    if (!searchQuery) return true;
    const lowerSearch = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(lowerSearch) || (m.professor && m.professor.toLowerCase().includes(lowerSearch));
  });

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            <button 
              onClick={() => setFilter('current')}
              className={`px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                filter === 'current' ? 'bg-[#112613] text-[#F9F6F0]' : 'bg-white border border-acorn-400/20 text-[#112613] hover:bg-acorn-50'
              }`}
            >
              Semestre Actual
            </button>
            <button 
              onClick={() => setFilter('favorites')}
              className={`px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                filter === 'favorites' ? 'bg-[#112613] text-[#F9F6F0]' : 'bg-white border border-acorn-400/20 text-[#112613] hover:bg-acorn-50'
              }`}
            >
              Mis Favoritas
            </button>
            <button 
              onClick={() => setFilter('archived')}
              className={`px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                filter === 'archived' ? 'bg-[#112613] text-[#F9F6F0]' : 'bg-white border border-acorn-400/20 text-[#112613] hover:bg-acorn-50'
              }`}
            >
              Archivadas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-moss-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <AnimatePresence>
              {filteredMaterias.length > 0 ? (
                filteredMaterias.map((materia) => (
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
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-[#112613]/50 font-medium">No se encontraron materias que coincidan con la búsqueda.</p>
                </div>
              )}
              </AnimatePresence>
            )}
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
          
          {deleteConfirmId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#112613]/40 backdrop-blur-sm"
                onClick={() => setDeleteConfirmId(null)}
              ></motion.div>
              
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative z-10 border border-red-500/20"
              >
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-center text-[#112613] mb-2 font-sans tracking-tight">¿Borrar esta materia?</h3>
                <p className="text-acorn-500 text-sm text-center mb-6">Se borrarán todas las clases, apuntes y flashcards asociados. Esta acción no se puede deshacer.</p>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-[#112613] bg-acorn-50 hover:bg-acorn-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                  >
                    Sí, borrar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

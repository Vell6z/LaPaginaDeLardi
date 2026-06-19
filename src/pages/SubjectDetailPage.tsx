import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { 
  ChevronLeft, Search, Mic, Filter,
  FileText, CheckCircle2, Clock, X,
  MoreVertical, Plus, Star, Trash, Share2, PenTool
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Mock data (would normally be fetched based on id)
const subjectData = {
  id: '3',
  name: "Estructura de Datos",
  color: "bg-purple-500",
  textColor: "text-purple-500",
  lightBg: "bg-purple-50",
  professor: "Ing. Carlos Mendoza",
  stats: {
    totalHours: "24h 30m",
    progress: "85%"
  }
};

const initialSessions = [
  { id: 1, title: "Clase 04: Árboles Binarios", date: "2026-03-10", time: "10:00 AM", status: "IA Procesado", type: "Clase", duration: "1h 20m", isHighlighted: false },
  { id: 2, title: "Clase 05: Árboles AVL", date: "2026-03-12", time: "10:00 AM", status: "Transcrito", type: "Clase", duration: "1h 15m", isHighlighted: false },
  { id: 3, title: "Taller: Implementación de Árboles", date: "2026-03-15", time: "02:00 PM", status: "Pendiente de Repaso", type: "Taller", duration: "2h 00m", isHighlighted: true },
  { id: 4, title: "Clase 06: Grafos y Búsquedas", date: "2026-03-17", time: "10:00 AM", status: "Transcrito", type: "Clase", duration: "1h 30m", isHighlighted: false },
  { id: 5, title: "Parcial 1 - Estructuras No Lineales", date: "2026-03-20", time: "08:00 AM", status: "Pendiente de Repaso", type: "Parcial", duration: "2h 00m", isHighlighted: false },
];

export function SubjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(initialSessions);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Mostrar todo");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Add/Edit Class Modal State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionType, setNewSessionType] = useState("Clase");

  const openEditModal = (session: any) => {
    setEditingSessionId(session.id);
    setNewSessionTitle(session.title);
    setNewSessionType(session.type);
    setIsClassModalOpen(true);
    setActiveMenuId(null);
  };

  const closeAndResetModal = () => {
    setIsClassModalOpen(false);
    setEditingSessionId(null);
    setNewSessionTitle("");
    setNewSessionType("Clase");
  };

  const handleSubmitClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    if (editingSessionId) {
      setSessions(sessions.map(s => 
        s.id === editingSessionId 
          ? { ...s, title: newSessionTitle, type: newSessionType } 
          : s
      ));
    } else {
      const newSession = {
        id: Date.now(),
        title: newSessionTitle,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "Pendiente de Repaso",
        type: newSessionType,
        duration: "0h 00m",
        isHighlighted: false
      };
      setSessions([newSession, ...sessions]);
    }
    
    closeAndResetModal();
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      activeFilter === "Mostrar todo" || 
      (activeFilter === "Solo Parciales" && s.type === "Parcial") ||
      (activeFilter === "Solo Talleres" && s.type === "Taller") ||
      (activeFilter === "Solo Clases" && s.type === "Clase");
    return matchesSearch && matchesFilter;
  });

  const toggleHighlight = (e: React.MouseEvent, sessionId: number) => {
    e.stopPropagation();
    setSessions(sessions.map(s => s.id === sessionId ? { ...s, isHighlighted: !s.isHighlighted } : s));
    setActiveMenuId(null);
  };

  const deleteSession = (e: React.MouseEvent, sessionId: number) => {
    e.stopPropagation();
    setSessions(sessions.filter(s => s.id !== sessionId));
    setActiveMenuId(null);
  };

  const shareSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app this would copy a link or open a share dialog
    alert("Enlace de sesión copiado al portapapeles.");
    setActiveMenuId(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "IA Procesado": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Transcrito": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pendiente de Repaso": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-acorn-100 text-acorn-700 border-acorn-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "IA Procesado": return <CheckCircle2 className="w-3 h-3" />;
      case "Transcrito": return <FileText className="w-3 h-3" />;
      case "Pendiente de Repaso": return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative selection:bg-moss-200">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Dynamic Header */}
        <header className="shrink-0 z-10 bg-white">
          <div className={`h-2 w-full ${subjectData.color}`}></div>
          <div className="px-6 py-6 lg:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-acorn-400/20">
            <div className="flex items-center gap-4">
              <Link to="/materias" className="p-2 -ml-2 text-acorn-400 hover:text-[#112613] hover:bg-black/5 rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-sans font-bold tracking-tight text-[#112613]">
                  {subjectData.name}
                </h1>
                <p className="text-sm font-medium text-acorn-500 mt-1">{subjectData.professor}</p>
              </div>
            </div>

            {/* Subject Specific Search */}
            <div className="relative w-full md:w-80 lg:w-96">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en esta materia..."
                className="w-full bg-[#F9F6F0] border border-acorn-400/20 rounded-xl pl-10 pr-4 py-2.5 text-[#112613] outline-none focus:border-moss-500 transition-all font-medium placeholder-acorn-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-acorn-400 pointer-events-none" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Controls Column */}
          <aside className="w-64 border-r border-acorn-400/20 bg-[#F9F6F0]/50 h-full p-6 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
            
            {/* Create Class Button */}
            <button 
              onClick={() => {
                setEditingSessionId(null);
                setNewSessionTitle("");
                setNewSessionType("Clase");
                setIsClassModalOpen(true);
              }}
              className="w-full bg-[#112613] hover:bg-moss-900 text-[#F9F6F0] p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-3 transition-all shadow-[4px_4px_0px_0px_rgba(74,103,65,0.2)] hover:translate-y-px hover:translate-x-px hover:shadow-[2px_2px_0px_0px_rgba(74,103,65,0.2)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] mb-10 group"
            >
              <div className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center relative`}>
                <Plus className="w-6 h-6" />
                <div className="absolute inset-0 rounded-full border-2 border-white/20 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              <span className="tracking-wide">Agregar clase</span>
            </button>

            {/* Quick Filters */}
            <div className="mb-10">
              <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500 mb-4 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" />
                Filtros
              </h3>
              <div className="flex flex-col gap-2">
                {["Mostrar todo", "Solo Clases", "Solo Talleres", "Solo Parciales"].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      activeFilter === filter 
                        ? 'bg-white border border-acorn-400/20 text-[#112613] shadow-sm' 
                        : 'text-acorn-500 hover:text-[#112613] hover:bg-acorn-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-auto flex flex-col gap-4">
              <div className="bg-white border border-acorn-400/20 p-4 rounded-xl shadow-sm">
                <span className="block text-[10px] font-mono tracking-widest uppercase text-acorn-500 font-bold mb-1">Total Horas</span>
                <span className="text-xl font-sans font-bold text-[#112613]">{subjectData.stats.totalHours}</span>
              </div>
              <div className="bg-white border border-acorn-400/20 p-4 rounded-xl shadow-sm">
                <span className="block text-[10px] font-mono tracking-widest uppercase text-acorn-500 font-bold mb-1">Progreso Apuntes</span>
                <span className="text-xl font-sans font-bold text-[#112613]">{subjectData.stats.progress}</span>
                <div className="w-full h-1 bg-acorn-100 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full ${subjectData.color} rounded-full w-[85%]`}></div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Grid / List */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto relative">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full max-w-5xl mx-auto transition-all">
              {filteredSessions.map((session) => (
                <div 
                  key={session.id}
                  onClick={() => navigate(`/materias/${id}/clase/${session.id}`)}
                  className={`bg-white border rounded-xl p-5 cursor-pointer flex flex-col gap-4 transition-all duration-300 relative border-acorn-400/20 shadow-sm hover:border-moss-400 hover:shadow-md`}
                  onMouseLeave={() => activeMenuId === session.id && setActiveMenuId(null)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-sans font-bold text-[#112613] text-lg leading-tight line-clamp-2">
                       {session.isHighlighted && <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline-block mr-2 -mt-1" />}
                      {session.title}
                    </h3>
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === session.id ? null : session.id); }}
                        className="text-acorn-400 hover:text-[#112613] transition-colors p-1 shrink-0"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      <AnimatePresence>
                        {activeMenuId === session.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale:  1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-acorn-400/20 py-2 z-30"
                          >
                            <button 
                              onClick={(e) => toggleHighlight(e, session.id)}
                              className="w-full px-4 py-2 text-left text-sm font-medium text-[#112613] hover:bg-moss-50 hover:text-moss-700 transition-colors flex items-center gap-2"
                            >
                              <Star className={`w-4 h-4 ${session.isHighlighted ? "fill-amber-400 text-amber-400" : ""}`} />
                              {session.isHighlighted ? "Quitar destacado" : "Destacar clase"}
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); openEditModal(session); }}
                              className="w-full px-4 py-2 text-left text-sm font-medium text-[#112613] hover:bg-moss-50 hover:text-moss-700 transition-colors flex items-center gap-2"
                            >
                              <PenTool className="w-4 h-4" />
                              Editar clase
                            </button>
                            <button 
                              onClick={(e) => shareSession(e)}
                              className="w-full px-4 py-2 text-left text-sm font-medium text-[#112613] hover:bg-moss-50 hover:text-moss-700 transition-colors flex items-center gap-2"
                            >
                              <Share2 className="w-4 h-4" />
                              Compartir clase
                            </button>
                            <div className="h-px w-full bg-acorn-400/10 my-1"></div>
                            <button 
                              onClick={(e) => deleteSession(e, session.id)}
                              className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
                            >
                              <Trash className="w-4 h-4" />
                              Borrar clase
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto">
                    <div className="flex items-center gap-1.5 text-acorn-500 text-xs font-mono font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {session.date} • {session.time}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-mono uppercase tracking-wider font-bold ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      {session.status}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-acorn-50 text-acorn-600 border border-acorn-200 text-[10px] font-mono uppercase tracking-wider font-bold">
                      {session.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredSessions.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-acorn-500">
                <FileText className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-medium">No se encontraron sesiones</p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Add/Edit Class Modal */}
      <AnimatePresence>
        {isClassModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#112613]/40 backdrop-blur-sm"
              onClick={closeAndResetModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#F9F6F0] rounded-2xl shadow-xl border border-acorn-400/20 w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-acorn-400/10 flex justify-between items-center bg-white">
                <h2 className="text-xl font-sans font-bold text-[#112613]">
                  {editingSessionId ? "Editar clase" : "Agregar nueva clase"}
                </h2>
                <button 
                  onClick={closeAndResetModal}
                  className="text-acorn-400 hover:text-[#112613] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitClass} className="p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Título de la clase</label>
                  <input 
                    type="text" 
                    value={newSessionTitle}
                    onChange={(e) => setNewSessionTitle(e.target.value)}
                    placeholder="Ej. Clase 07: Grafos y Búsquedas"
                    className="w-full bg-white border border-acorn-400/20 rounded-xl px-4 py-3 text-[#112613] outline-none focus:border-moss-500 transition-colors placeholder-acorn-400 font-medium"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Tipo de apunte</label>
                  <select 
                    value={newSessionType}
                    onChange={(e) => setNewSessionType(e.target.value)}
                    className="w-full bg-white border border-acorn-400/20 rounded-xl px-4 py-3 text-[#112613] outline-none focus:border-moss-500 transition-colors font-medium appearance-none"
                  >
                    <option value="Clase">Clase</option>
                    <option value="Taller">Taller</option>
                    <option value="Parcial">Parcial</option>
                    <option value="Proyecto">Proyecto</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={!newSessionTitle.trim()}
                  className="mt-4 w-full bg-[#112613] hover:bg-moss-900 disabled:bg-acorn-300 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
                >
                  {editingSessionId ? "Guardar cambios" : "Agregar apunte"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

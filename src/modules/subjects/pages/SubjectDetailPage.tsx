import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../../../shared/layout/Sidebar";
import { ChevronLeft, Search, Filter, FileText, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SessionCard } from "../components/SessionCard";
import { SessionModal } from "../components/SessionModal";
import { AlertTriangle } from "lucide-react";

import { Loader2 } from "lucide-react";

export function SubjectDetailPage() {
  const { id } = useParams();
  const [subjectData, setSubjectData] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Mostrar todo");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes, sessionsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/subjects/${id}`, { credentials: 'include' }),
          fetch(`http://localhost:5000/api/subjects/${id}/sessions`, { credentials: 'include' })
        ]);

        if (subjectRes.ok && sessionsRes.ok) {
          const subject = await subjectRes.json();
          const sessionData = await sessionsRes.json();
          
          setSubjectData({
            id: subject._id,
            name: subject.name,
            color: "bg-[#112613]",
            textColor: "text-[#112613]",
            lightBg: "bg-[#112613]/5",
            professor: subject.professor || 'Profesor no asignado',
            stats: {
              totalHours: "0h 00m",
              progress: "0%"
            }
          });
          const mapped = sessionData.map((s: any) => ({ ...s, id: s._id, date: s.date.split('T')[0] }));
          setSessions(mapped);

          // Filtrar eventos próximos (fecha >= hoy)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const upcoming = mapped
            .filter((s: any) => new Date(s.date) >= today)
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5);
          setUpcomingEvents(upcoming);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);
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

  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    try {
      if (editingSessionId) {
        const res = await fetch(`http://localhost:5000/api/subjects/${id}/sessions/${editingSessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ title: newSessionTitle, type: newSessionType })
        });
        if (res.ok) {
          const updated = await res.json();
          setSessions(sessions.map(s => s.id === editingSessionId ? { ...s, title: updated.title, type: updated.type } : s));
        }
      } else {
        const payload = {
          title: newSessionTitle,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: newSessionType
        };
        const res = await fetch(`http://localhost:5000/api/subjects/${id}/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setSessions([{ ...created, id: created._id, date: created.date.split('T')[0] }, ...sessions]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      closeAndResetModal();
    }
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

  const toggleHighlight = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    setSessions(sessions.map(s => s.id === sessionId ? { ...s, isHighlighted: !s.isHighlighted } : s));
    setActiveMenuId(null);
    
    try {
      await fetch(`http://localhost:5000/api/subjects/${id}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isHighlighted: !session.isHighlighted })
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setDeleteConfirmId(sessionId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/${id}/sessions/${deleteConfirmId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setSessions(sessions.filter(s => s.id !== deleteConfirmId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const shareSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Enlace de sesión copiado al portapapeles.");
    setActiveMenuId(null);
  };

  if (isLoading || !subjectData) {
    return (
      <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative items-center justify-center">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-moss-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative selection:bg-moss-200">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
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

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-64 border-r border-acorn-400/20 bg-[#F9F6F0]/50 h-full p-6 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
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

            {/* Próximos Eventos */}
            <div className="mb-10">
              <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500 mb-4 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Próximos
              </h3>
              {upcomingEvents.length > 0 ? (
                <div className="flex flex-col gap-0 relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-acorn-200"></div>
                  
                  {upcomingEvents.map((ev, i) => {
                    const evDate = new Date(ev.date + 'T00:00:00');
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const diffDays = Math.ceil((evDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    
                    let dateLabel = '';
                    if (diffDays === 0) dateLabel = 'Hoy';
                    else if (diffDays === 1) dateLabel = 'Mañana';
                    else if (diffDays <= 7) dateLabel = `En ${diffDays} días`;
                    else dateLabel = evDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });

                    const typeBadge = ev.type === 'Parcial' 
                      ? 'bg-red-50 text-red-600' 
                      : ev.type === 'Taller' 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-moss-50 text-moss-700';

                    return (
                      <div key={ev.id} className="flex items-start gap-3 py-2 pl-0 group">
                        <div className={`w-[15px] h-[15px] rounded-full border-2 shrink-0 relative z-10 transition-colors ${
                          diffDays === 0 ? 'bg-moss-500 border-moss-500' : 'bg-white border-acorn-300 group-hover:border-moss-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#112613] truncate leading-tight">{ev.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono font-bold text-acorn-500">{dateLabel}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeBadge}`}>{ev.type}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-acorn-400 font-medium italic">Sin eventos próximos</p>
              )}
            </div>

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

          <div className="flex-1 p-6 md:p-10 overflow-y-auto relative">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full max-w-5xl mx-auto transition-all">
              {filteredSessions.map((session) => (
                <SessionCard 
                  key={session.id}
                  session={session}
                  id={id}
                  activeMenuId={activeMenuId}
                  setActiveMenuId={setActiveMenuId}
                  toggleHighlight={toggleHighlight}
                  openEditModal={openEditModal}
                  shareSession={shareSession}
                  deleteSession={deleteSession}
                />
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

      <AnimatePresence>
        <SessionModal 
          isClassModalOpen={isClassModalOpen}
          closeAndResetModal={closeAndResetModal}
          handleSubmitClass={handleSubmitClass}
          editingSessionId={editingSessionId}
          newSessionTitle={newSessionTitle}
          setNewSessionTitle={setNewSessionTitle}
          newSessionType={newSessionType}
          setNewSessionType={setNewSessionType}
        />

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
              <h3 className="text-xl font-bold text-center text-[#112613] mb-2 font-sans tracking-tight">¿Borrar esta sesión?</h3>
              <p className="text-acorn-500 text-sm text-center mb-6">Esta acción es permanente y no podrá deshacerse. Todo el contenido y apuntes se perderán.</p>
              
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
    </div>
  );
}

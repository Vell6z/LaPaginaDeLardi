import React, { useState, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { 
  ChevronLeft, ChevronRight, LayoutGrid, List, 
  Clock, BookOpen, AlertCircle, Squirrel, Plus, X 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

const subjects = [
  { id: 1, name: "Cálculo Integral", badgeColor: "bg-blue-100 text-blue-700 border-blue-200", dotColor: "bg-blue-500" },
  { id: 2, name: "Programación II", badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", dotColor: "bg-emerald-500" },
  { id: 3, name: "Estructura de Datos", badgeColor: "bg-purple-100 text-purple-700 border-purple-200", dotColor: "bg-purple-500" },
];

// Mock calendar for a 35-day grid (e.g. starting on Monday)
const calendarGrid = Array.from({ length: 35 }, (_, i) => {
  const date = i - 1; // Offset to start month on Tuesday for visual variety
  if (date < 1 || date > 30) return { date: null, isCurrentMonth: false };
  return { date, isCurrentMonth: true };
});

const initialEvents: Record<number, Array<{ id: number, subjectId: number, title: string, time: string, professor: string }>> = {
  3: [{ id: 101, subjectId: 1, title: "Clase de Integrales", time: "10:00 AM", professor: "Dr. Roberto Gómez" }],
  8: [
    { id: 102, subjectId: 2, title: "Laboratorio POO", time: "02:00 PM", professor: "Ing. Ana Silva" },
    { id: 103, subjectId: 3, title: "Parcial Árboles", time: "04:00 PM", professor: "Ing. Carlos Mendoza" }
  ],
  12: [{ id: 104, subjectId: 3, title: "Entrega Proyecto", time: "11:59 PM", professor: "Ing. Carlos Mendoza" }],
  18: [{ id: 105, subjectId: 1, title: "Asesoría", time: "09:00 AM", professor: "Dr. Roberto Gómez" }],
  22: [{ id: 106, subjectId: 2, title: "Clase Magistral", time: "08:00 AM", professor: "Ing. Ana Silva" }],
};

export function CalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [activeFilters, setActiveFilters] = useState<number[]>(subjects.map(s => s.id));
  const [hoveredEvent, setHoveredEvent] = useState<any | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterEvent = (event: any, e: React.MouseEvent, subjectInfo: any) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const tooltipWidth = 256;
    let left = rect.right + 10;
    if (left + tooltipWidth > windowWidth) {
        left = rect.left - tooltipWidth - 10;
    }
    setHoveredEvent({ 
      ...event, 
      subjectInfo, 
      el: e.currentTarget,
      style: { top: Math.max(10, rect.top - 10), left }
    });
  };

  const handleMouseLeaveEvent = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredEvent(null);
    }, 200);
  };
  
  const [events, setEvents] = useState(initialEvents);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    subjectId: subjects[0].id,
    time: "",
    professor: "",
    date: 15,
    month: "Noviembre"
  });

  const toggleFilter = (id: number) => {
    setActiveFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getSubject = (id: number) => subjects.find(s => s.id === id);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.time.trim() || !newEvent.date) return;

    const day = Number(newEvent.date);
    const createdEvent = {
        id: Date.now(),
        subjectId: Number(newEvent.subjectId),
        title: newEvent.title,
        time: newEvent.time,
        professor: newEvent.professor || "No especificado"
    };

    setEvents(prev => {
        const dayEvents = prev[day] || [];
        return {
            ...prev,
            [day]: [...dayEvents, createdEvent]
        };
    });

    setIsEventModalOpen(false);
    setNewEvent({
        title: "",
        subjectId: subjects[0].id,
        time: "",
        professor: "",
        date: 15,
        month: "Noviembre"
    });
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative">
      <Sidebar />

      <main className="flex-1 h-full flex overflow-hidden">
        
        {/* Left/Center Area (Calendar) */}
        <div className="flex-1 flex flex-col h-full px-6 py-8 md:px-10 lg:px-12 overflow-y-auto w-full">
          
          {/* Header Controls */}
          <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
            <div className="flex flex-col gap-5 border-transparent">
              <div>
                <h1 className="text-3xl font-sans font-bold tracking-tight text-[#112613] flex items-center gap-3">
                  Calendario de Estructuración
                </h1>
                <p className="text-acorn-600 font-medium mt-1">El tiempo ordenado es el lienzo del conocimiento.</p>
              </div>

              {/* Month Navigation & View Toggle */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button className="p-1.5 hover:bg-acorn-400/10 rounded-md transition-colors text-[#112613]">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-mono font-bold text-lg uppercase tracking-wider text-[#112613]">Noviembre 2026</span>
                  <button className="p-1.5 hover:bg-acorn-400/10 rounded-md transition-colors text-[#112613]">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="h-6 w-px bg-acorn-400/20"></div>

                <div className="flex bg-white border border-acorn-400/20 rounded-lg p-1 shadow-sm">
                  <button 
                    onClick={() => setViewMode("month")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'month' ? 'bg-[#112613] text-[#F9F6F0]' : 'text-acorn-500 hover:text-[#112613]'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Mensual</span>
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'list' ? 'bg-[#112613] text-[#F9F6F0]' : 'text-acorn-500 hover:text-[#112613]'}`}
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">Lista</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono tracking-widest uppercase text-acorn-500 font-bold mr-2 hidden sm:block">Filtros:</span>
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => toggleFilter(subject.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    activeFilters.includes(subject.id) 
                      ? `${subject.badgeColor} border-transparent shadow-sm opacity-100` 
                      : 'bg-white border-acorn-400/20 text-acorn-400 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${subject.dotColor} ${activeFilters.includes(subject.id) ? '' : 'bg-acorn-300'}`}></div>
                  {subject.name}
                </button>
              ))}
              <div className="flex-1" />
              <button 
                onClick={() => setIsEventModalOpen(true)}
                className="flex items-center gap-2 bg-[#112613] hover:bg-moss-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors ml-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Evento</span>
              </button>
            </div>
          </header>

          {/* Monthly View */}
          {viewMode === "month" && (
            <div className="flex-1 bg-white border border-acorn-400/20 rounded-xl shadow-sm flex flex-col overflow-hidden min-h-[600px] mb-8">
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-acorn-400/20 bg-[#F9F6F0]/50">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                  <div key={day} className="py-3 text-center text-xs font-mono font-bold tracking-widest uppercase text-acorn-500 border-r border-acorn-400/20 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="flex-1 grid grid-cols-7 auto-rows-fr">
                {calendarGrid.map((dayObj, index) => {
                  const today = 15; // Mock today
                  const isToday = dayObj.date === today;
                  const dayEvents = dayObj.date ? events[dayObj.date] || [] : [];
                  const filteredEvents = dayEvents.filter(e => activeFilters.includes(e.subjectId));
                  const isFreeDay = dayObj.date && filteredEvents.length === 0;

                  return (
                    <div 
                      key={index}
                      className={`min-h-[120px] p-2 border-b border-r border-acorn-400/20 relative group transition-colors hover:bg-acorn-50/30 ${
                        !dayObj.isCurrentMonth ? 'bg-[#F9F6F0]/30' : ''
                      } ${index % 7 === 6 ? 'border-r-0' : ''}`}
                    >
                      {dayObj.date && (
                        <>
                          <div className={`text-sm font-mono font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${
                            isToday ? 'bg-moss-700 text-white shadow-sm' : 'text-acorn-700'
                          }`}>
                            {dayObj.date}
                          </div>

                          <div className="flex flex-col gap-1 z-10 relative cursor-pointer">
                            {filteredEvents.map(event => {
                              const subjectInfo = getSubject(event.subjectId);
                              return (
                                <div 
                                  key={event.id}
                                  onMouseEnter={(e) => handleMouseEnterEvent(event, e, subjectInfo)}
                                  onMouseLeave={handleMouseLeaveEvent}
                                  className={`text-xs px-2 py-1 rounded border ${subjectInfo?.badgeColor} font-sans font-semibold truncate hover:brightness-95 transition-all shadow-sm`}
                                >
                                  <span className="font-mono opacity-80 mr-1 text-[10px]">{event.time.split(' ')[0]}</span>
                                  {event.title}
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Lardi watermark for free days */}
                          {isFreeDay && (
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity flex flex-col items-end gap-1 pointer-events-none">
                              <span className="text-[9px] font-mono font-bold text-moss-600 bg-moss-50 px-1 py-0.5 rounded leading-none">Día libre</span>
                              <Squirrel className="w-8 h-8 text-moss-500" strokeWidth={1} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* List View Placeholder */}
          {viewMode === "list" && (
            <div className="flex-1 bg-white border border-acorn-400/20 rounded-xl shadow-sm p-8 mb-8 flex flex-col overflow-auto">
               {/* Simplified list render */}
               {Object.entries(events).map(([dayStr, dayEventsArray]) => {
                 const day = parseInt(dayStr);
                 const typedEvents = dayEventsArray as Array<{ id: number, subjectId: number, title: string, time: string, professor: string }>;
                 const filteredEvents = typedEvents.filter(e => activeFilters.includes(e.subjectId));
                 if (filteredEvents.length === 0) return null;

                 return (
                   <div key={day} className="mb-8 last:mb-0">
                     <div className="flex items-center gap-4 mb-4">
                       <span className="font-mono text-2xl font-bold text-[#112613]">{day}</span>
                       <div className="h-px bg-acorn-400/20 flex-1"></div>
                     </div>
                     <div className="flex flex-col gap-3 pl-12 border-l-2 border-acorn-400/10 ml-3">
                       {filteredEvents.map(event => {
                         const subjectInfo = getSubject(event.subjectId);
                         return (
                           <div key={event.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-[#F9F6F0]/50 border border-acorn-400/20 hover:border-moss-500/30 transition-colors group">
                              <span className="font-mono text-sm font-bold text-acorn-500 w-24 shrink-0">{event.time}</span>
                              <div className="flex-1">
                                <h4 className="font-bold text-[#112613] text-lg">{event.title}</h4>
                                <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-sm mt-2 border ${subjectInfo?.badgeColor}`}>
                                   <div className={`w-1 h-1 rounded-full ${subjectInfo?.dotColor}`}></div>
                                   {subjectInfo?.name}
                                </div>
                              </div>
                              <Link to="/materia" className="self-start sm:self-center bg-white border border-[#112613]/10 hover:border-[#112613] text-[#112613] px-4 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 shrink-0 shadow-sm hover:bg-[#112613]/5">
                                <BookOpen className="w-4 h-4" />
                                Ir al apunte
                              </Link>
                           </div>
                         )
                       })}
                     </div>
                   </div>
                 )
               })}
            </div>
          )}

        </div>

        {/* Right Sidebar (Focus Panel) */}
        <aside className="w-80 bg-white border-l border-acorn-400/20 h-full p-6 flex flex-col hidden lg:flex relative z-10 shrink-0">
          <h3 className="font-mono font-bold uppercase tracking-widest text-xs text-acorn-500 mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Enfoque Próximo
          </h3>

          <div className="flex flex-col gap-4">
            
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-mono font-bold text-amber-700">En 2 horas</span>
              </div>
              <h4 className="font-bold font-sans text-lg text-[#112613] leading-tight mb-1">Laboratorio POO</h4>
              <p className="text-sm font-medium text-acorn-600 mb-4">Programación II</p>
              
              <Link to="/materias" className="block text-center w-full bg-amber-100 hover:bg-amber-400 hover:text-white text-amber-900 border border-amber-200 hover:border-amber-500 py-2 rounded-md font-bold text-xs transition-colors transition-colors">
                Preparar apunte
              </Link>
            </div>

            <div className="bg-[#F9F6F0] border border-acorn-400/20 rounded-xl p-5 shadow-sm relative overflow-hidden hover:border-moss-400 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-moss-500"></div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-acorn-500" />
                <span className="text-xs font-mono font-bold text-acorn-600">Mañana, 4:00 PM</span>
              </div>
              <h4 className="font-bold font-sans text-lg text-[#112613] leading-tight mb-1">Parcial Árboles</h4>
              <p className="text-sm font-medium text-acorn-600 mb-4">Estructura de Datos</p>
              
              <Link to="/materias" className="block text-center w-full bg-white hover:bg-moss-600 hover:text-white border border-acorn-400/30 hover:border-moss-600 text-moss-700 py-2 rounded-md font-bold text-xs transition-colors">
                Repasar conceptos
              </Link>
            </div>

          </div>
        </aside>

        {/* Hover Popover Portal simulation */}
        <AnimatePresence>
          {hoveredEvent && hoveredEvent.el && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              onMouseEnter={() => {
                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              }}
              onMouseLeave={handleMouseLeaveEvent}
              className="fixed z-50 bg-white rounded-xl shadow-xl border border-acorn-400/20 w-64 pointer-events-auto"
              style={hoveredEvent.style}
            >
              {/* Event details wrapper for clipping */}
              <div className="p-4 relative overflow-hidden rounded-xl">
                {/* Visual accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${hoveredEvent.subjectInfo?.dotColor}`}></div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${hoveredEvent.subjectInfo?.dotColor}`}></div>
                <span className="text-[10px] font-mono tracking-wider font-bold text-acorn-500 uppercase">{hoveredEvent.subjectInfo?.name}</span>
              </div>
              <h4 className="font-bold text-[#112613] text-base mb-2 leading-tight">{hoveredEvent.title}</h4>
              
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs font-medium text-acorn-600">
                  <Clock className="w-3.5 h-3.5" />
                  {hoveredEvent.time}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-acorn-600">
                  <Squirrel className="w-3.5 h-3.5" />
                  {hoveredEvent.professor}
                </div>
              </div>

              <Link 
                to="/materia" 
                className="w-full bg-[#112613] hover:bg-moss-900 transition-colors text-white py-2 rounded-md font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Ir al apunte
              </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isEventModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#112613]/40 backdrop-blur-sm"
                onClick={() => setIsEventModalOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#F9F6F0] rounded-2xl shadow-xl border border-acorn-400/20 w-full max-w-md relative z-10 overflow-hidden"
              >
                <div className="p-6 border-b border-acorn-400/10 flex justify-between items-center bg-white">
                  <h2 className="text-xl font-sans font-bold text-[#112613]">Nuevo Evento</h2>
                  <button 
                    onClick={() => setIsEventModalOpen(false)}
                    className="text-acorn-400 hover:text-[#112613] transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateEvent} className="p-6 flex flex-col gap-5">
                  <div className="flex flex-col gap-2 relative group mt-2">
                    <input 
                      type="text"
                      required
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                      placeholder="Título"
                      id="eventTitle"
                    />
                    <label 
                      htmlFor="eventTitle" 
                      className={`absolute left-0 transition-all cursor-text
                        peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold 
                        ${newEvent.title ? '-top-4 text-xs font-bold text-[#112613]' : 'top-2 text-[#112613]/50'}
                      `}
                    >
                      Título del evento
                    </label>
                    <div className={`absolute bottom-0 left-0 w-0 h-[2px] bg-moss-500 transition-all duration-300 peer-focus:w-full`}></div>
                  </div>

                  <div className="flex flex-col gap-2 relative group mt-2">
                    <select 
                      id="eventSubject"
                      value={newEvent.subjectId}
                      onChange={(e) => setNewEvent({...newEvent, subjectId: Number(e.target.value)})}
                      className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer appearance-none"
                    >
                      {subjects.map(s => (
                        <option key={s.id} value={s.id} className="text-[#112613]">{s.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#112613]/50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <label 
                      htmlFor="eventSubject" 
                      className="absolute left-0 -top-4 text-xs font-bold text-[#112613] transition-all cursor-text"
                    >
                      Materia
                    </label>
                    <div className={`absolute bottom-0 left-0 w-0 h-[2px] bg-moss-500 transition-all duration-300 peer-focus:w-full`}></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 relative group mt-2">
                      <input 
                        type="number"
                        min="1"
                        max="31"
                        required
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: Number(e.target.value)})}
                        className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                        placeholder="Día"
                        id="eventDate"
                      />
                      <label 
                        htmlFor="eventDate" 
                        className={`absolute left-0 transition-all cursor-text
                          peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold 
                          ${newEvent.date ? '-top-4 text-xs font-bold text-[#112613]' : 'top-2 text-[#112613]/50'}
                        `}
                      >
                        Día
                      </label>
                      <div className={`absolute bottom-0 left-0 w-0 h-[2px] bg-moss-500 transition-all duration-300 peer-focus:w-full`}></div>
                    </div>

                    <div className="flex flex-col gap-2 relative group mt-2">
                      <select 
                        id="eventMonth"
                        value={newEvent.month}
                        onChange={(e) => setNewEvent({...newEvent, month: e.target.value})}
                        className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer appearance-none"
                      >
                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(m => (
                          <option key={m} value={m} className="text-[#112613]">{m}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#112613]/50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      <label 
                        htmlFor="eventMonth" 
                        className="absolute left-0 -top-4 text-xs font-bold text-[#112613] transition-all cursor-text"
                      >
                        Mes
                      </label>
                      <div className={`absolute bottom-0 left-0 w-0 h-[2px] bg-moss-500 transition-all duration-300 peer-focus:w-full`}></div>
                    </div>

                    <div className="flex flex-col gap-2 relative group mt-2">
                      <input 
                        type="time"
                        required
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                        id="eventTime"
                      />
                      <label 
                        htmlFor="eventTime" 
                        className="absolute left-0 -top-4 text-xs font-bold text-[#112613] transition-all cursor-text"
                      >
                        Hora
                      </label>
                      <div className={`absolute bottom-0 left-0 w-0 h-[2px] bg-moss-500 transition-all duration-300 peer-focus:w-full`}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 relative group mt-2">
                    <input 
                      type="text"
                      value={newEvent.professor}
                      onChange={(e) => setNewEvent({...newEvent, professor: e.target.value})}
                      className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                      placeholder="Profesor"
                      id="eventProfessor"
                    />
                    <label 
                      htmlFor="eventProfessor" 
                      className={`absolute left-0 transition-all cursor-text
                        peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold 
                        ${newEvent.professor ? '-top-4 text-xs font-bold text-[#112613]' : 'top-2 text-[#112613]/50'}
                      `}
                    >
                      Profesor / Encargado
                    </label>
                    <div className={`absolute bottom-0 left-0 w-0 h-[2px] bg-moss-500 transition-all duration-300 peer-focus:w-full`}></div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!newEvent.title.trim() || !newEvent.time.trim() || !newEvent.date}
                    className="mt-4 w-full bg-[#112613] hover:bg-moss-900 disabled:bg-acorn-300 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
                  >
                    Guardar Evento
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

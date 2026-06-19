import React, { useState, useRef } from "react";
import { Sidebar } from "../../../shared/layout/Sidebar";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Plus } from "lucide-react";
import { FocusPanel } from "../components/FocusPanel";
import { EventModal } from "../components/EventModal";
import { EventHoverPopover } from "../components/EventHoverPopover";
import { CalendarGrid } from "../components/CalendarGrid";
import { CalendarList } from "../components/CalendarList";

const subjects = [
  { id: 1, name: "Cálculo Integral", badgeColor: "bg-blue-100 text-blue-700 border-blue-200", dotColor: "bg-blue-500" },
  { id: 2, name: "Programación II", badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", dotColor: "bg-emerald-500" },
  { id: 3, name: "Estructura de Datos", badgeColor: "bg-purple-100 text-purple-700 border-purple-200", dotColor: "bg-purple-500" },
];

const calendarGrid = Array.from({ length: 35 }, (_, i) => {
  const date = i - 1;
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
        
        <div className="flex-1 flex flex-col h-full px-6 py-8 md:px-10 lg:px-12 overflow-y-auto w-full">
          
          <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
            <div className="flex flex-col gap-5 border-transparent">
              <div>
                <h1 className="text-3xl font-sans font-bold tracking-tight text-[#112613] flex items-center gap-3">
                  Calendario de Estructuración
                </h1>
                <p className="text-acorn-600 font-medium mt-1">El tiempo ordenado es el lienzo del conocimiento.</p>
              </div>

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

          {viewMode === "month" && (
            <CalendarGrid 
              calendarGrid={calendarGrid}
              events={events}
              activeFilters={activeFilters}
              getSubject={getSubject}
              handleMouseEnterEvent={handleMouseEnterEvent}
              handleMouseLeaveEvent={handleMouseLeaveEvent}
            />
          )}

          {viewMode === "list" && (
            <CalendarList 
              events={events}
              activeFilters={activeFilters}
              getSubject={getSubject}
            />
          )}

        </div>

        <FocusPanel />

        <EventHoverPopover 
          hoveredEvent={hoveredEvent}
          handleMouseLeaveEvent={handleMouseLeaveEvent}
          hoverTimeoutRef={hoverTimeoutRef}
        />
        
        <EventModal 
          isEventModalOpen={isEventModalOpen}
          setIsEventModalOpen={setIsEventModalOpen}
          handleCreateEvent={handleCreateEvent}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          subjects={subjects}
        />
      </main>
    </div>
  );
}

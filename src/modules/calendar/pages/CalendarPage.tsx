import React, { useState, useRef } from "react";
import { Sidebar } from "../../../shared/layout/Sidebar";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Plus, Bell } from "lucide-react";
import { FocusPanel } from "../components/FocusPanel";
import { EventModal } from "../components/EventModal";
import { EventHoverPopover } from "../components/EventHoverPopover";
import { CalendarGrid } from "../components/CalendarGrid";
import { CalendarList } from "../components/CalendarList";
import { usePageTitle } from "../../../core/hooks/usePageTitle";

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const generateCalendarGrid = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const grid = [];
  
  for (let i = 0; i < firstDay; i++) {
    grid.push({ date: null, isCurrentMonth: false });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push({ date: i, isCurrentMonth: true });
  }
  
  const totalSlots = grid.length <= 35 ? 35 : 42;
  while (grid.length < totalSlots) {
    grid.push({ date: null, isCurrentMonth: false });
  }
  
  return grid;
};

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [events, setEvents] = useState<any>({});
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
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
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Default fullDate to today in YYYY-MM-DD format
  const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const [newEvent, setNewEvent] = useState({
    title: "",
    subjectId: "",
    time: "",
    professor: "",
    fullDate: todayStr,
    type: "Recordatorio"
  });

  const calendarGrid = React.useMemo(() => generateCalendarGrid(year, month), [year, month]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, remRes, sessRes] = await Promise.all([
          fetch('http://localhost:5000/api/subjects', { credentials: 'include' }),
          fetch(`http://localhost:5000/api/reminders/calendar?year=${year}&month=${month + 1}`, { credentials: 'include' }),
          fetch(`http://localhost:5000/api/sessions/calendar?year=${year}&month=${month + 1}`, { credentials: 'include' })
        ]);

        if (subRes.status === 403 || remRes.status === 403 || sessRes.status === 403) {
          window.location.href = '/setup-drive';
          return;
        }

        if (subRes.ok) {
          const sData = await subRes.json();
          const mappedSubjects = sData.map((s: any) => ({
            id: s._id,
            name: s.name,
            badgeColor: "bg-[#112613]/5 border-acorn-400/20 text-[#112613]", 
            dotColor: "bg-[#112613]"
          }));
          setSubjects(mappedSubjects);
          if (mappedSubjects.length > 0) {
            setNewEvent(prev => ({ ...prev, subjectId: mappedSubjects[0].id }));
          }
          if (activeFilters.length === 0) {
             setActiveFilters(['__reminders__', ...mappedSubjects.map((s: any) => s.id)]);
          }
        }

        const grouped: any = {};

        // 1. Merge reminders
        if (remRes.ok) {
          const remData = await remRes.json();
          remData.forEach((rem: any) => {
            const day = new Date(rem.date).getUTCDate();
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push({
              id: rem._id,
              subjectId: rem.subjectId || '__reminders__',
              title: rem.title,
              time: rem.time,
              type: rem.type || 'Recordatorio',
              isReminder: true
            });
          });
        }

        // 2. Merge sessions (clases) as read-only items
        if (sessRes.ok) {
          const sessData = await sessRes.json();
          sessData.forEach((sess: any) => {
            const day = new Date(sess.date).getUTCDate();
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push({
              id: sess._id,
              subjectId: sess.subjectId,
              title: sess.title,
              time: sess.time,
              type: sess.type || 'Clase',
              isReminder: false
            });
          });
        }

        setEvents(grouped);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [year, month]);

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getSubject = (id: string) => {
    if (id === '__reminders__') return { id: '__reminders__', name: 'Recordatorio', badgeColor: 'bg-amber-50 border-amber-200 text-amber-800', dotColor: 'bg-amber-500' };
    return subjects.find(s => s.id === id);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.time.trim() || !newEvent.fullDate) return;

    try {
      const payload: any = {
        title: newEvent.title,
        date: newEvent.fullDate,
        time: newEvent.time,
        type: newEvent.type || 'Recordatorio'
      };

      // Solo incluir subjectId si se seleccionó una materia
      if (newEvent.subjectId) {
        payload.subjectId = newEvent.subjectId;
      }

      const res = await fetch('http://localhost:5000/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const created = await res.json();
        const day = parseInt(newEvent.fullDate.split('-')[2]);
        const createdEvent = {
            id: created._id,
            subjectId: created.subjectId || '__reminders__',
            title: created.title,
            time: created.time,
            type: created.type || 'Recordatorio',
            isReminder: true
        };

        const [evYear, evMonth] = newEvent.fullDate.split('-').map(Number);
        if (evYear === year && evMonth === month + 1) {
          setEvents((prev: any) => ({
              ...prev,
              [day]: [...(prev[day] || []), createdEvent]
          }));
        }

        setIsEventModalOpen(false);
        setNewEvent(prev => ({ ...prev, title: "", time: "" }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };
  
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

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
                  <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-acorn-400/10 rounded-md transition-colors text-[#112613]">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-mono font-bold text-lg uppercase tracking-wider text-[#112613]">{monthNames[month]} {year}</span>
                  <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-acorn-400/10 rounded-md transition-colors text-[#112613]">
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
              {/* Reminder filter chip */}
              <button
                onClick={() => toggleFilter('__reminders__')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  activeFilters.includes('__reminders__') 
                    ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm opacity-100' 
                    : 'bg-white border-acorn-400/20 text-acorn-400 opacity-60 hover:opacity-80'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeFilters.includes('__reminders__') ? 'bg-amber-500' : 'bg-acorn-300'}`}></div>
                Recordatorios
              </button>
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
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors ml-auto"
              >
                <Bell className="w-4 h-4" />
                <span>Nuevo Recordatorio</span>
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
              currentYear={year}
              currentMonth={month}
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

        <FocusPanel events={events} subjects={subjects} getSubject={getSubject} currentYear={year} currentMonth={month} />

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

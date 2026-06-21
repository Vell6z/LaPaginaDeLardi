import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, CalendarCheck } from "lucide-react";

export function FocusPanel({ events, subjects, getSubject, currentYear, currentMonth }: any) {
  // Build a flat list of all events with their real dates, then find upcoming ones
  const now = new Date();
  const upcomingList: any[] = [];

  if (events && typeof events === 'object') {
    Object.entries(events).forEach(([dayStr, dayEvents]: [string, any]) => {
      const day = parseInt(dayStr);
      const eventDate = new Date(currentYear, currentMonth, day);
      
      // Only include events from today onward
      if (eventDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        (dayEvents as any[]).forEach((ev: any) => {
          const subject = getSubject(ev.subjectId);
          upcomingList.push({
            ...ev,
            date: eventDate,
            day,
            subjectName: subject?.name || 'Materia',
            subjectId: ev.subjectId
          });
        });
      }
    });
  }

  // Sort by date, then by time
  upcomingList.sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextEvents = upcomingList.slice(0, 3);

  const getTimeLabel = (eventDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const evDay = new Date(eventDate);
    evDay.setHours(0, 0, 0, 0);
    
    const diffMs = evDay.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Mañana";
    if (diffDays <= 7) return `En ${diffDays} días`;
    return eventDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  };

  return (
    <aside className="w-80 bg-white border-l border-acorn-400/20 h-full p-6 flex flex-col hidden lg:flex relative z-10 shrink-0">
      <h3 className="font-mono font-bold uppercase tracking-widest text-xs text-acorn-500 mb-6 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        Enfoque Próximo
      </h3>

      <div className="flex flex-col gap-4">
        {nextEvents.length > 0 ? (
          nextEvents.map((ev, i) => {
            const timeLabel = getTimeLabel(ev.date);
            const isUrgent = timeLabel === "Hoy" || timeLabel === "Mañana";
            
            return (
              <div 
                key={ev.id || i}
                className={`rounded-xl p-5 shadow-sm relative overflow-hidden group transition-colors ${
                  isUrgent 
                    ? 'bg-amber-50/50 border border-amber-200/50 hover:border-amber-400' 
                    : 'bg-[#F9F6F0] border border-acorn-400/20 hover:border-moss-400'
                }`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${isUrgent ? 'bg-amber-400' : 'bg-moss-500'}`}></div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className={`w-4 h-4 ${isUrgent ? 'text-amber-600' : 'text-acorn-500'}`} />
                  <span className={`text-xs font-mono font-bold ${isUrgent ? 'text-amber-700' : 'text-acorn-600'}`}>
                    {timeLabel}{ev.time ? `, ${ev.time}` : ''}
                  </span>
                </div>
                <h4 className="font-bold font-sans text-lg text-[#112613] leading-tight mb-1">{ev.title}</h4>
                <p className="text-sm font-medium text-acorn-600 mb-3">{ev.subjectName}</p>
                
                {ev.type && (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    ev.type === 'Parcial' ? 'bg-red-100 text-red-700' : 
                    ev.type === 'Taller' ? 'bg-amber-100 text-amber-700' : 
                    'bg-moss-100 text-moss-700'
                  }`}>
                    {ev.type}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarCheck className="w-10 h-10 text-moss-400 mb-3" />
            <p className="text-sm font-bold text-[#112613] mb-1">¡Todo despejado!</p>
            <p className="text-xs text-acorn-500 font-medium">No tienes eventos próximos este mes.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

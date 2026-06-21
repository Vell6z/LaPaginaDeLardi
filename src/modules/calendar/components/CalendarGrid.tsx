import React from "react";
import { Squirrel } from "lucide-react";

export function CalendarGrid({
  calendarGrid,
  events,
  activeFilters,
  getSubject,
  handleMouseEnterEvent,
  handleMouseLeaveEvent,
  currentYear,
  currentMonth
}: any) {
  const now = new Date();
  const realToday = now.getDate();
  const isViewingCurrentMonth = currentYear === now.getFullYear() && currentMonth === now.getMonth();

  return (
    <div className="flex-1 bg-white border border-acorn-400/20 rounded-xl shadow-sm flex flex-col overflow-hidden min-h-[600px] mb-8">
      <div className="grid grid-cols-7 border-b border-acorn-400/20 bg-[#F9F6F0]/50">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="py-3 text-center text-xs font-mono font-bold tracking-widest uppercase text-acorn-500 border-r border-acorn-400/20 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {calendarGrid.map((dayObj: any, index: number) => {
          const isToday = isViewingCurrentMonth && dayObj.date === realToday;
          const dayEvents = dayObj.date ? events[dayObj.date] || [] : [];
          const filteredEvents = dayEvents.filter((e: any) => activeFilters.includes(e.subjectId));
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
                    {filteredEvents.map((event: any) => {
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
  );
}

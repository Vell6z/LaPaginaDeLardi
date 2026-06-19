import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export function CalendarList({ events, activeFilters, getSubject }: any) {
  return (
    <div className="flex-1 bg-white border border-acorn-400/20 rounded-xl shadow-sm p-8 mb-8 flex flex-col overflow-auto">
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
  );
}

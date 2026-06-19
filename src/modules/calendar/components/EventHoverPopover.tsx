import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Clock, Squirrel, BookOpen } from "lucide-react";

export function EventHoverPopover({
  hoveredEvent,
  handleMouseLeaveEvent,
  hoverTimeoutRef
}: any) {
  return (
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
          <div className="p-4 relative overflow-hidden rounded-xl">
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
  );
}

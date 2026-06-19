import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export function EventModal({
  isEventModalOpen,
  setIsEventModalOpen,
  handleCreateEvent,
  newEvent,
  setNewEvent,
  subjects
}: any) {
  return (
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
                  {subjects.map((s: any) => (
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
  );
}

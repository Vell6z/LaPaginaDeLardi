import React from "react";
import { motion } from "motion/react";
import { X, Loader2 } from "lucide-react";

export function SubjectModal({
  editingSubjectId,
  closeAndResetModal,
  handleSubmitSubject,
  newSubject,
  setNewSubject,
  isSubmitting,
  availableColors,
  availableIcons
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112613]/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        {/* Dynamic color indicator bar */}
        <div className={`h-2 w-full transition-colors duration-300 ${newSubject.color}`}></div>

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-sans font-bold text-[#112613]">{editingSubjectId ? "Editar Asignatura" : "Nueva Asignatura"}</h2>
            <button 
              onClick={closeAndResetModal}
              className="text-[#112613]/40 hover:text-[#112613] p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitSubject} className="flex flex-col gap-8">
            
            {/* Subject Name Input */}
            <div className="flex flex-col gap-2 relative group mt-2">
              <input 
                type="text" 
                id="subjectName"
                required
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                placeholder="Ej: Estructuras de Datos"
              />
              <label 
                htmlFor="subjectName" 
                className={`absolute left-0 transition-all cursor-text
                  peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold 
                  ${newSubject.name ? '-top-4 text-xs font-bold text-[#112613]' : 'top-2 text-[#112613]/50'}
                `}
              >
                Nombre de la Materia
              </label>
              <div className={`absolute bottom-0 left-0 w-0 h-[2px] ${newSubject.color} transition-all duration-300 peer-focus:w-full`}></div>
            </div>

            {/* Color & Icon Selectors */}
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-bold text-[#112613]/70 font-mono tracking-widest uppercase">Identidad Visual</h3>
              
              {/* Color dots */}
              <div className="flex items-center gap-3">
                {availableColors.map((colorValue: string) => (
                  <button
                    key={colorValue}
                    type="button"
                    onClick={() => setNewSubject({...newSubject, color: colorValue})}
                    className={`w-8 h-8 rounded-full ${colorValue} border-2 transition-transform ${newSubject.color === colorValue ? 'border-[#112613] scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                  />
                ))}
              </div>

              {/* Icons Grid */}
              <div className="grid grid-cols-5 gap-3 mt-1">
                {availableIcons.map((i: any) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => setNewSubject({...newSubject, iconId: i.id})}
                    className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                      newSubject.iconId === i.id 
                        ? `bg-white border-[#112613] text-[#112613] shadow-sm` 
                        : `border-transparent bg-acorn-50 text-acorn-500 hover:bg-acorn-100 hover:text-[#112613]`
                    }`}
                  >
                    {i.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Information Grid */}
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-bold text-[#112613]/70 font-mono tracking-widest uppercase mt-2">Información Académica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Professor Input */}
                <div className="flex flex-col gap-2 relative group mt-2">
                  <input 
                    type="text" 
                    id="professorName"
                    value={newSubject.professor}
                    onChange={(e) => setNewSubject({...newSubject, professor: e.target.value})}
                    className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                    placeholder="Ej: Ing. Carlos Mendoza"
                  />
                  <label 
                    htmlFor="professorName" 
                    className={`absolute left-0 transition-all cursor-text
                      peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold 
                      ${newSubject.professor ? '-top-4 text-xs font-bold text-[#112613]' : 'top-2 text-[#112613]/50'}
                    `}
                  >
                    Nombre del Profesor
                  </label>
                  <div className={`absolute bottom-0 left-0 w-0 h-[2px] ${newSubject.color} transition-all duration-300 peer-focus:w-full`}></div>
                </div>

                {/* Semester Input */}
                <div className="flex flex-col gap-2 relative group mt-2">
                  <input 
                    type="number"
                    id="semesterName"
                    required
                    min="1"
                    max="20"
                    value={newSubject.semester}
                    onChange={(e) => setNewSubject({...newSubject, semester: e.target.value})}
                    className="w-full bg-transparent border-b border-[#112613]/20 py-2 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                    placeholder="Ej: 4"
                  />
                  <label 
                    htmlFor="semesterName" 
                    className={`absolute left-0 transition-all cursor-text
                      peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold 
                      ${newSubject.semester ? '-top-4 text-xs font-bold text-[#112613]' : 'top-2 text-[#112613]/50'}
                    `}
                  >
                    Semestre
                  </label>
                  <div className={`absolute bottom-0 left-0 w-0 h-[2px] ${newSubject.color} transition-all duration-300 peer-focus:w-full`}></div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-4 mt-6">
              <button 
                type="button"
                onClick={closeAndResetModal}
                className="text-[#112613]/50 hover:text-[#112613] font-medium transition-colors px-4 py-2"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={isSubmitting || !newSubject.name}
                className="flex items-center justify-center gap-2 bg-[#112613] hover:bg-moss-900 focus:bg-moss-900 text-[#F9F6F0] px-8 py-3 rounded-md font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  editingSubjectId ? "Guardar Cambios" : "Crear Materia"
                )}
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

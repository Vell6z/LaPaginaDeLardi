import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";

export function SessionModal({
  isClassModalOpen,
  closeAndResetModal,
  handleSubmitClass,
  editingSessionId,
  newSessionTitle,
  setNewSessionTitle,
  newSessionType,
  setNewSessionType
}: any) {
  if (!isClassModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#112613]/40 backdrop-blur-sm"
        onClick={closeAndResetModal}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#F9F6F0] rounded-2xl shadow-xl border border-acorn-400/20 w-full max-w-md relative z-10 overflow-hidden"
      >
        <div className="p-6 border-b border-acorn-400/10 flex justify-between items-center bg-white">
          <h2 className="text-xl font-sans font-bold text-[#112613]">
            {editingSessionId ? "Editar clase" : "Agregar nueva clase"}
          </h2>
          <button 
            onClick={closeAndResetModal}
            className="text-acorn-400 hover:text-[#112613] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmitClass} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Título de la clase</label>
            <input 
              type="text" 
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              placeholder="Ej. Clase 07: Grafos y Búsquedas"
              className="w-full bg-white border border-acorn-400/20 rounded-xl px-4 py-3 text-[#112613] outline-none focus:border-moss-500 transition-colors placeholder-acorn-400 font-medium"
              required
            />
            {!editingSessionId && (
              <div className="flex items-start gap-2 mt-1 px-1">
                <Sparkles className="w-4 h-4 text-moss-500 shrink-0 mt-0.5" />
                <p className="text-xs text-acorn-500 leading-tight">
                  <strong className="text-moss-700">Recomendación:</strong> Usa un título descriptivo. Esto ayudará a <strong className="text-moss-700">LardIA</strong> a entender mejor el contexto y tener mayor precisión al analizar tus clases.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Tipo de apunte</label>
            <select 
              value={newSessionType}
              onChange={(e) => setNewSessionType(e.target.value)}
              className="w-full bg-white border border-acorn-400/20 rounded-xl px-4 py-3 text-[#112613] outline-none focus:border-moss-500 transition-colors font-medium appearance-none"
            >
              <option value="Clase">Clase</option>
              <option value="Taller">Taller</option>
              <option value="Parcial">Parcial</option>
              <option value="Proyecto">Proyecto</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={!newSessionTitle.trim()}
            className="mt-4 w-full bg-[#112613] hover:bg-moss-900 disabled:bg-acorn-300 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
          >
            {editingSessionId ? "Guardar cambios" : "Agregar apunte"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

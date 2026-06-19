import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoreHorizontal, PenTool, Heart, Archive, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SubjectCard({ 
  materia, 
  activeMenuId, 
  setActiveMenuId, 
  openEditModal, 
  toggleFavorite, 
  toggleArchive, 
  deleteSubject,
  availableIcons
}: any) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate('/materias/' + materia.id)}
      className={`bg-white rounded-xl border border-acorn-400/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-[220px] ${materia.isArchived ? 'opacity-50 grayscale-[0.5]' : ''}`}
    >
      {/* Header Strip */}
      <div className={`${materia.color} h-2 w-full relative`}>
        {/* Settings Icon and Dropdown */}
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuId(activeMenuId === materia.id ? null : materia.id);
            }}
            className={`p-1.5 bg-white/90 rounded-md text-[#112613] transition-opacity hover:bg-white shadow-sm ${activeMenuId === materia.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {activeMenuId === materia.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-acorn-400/10 py-1 flex flex-col z-20 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#112613] hover:bg-acorn-50 transition-colors w-full text-left font-medium"
                  onClick={(e) => { e.stopPropagation(); openEditModal(materia); }}
                >
                  <PenTool className="w-4 h-4 text-[#112613]" />
                  Editar materia
                </button>
                <button 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#112613] hover:bg-acorn-50 transition-colors w-full text-left font-medium"
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(materia.id); }}
                >
                  <Heart className={`w-4 h-4 ${materia.isFavorite ? 'text-rose-500 fill-rose-500' : 'text-rose-500'}`} />
                  {materia.isFavorite ? 'Quitar de favoritas' : 'Agregar a favoritas'}
                </button>
                <button 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#112613] hover:bg-acorn-50 transition-colors w-full text-left font-medium"
                  onClick={(e) => { e.stopPropagation(); toggleArchive(materia.id); }}
                >
                  <Archive className={`w-4 h-4 ${materia.isArchived ? 'text-acorn-500 fill-acorn-500' : 'text-acorn-500'}`} />
                  {materia.isArchived ? 'Desarchivar materia' : 'Archivar materia'}
                </button>
                <button 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left font-medium"
                  onClick={(e) => { e.stopPropagation(); deleteSubject(materia.id); }}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  Borrar materia
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className={`p-2.5 rounded-lg text-white ${materia.color} shadow-sm shrink-0`}>
            {availableIcons.find((icon: any) => icon.id === materia.iconId)?.icon}
          </div>
          <div className="min-w-0 pr-4 flex-1">
            <div className="flex justify-between items-start gap-2">
              <h2 className="text-[#112613] font-sans font-bold text-lg leading-tight truncate">
                {materia.name}
              </h2>
              {materia.isFavorite && <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />}
            </div>
          </div>
        </div>

        {/* Subtitles */}
        <div className="flex flex-col gap-1 mt-auto mb-5">
          <p className="text-sm font-medium text-[#112613]/70 truncate">
            Profesor: {materia.professor}
          </p>
          <p className="text-xs font-medium text-[#112613]/50">
            Semestre: {materia.semester}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-xs font-bold text-moss-700">Progreso de Apuntes</span>
            <span className="text-xs font-medium text-acorn-500">{materia.notesCount} / {materia.expectedNotes}</span>
          </div>
          <div className="w-full h-1.5 bg-acorn-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${materia.color} rounded-full`} 
              style={{ width: `${(materia.notesCount / materia.expectedNotes) * 100}%` }}
            ></div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

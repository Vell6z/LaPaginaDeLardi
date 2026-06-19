import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoreVertical, Star, PenTool, Share2, Trash, Clock, CheckCircle2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SessionCard({ 
  session, 
  id, 
  activeMenuId, 
  setActiveMenuId, 
  toggleHighlight, 
  openEditModal, 
  shareSession, 
  deleteSession 
}: any) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch(status) {
      case "IA Procesado": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Transcrito": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pendiente de Repaso": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-acorn-100 text-acorn-700 border-acorn-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "IA Procesado": return <CheckCircle2 className="w-3 h-3" />;
      case "Transcrito": return <FileText className="w-3 h-3" />;
      case "Pendiente de Repaso": return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div 
      onClick={() => navigate(`/materias/${id}/clase/${session.id}`)}
      className={`bg-white border rounded-xl p-5 cursor-pointer flex flex-col gap-4 transition-all duration-300 relative border-acorn-400/20 shadow-sm hover:border-moss-400 hover:shadow-md`}
      onMouseLeave={() => activeMenuId === session.id && setActiveMenuId(null)}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-sans font-bold text-[#112613] text-lg leading-tight line-clamp-2">
           {session.isHighlighted && <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline-block mr-2 -mt-1" />}
          {session.title}
        </h3>
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === session.id ? null : session.id); }}
            className="text-acorn-400 hover:text-[#112613] transition-colors p-1 shrink-0"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {activeMenuId === session.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale:  1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-acorn-400/20 py-2 z-30"
              >
                <button 
                  onClick={(e) => toggleHighlight(e, session.id)}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-[#112613] hover:bg-moss-50 hover:text-moss-700 transition-colors flex items-center gap-2"
                >
                  <Star className={`w-4 h-4 ${session.isHighlighted ? "fill-amber-400 text-amber-400" : ""}`} />
                  {session.isHighlighted ? "Quitar destacado" : "Destacar clase"}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); openEditModal(session); }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-[#112613] hover:bg-moss-50 hover:text-moss-700 transition-colors flex items-center gap-2"
                >
                  <PenTool className="w-4 h-4" />
                  Editar clase
                </button>
                <button 
                  onClick={(e) => shareSession(e)}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-[#112613] hover:bg-moss-50 hover:text-moss-700 transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Compartir clase
                </button>
                <div className="h-px w-full bg-acorn-400/10 my-1"></div>
                <button 
                  onClick={(e) => deleteSession(e, session.id)}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash className="w-4 h-4" />
                  Borrar clase
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto">
        <div className="flex items-center gap-1.5 text-acorn-500 text-xs font-mono font-bold">
          <Clock className="w-3.5 h-3.5" />
          {session.date} • {session.time}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-mono uppercase tracking-wider font-bold ${getStatusColor(session.status)}`}>
          {getStatusIcon(session.status)}
          {session.status}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-acorn-50 text-acorn-600 border border-acorn-200 text-[10px] font-mono uppercase tracking-wider font-bold">
          {session.type}
        </span>
      </div>
    </div>
  );
}

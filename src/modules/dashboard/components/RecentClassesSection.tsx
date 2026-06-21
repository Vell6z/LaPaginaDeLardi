import React, { useState } from "react";
import { Eye, Edit3, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RecentClassesSection({ recentClassesData }: { recentClassesData: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const totalPages = Math.ceil(recentClassesData.length / itemsPerPage);
  const currentRecentClasses = recentClassesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="xl:col-span-1">
      <h2 className="text-xs font-mono uppercase tracking-widest text-[#112613]/50 font-bold mb-4">
        Clases Recientes
      </h2>
      <div className="flex flex-col border-t border-acorn-400/20">
        {currentRecentClasses.map((activity, i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-acorn-400/20 group">
            <div className="flex-1 min-w-0 pr-4">
              <h4 
                onClick={() => navigate(`/materias/${activity.subjectId}/clase/${activity.id}`)}
                className="text-sm font-bold text-[#112613] truncate group-hover:text-moss-600 transition-colors cursor-pointer flex items-center"
              >
                {activity.isHighlighted && <Star className="w-4 h-4 text-amber-400 fill-amber-400 inline-block mr-1.5 shrink-0" />}
                {activity.title}
              </h4>
              <span className="text-xs text-acorn-500 font-mono mt-0.5 block">{activity.date}</span>
            </div>
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => navigate(`/materias/${activity.subjectId}/clase/${activity.id}`)}
                className="p-2 text-acorn-500 hover:text-moss-600 hover:bg-moss-50 rounded-md transition-colors cursor-pointer" 
                title="Ver Apunte"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate(`/materias/${activity.subjectId}/clase/${activity.id}`)}
                className="p-2 text-acorn-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer" 
                title="Editar Apunte"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md text-acorn-500 hover:text-moss-600 hover:bg-moss-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-acorn-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-acorn-500 font-mono">
            Página {currentPage} de {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md text-acorn-500 hover:text-moss-600 hover:bg-moss-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-acorn-500 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

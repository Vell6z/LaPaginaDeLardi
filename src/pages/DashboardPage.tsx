import { Link, useNavigate } from "react-router-dom";
import { 
  Squirrel, Plus, 
  Eye, Edit3, X, Zap, Library, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from "../components/Sidebar";

const materias = [
  { id: 1, name: "Cálculo Integral", count: 12 },
  { id: 2, name: "Física Mecánica", count: 8 },
  { id: 3, name: "Álgebra Lineal", count: 15 },
  { id: 4, name: "Programación II", count: 24 },
];

const recentClassesData = [
  { title: "Sustitución Trigonométrica", date: "Hoy, 10:30 AM" },
  { title: "Leyes de Newton (Repaso)", date: "Ayer, 16:45 PM" },
  { title: "Matrices Equivalentes", date: "Lun, 14:20 PM" },
  { title: "Herencia y Polimorfismo", date: "Lun, 09:15 AM" },
  { title: "Vectores en R3", date: "Vie, 11:00 AM" },
  { title: "Árboles AVL", date: "Jue, 08:00 AM" },
  { title: "Integrales Dobles", date: "Mié, 10:00 AM" },
  { title: "Cinemática", date: "Mié, 08:00 AM" },
  { title: "Bases de Datos", date: "Mar, 14:00 PM" },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(recentClassesData.length / itemsPerPage);
  const currentRecentClasses = recentClassesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613]">
       
       {/* Sidebar */}
       <Sidebar />

       {/* Main Content (Workspace) */}
       <main className="flex-1 h-full overflow-y-auto px-6 py-10 md:px-12 md:py-12 relative">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight mb-2 text-[#112613]">
                Hola, Juan. ¿Qué vamos a estructurar hoy?
              </h1>
              <p className="text-acorn-600 font-medium">Es un buen día para dominar el conocimiento.</p>
            </div>
            <Link to="/materias" state={{ openNewSubjectModal: true }} className="flex items-center justify-center gap-2 bg-[#112613] hover:bg-moss-900 text-[#F9F6F0] px-6 py-3.5 rounded-md font-bold transition-all shadow-[4px_4px_0px_0px_rgba(74,103,65,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(74,103,65,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] shrink-0 active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
              <Plus className="w-5 h-5" />
              <span>Nueva Clase</span>
            </Link>
          </header>

          {/* Enfoque Inmediato */}
          <section className="mb-14">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#112613]/50 font-bold mb-4">
              Enfoque Inmediato
            </h2>
            <div className="w-full bg-white border border-acorn-400/20 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> En Proceso
                  </span>
                  <span className="text-sm text-acorn-500 font-medium font-mono">Hace 2 horas</span>
                </div>
                <h3 className="text-2xl font-bold font-sans tracking-tight mb-1 text-[#112613]">
                  Estructuras de Datos y Algoritmos
                </h3>
                <p className="text-acorn-600 font-medium">Tema: Árboles Binarios de Búsqueda y Complejidad O(log n)</p>
              </div>
              
              <div className="w-full md:w-72 flex flex-col gap-3 bg-[#F9F6F0]/50 p-4 rounded-lg border border-acorn-400/10">
                <div className="flex justify-between text-sm font-bold text-[#112613]">
                  <span>Estructura lógica</span>
                  <span className="text-moss-600">75%</span>
                </div>
                <div className="w-full h-2.5 bg-acorn-200 rounded-full overflow-hidden">
                  <div className="h-full bg-moss-500 rounded-full w-[75%] relative overflow-hidden">
                    {/* progress shimmer effect */}
                    <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-xs text-acorn-500 text-right font-medium">Generando resumen IA...</p>
              </div>
            </div>
          </section>

          {/* Main Grid: Mis Materias & Actividad Reciente */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            
            {/* Mis Materias (takes 2 cols on xl) */}
            <section className="xl:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#112613]/50 font-bold">
                  Mis Materias
                </h2>
                <Link to="/materias" className="text-sm font-bold text-moss-600 hover:text-moss-800 transition-colors">
                  Ver todas &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {materias.map((materia, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate('/materias/' + materia.id)}
                    className="bg-white border border-acorn-400/20 rounded-xl p-6 flex flex-col items-center justify-center text-center aspect-square shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-[#F9F6F0] rounded-full flex items-center justify-center text-moss-600 mb-4 group-hover:bg-moss-100 group-hover:text-moss-700 transition-colors">
                      <Library className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-[#112613] text-sm leading-tight mb-1">{materia.name}</h3>
                    <p className="text-xs text-acorn-500 font-medium bg-acorn-50 px-2 py-0.5 rounded-md mt-1 border border-acorn-400/10">
                      {materia.count} apuntes
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Clases Recientes (takes 1 col on xl) */}
            <section className="xl:col-span-1">
               <h2 className="text-xs font-mono uppercase tracking-widest text-[#112613]/50 font-bold mb-4">
                Clases Recientes
              </h2>
              <div className="flex flex-col border-t border-acorn-400/20">
                {currentRecentClasses.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-acorn-400/20 group">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-sm font-bold text-[#112613] truncate group-hover:text-moss-600 transition-colors cursor-pointer">
                        {activity.title}
                      </h4>
                      <span className="text-xs text-acorn-500 font-mono mt-0.5 block">{activity.date}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-acorn-500 hover:text-moss-600 hover:bg-moss-50 rounded-md transition-colors" title="Ver Apunte">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-acorn-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Editar Apunte">
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
          </div>

          <div className="h-24"></div> {/* Bottom padding spacer */}

       </main>

       {/* Floating Lardi Tooltip */}
       <AnimatePresence>
          {showTooltip && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-end gap-3 max-w-[280px] md:max-w-sm"
            >
              <div className="bg-white p-4 rounded-2xl rounded-br-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-acorn-400/10 relative">
                <button 
                  onClick={() => setShowTooltip(false)}
                  className="absolute top-2 right-2 text-acorn-400 hover:text-acorn-600 transition-colors p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <p className="text-sm font-medium text-[#112613] leading-relaxed pr-4">
                  ¿Necesitas ayuda para organizar esta semana? <a href="#" className="text-moss-600 font-bold underline decoration-moss-300 underline-offset-2 hover:text-moss-700 transition-colors">Click aquí</a> para ver recomendaciones de estudio.
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-moss-100 flex items-center justify-center border-[3px] border-white shadow-lg shrink-0">
                <Squirrel className="w-6 h-6 md:w-8 md:h-8 text-moss-600" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}

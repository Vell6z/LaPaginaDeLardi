import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Sidebar } from "../../../shared/layout/Sidebar";
import { ImmediateFocusSection } from "../components/ImmediateFocusSection";
import { MySubjectsSection } from "../components/MySubjectsSection";
import { RecentClassesSection } from "../components/RecentClassesSection";
import { LardiTooltip } from "../components/LardiTooltip";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613]">
       <Sidebar />

       <main className="flex-1 h-full overflow-y-auto px-6 py-10 md:px-12 md:py-12 relative">
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#F9F6F0]/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg border border-moss-500/20">
                <Loader2 className="w-8 h-8 animate-spin text-moss-600" />
                <span className="font-sans font-bold tracking-widest text-sm animate-pulse text-[#112613]">
                  Sincronizando...
                </span>
              </div>
            </div>
          )}

          <header className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 transition-opacity duration-500 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
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

          <div className={`transition-opacity duration-700 ${isLoading ? 'opacity-20' : 'opacity-100'}`}>
            <ImmediateFocusSection />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 mt-12">
              <MySubjectsSection materias={materias} />
              <RecentClassesSection recentClassesData={recentClassesData} />
            </div>
          </div>

          <div className="h-24"></div>
       </main>

       <LardiTooltip />
    </div>
  );
}

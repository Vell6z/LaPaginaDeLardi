import React from "react";
import { Zap } from "lucide-react";

export function ImmediateFocusSection() {
  return (
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
  );
}

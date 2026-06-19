import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Clock } from "lucide-react";

export function FocusPanel() {
  return (
    <aside className="w-80 bg-white border-l border-acorn-400/20 h-full p-6 flex flex-col hidden lg:flex relative z-10 shrink-0">
      <h3 className="font-mono font-bold uppercase tracking-widest text-xs text-acorn-500 mb-6 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        Enfoque Próximo
      </h3>

      <div className="flex flex-col gap-4">
        
        <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-mono font-bold text-amber-700">En 2 horas</span>
          </div>
          <h4 className="font-bold font-sans text-lg text-[#112613] leading-tight mb-1">Laboratorio POO</h4>
          <p className="text-sm font-medium text-acorn-600 mb-4">Programación II</p>
          
          <Link to="/materias" className="block text-center w-full bg-amber-100 hover:bg-amber-400 hover:text-white text-amber-900 border border-amber-200 hover:border-amber-500 py-2 rounded-md font-bold text-xs transition-colors">
            Preparar apunte
          </Link>
        </div>

        <div className="bg-[#F9F6F0] border border-acorn-400/20 rounded-xl p-5 shadow-sm relative overflow-hidden hover:border-moss-400 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-moss-500"></div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-acorn-500" />
            <span className="text-xs font-mono font-bold text-acorn-600">Mañana, 4:00 PM</span>
          </div>
          <h4 className="font-bold font-sans text-lg text-[#112613] leading-tight mb-1">Parcial Árboles</h4>
          <p className="text-sm font-medium text-acorn-600 mb-4">Estructura de Datos</p>
          
          <Link to="/materias" className="block text-center w-full bg-white hover:bg-moss-600 hover:text-white border border-acorn-400/30 hover:border-moss-600 text-moss-700 py-2 rounded-md font-bold text-xs transition-colors">
            Repasar conceptos
          </Link>
        </div>

      </div>
    </aside>
  );
}

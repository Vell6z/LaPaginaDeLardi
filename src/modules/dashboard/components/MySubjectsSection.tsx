import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Library } from "lucide-react";

export function MySubjectsSection({ materias }: { materias: any[] }) {
  const navigate = useNavigate();

  return (
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
  );
}

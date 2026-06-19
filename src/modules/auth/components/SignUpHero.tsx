import React from "react";
import { Squirrel, Blocks, Layers, FileCode2 } from "lucide-react";

export function SignUpHero() {
  return (
    <div className="hidden lg:flex w-1/2 bg-[#112613] relative flex-col justify-end p-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/eafitRegistro.jpeg" 
          alt="Campus EAFIT" 
          className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#112613] via-[#112613]/80 to-[#112613]/40"></div>
      </div>

      {/* Background Grid / Blueprint effect */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(#F9F6F0_1px,transparent_1px),linear-gradient(90deg,#F9F6F0_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Graphic Area (Lardi architect) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 z-10 flex items-center justify-center opacity-80">
          {/* Abstract represention since we don't have the exact image */}
          <div className="relative w-full h-full animate-[spin_60s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-moss-400"><Blocks className="w-16 h-16" /></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[#F9F6F0]"><Squirrel className="w-24 h-24" /></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-amber-500"><Layers className="w-16 h-16" /></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-acorn-400"><FileCode2 className="w-16 h-16" /></div>
          </div>
          
          <div className="absolute inset-0 bg-moss-500/20 rounded-full blur-3xl -z-10"></div>
      </div>

      {/* Motivation Text */}
      <div className="relative z-20 max-w-lg mt-auto">
        <h1 className="text-5xl font-sans font-bold text-[#F9F6F0] mb-4 tracking-tight">
          Domina el caos.
        </h1>
        <p className="text-[#F9F6F0]/80 text-lg leading-relaxed">
          Aplica ingeniería a tu forma de estudiar. Estructura tus clases de arriba hacia abajo y no vuelvas a perderte en los detalles.
        </p>
      </div>
    </div>
  );
}

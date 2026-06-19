import React from "react";
import { Squirrel, Monitor, Database, Terminal } from "lucide-react";

export function AuthHero() {
  return (
    <div className="hidden lg:flex w-1/2 bg-[#0A140B] relative flex-col justify-end p-16 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/eafitRegistro.jpeg" 
          alt="Campus EAFIT" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A140B] via-[#0A140B]/80 to-[#0A140B]/40"></div>
      </div>

      {/* Abstract Graphic Area (Lardi Techwear/Hacker) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 z-10 flex items-center justify-center">
          {/* Soft screen glow effect */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-moss-400/10 blur-[80px] rounded-full mix-blend-screen"></div>
          
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Floating Data / UI Elements */}
            <div className="absolute top-10 left-10 text-moss-500/50 animate-pulse"><Database className="w-12 h-12" /></div>
            <div className="absolute bottom-20 right-10 text-amber-500/30 animate-pulse delay-700"><Terminal className="w-16 h-16" /></div>
            
            {/* Central figure - Stylized "Lardi" looking at monitor */}
            <div className="relative z-20 flex flex-col items-center drop-shadow-[0_0_15px_rgba(74,103,65,0.5)]">
              <Monitor className="w-24 h-24 text-moss-300 mb-4" />
              <Squirrel className="w-32 h-32 text-[#F9F6F0]" />
            </div>
          </div>
      </div>

      {/* Motivation Text */}
      <div className="relative z-20 max-w-lg mt-auto border-l-4 border-amber-500 pl-6">
        <h1 className="text-5xl font-sans font-bold text-[#F9F6F0] mb-4 tracking-tight">
          Retoma el control.
        </h1>
        <p className="text-[#F9F6F0]/80 text-lg leading-relaxed">
          Tu base de conocimiento estructurada te espera. Continúa exactamente donde lo dejaste.
        </p>
      </div>
    </div>
  );
}

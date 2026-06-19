import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Squirrel, Monitor, Database, Terminal } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body">
      {/* Left Half: Art & Return */}
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

      {/* Right Half: Login Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col px-8 py-12 md:px-16 md:py-16 overflow-y-auto">
        
        {/* Top Right Navigation */}
        <div className="flex justify-end items-center text-sm mb-16">
          <span className="text-[#112613]/60 mr-2">¿Aún no tienes acceso?</span>
          <Link to="/signup" className="font-bold text-[#112613] underline decoration-2 underline-offset-4 hover:text-moss-600 transition-colors">
            Construye tu espacio
          </Link>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          <div className="mb-10 lg:hidden flex items-center gap-2 text-[#112613] font-sans font-bold text-2xl tracking-tight">
            <Squirrel className="w-8 h-8 text-moss-600" />
            <span>LaPaginaDeLardi</span>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            
            {/* Input: Correo */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-mono tracking-widest text-[#112613] font-bold">
                &gt; [ IDENTIFICACIÓN ]
              </label>
              <input 
                type="email" 
                id="email" 
                className="w-full bg-transparent border-2 border-[#112613]/80 rounded-sm px-4 py-3 text-[#112613] font-mono outline-none focus:bg-[#112613]/5 transition-colors placeholder:text-[#112613]/30"
                placeholder="estudiante@eafit.edu.co"
              />
            </div>

            {/* Input: Contraseña */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label htmlFor="password" className="text-xs font-mono tracking-widest text-[#112613] font-bold">
                  &gt; [ CLAVE ACCESO ]
                </label>
                <Link to="/recover" className="text-[10px] font-mono underline hover:text-amber-600 transition-colors text-[#112613]/70">
                  ¿Olvidaste tu llave? Recuperar acceso.
                </Link>
              </div>
              <input 
                type="password" 
                id="password" 
                className="w-full bg-transparent border-2 border-[#112613]/80 rounded-sm px-4 py-3 text-[#112613] font-mono outline-none focus:bg-[#112613]/5 transition-colors placeholder:text-[#112613]/30"
                placeholder="********"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="mt-6 w-full bg-[#112613] text-[#F9F6F0] font-mono font-bold uppercase tracking-wider py-4 rounded-sm transition-all duration-200 border-l-[6px] border-transparent hover:bg-black hover:border-amber-500 hover:text-amber-500"
            >
              Entrar a la madriguera
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

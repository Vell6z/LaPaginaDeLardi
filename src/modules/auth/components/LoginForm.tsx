import React from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
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
  );
}

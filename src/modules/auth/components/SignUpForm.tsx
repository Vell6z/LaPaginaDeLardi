import React, { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Squirrel } from "lucide-react";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 5) return 1;
    if (password.length < 8) return 2;
    if (password.match(/[0-9]/) && password.match(/[^A-Za-z0-9]/)) return 4;
    return 3;
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.toLowerCase().includes("@eafit")) {
      setErrorMsg("Próximamente llegaremos a tu campus");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 500);
      return;
    }
    
    if (!name || !password) {
      setErrorMsg("Por favor, completa todos los campos requeridos");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 500);
      return;
    }

    setErrorMsg("");
    setStatus("success");
  };

  return (
    <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center text-center p-8 bg-moss-500/10 border border-moss-500/20 rounded-md"
          >
            <div className="w-16 h-16 rounded-full bg-moss-500 flex items-center justify-center mb-6 text-white shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-sans font-bold text-[#112613] mb-4">
              Ingresa tu código de autenticación
            </h2>
            <p className="text-[#112613]/80 font-body mb-8">
              A tu correo te enviamos un código de autenticación, ingrésalo para comenzar a aprovechar a LardIA
            </p>
            <input 
              type="text" 
              className="w-full bg-white border-2 border-acorn-700/30 rounded-sm px-4 py-3 text-[#112613] font-body text-center tracking-[0.5em] text-xl font-bold outline-none focus:border-[#112613] transition-colors mb-6"
              placeholder="000000"
              maxLength={6}
            />
            <Link 
              to="/login"
              className="w-full bg-[#112613] text-[#F9F6F0] text-center font-sans font-bold py-4 rounded-sm hover:-translate-y-0.5 transition-transform"
            >
              Verificar
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={status === "error" ? { opacity: 1, x: [-10, 10, -10, 10, 0] } : { opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={status === "error" ? { duration: 0.4 } : { duration: 0.3 }}
          >
            <div className="mb-10 lg:hidden flex items-center gap-2 text-[#112613] font-sans font-bold text-2xl tracking-tight">
              <Squirrel className="w-8 h-8 text-moss-600" />
              <span>LaPaginaDeLardi</span>
            </div>

            <h2 className="text-3xl font-sans font-bold text-[#112613] mb-8">
              Crear cuenta
            </h2>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-sm border border-red-200 text-sm font-medium">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>{errorMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              
              {/* Input: Nombre */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-mono uppercase tracking-widest text-[#112613] font-semibold">
                  Nombre
                </label>
                <input 
                  type="text" 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-2 border-acorn-700/30 rounded-sm px-4 py-3 text-[#112613] font-body outline-none focus:border-[#112613] transition-colors"
                  placeholder="Lardi llita Perez"
                />
              </div>

              {/* Input: Correo */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-[#112613] font-semibold">
                  Correo Universitario
                </label>
                <input 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-2 border-acorn-700/30 rounded-sm px-4 py-3 text-[#112613] font-body outline-none focus:border-[#112613] transition-colors"
                  placeholder="lardi@eafit.edu.co"
                />
                <span className="text-xs text-acorn-600 font-medium mt-1">
                  Usa tu correo institucional para conectarte con el campus.
                </span>
              </div>

              {/* Input: Contraseña */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-xs font-mono uppercase tracking-widest text-[#112613] font-semibold">
                  Contraseña
                </label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-2 border-acorn-700/30 rounded-sm px-4 py-3 text-[#112613] font-body outline-none focus:border-[#112613] transition-colors"
                  placeholder="••••••••"
                />
                
                {/* Password Strength Bar */}
                <div className="flex gap-1 h-1.5 mt-2">
                  <div className={`flex-1 rounded-sm transition-colors duration-300 ${strength >= 1 ? 'bg-red-500' : 'bg-acorn-300'}`}></div>
                  <div className={`flex-1 rounded-sm transition-colors duration-300 ${strength >= 2 ? 'bg-amber-400' : 'bg-acorn-300'}`}></div>
                  <div className={`flex-1 rounded-sm transition-colors duration-300 ${strength >= 3 ? 'bg-moss-500' : 'bg-acorn-300'}`}></div>
                  <div className={`flex-1 rounded-sm transition-colors duration-300 ${strength >= 4 ? 'bg-green-400' : 'bg-acorn-300'}`}></div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="mt-4 w-full bg-[#112613] text-[#F9F6F0] font-sans font-bold py-4 rounded-sm transition-all duration-200 border-b-[4px] border-transparent hover:border-amber-500 hover:-translate-y-0.5 active:translate-y-0 active:border-transparent flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 group-hover:animate-pulse">Crear mi cuenta</span>
                <div className="absolute inset-0 bg-[#F9F6F0]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

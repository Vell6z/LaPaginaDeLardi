import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Mail } from "lucide-react";

export function RecoverForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStatus("success");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center relative z-10">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center py-8"
          >
            <div className="mb-8 text-moss-600">
              <Mail className="w-16 h-16" strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-serif text-[#112613] mb-4">
              Instrucciones enviadas.
            </h2>
            <p className="text-[#112613]/70 font-body mb-12 leading-relaxed">
              Revisa tu bandeja de entrada (y tu carpeta de spam). Hemos enviado una instrucción cifrada para restablecer tu llave.
            </p>
            <Link 
              to="/login"
              className="bg-[#112613] text-[#F9F6F0] font-sans font-medium px-8 py-3 rounded-sm hover:-translate-y-0.5 hover:shadow-[0_4px_14px_0_rgba(17,38,19,0.39)] transition-all duration-200"
            >
              Volver a la madriguera
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl font-serif text-[#112613] mb-6 tracking-tight">
              Recuperar el acceso
            </h2>
            <p className="text-[#112613]/70 font-body mb-10 leading-relaxed">
              No te preocupes, ocurre en las mejores madrigueras. Ingresa tu correo institucional y te enviaremos una instrucción cifrada para restablecer tu llave.
            </p>

            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              
              {/* Underline Input: Correo */}
              <div className="flex flex-col gap-2 relative group">
                <input 
                  type="email" 
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-[#112613]/20 py-3 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                  placeholder="Correo Institucional"
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 top-3 text-[#112613]/50 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-moss-600 peer-valid:-top-4 peer-valid:text-xs peer-valid:text-moss-600"
                >
                  Correo Institucional
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-moss-600 transition-all duration-300 peer-focus:w-full"></div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="mt-6 w-full bg-[#112613] text-[#F9F6F0] font-sans font-medium py-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] hover:shadow-[2px_2px_0px_0px_rgba(245,158,11,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
              >
                Enviar instrucciones
              </button>

              <div className="mt-8 flex justify-center">
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-[#112613]/50 hover:text-[#112613] text-sm transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Prefiero intentar iniciar sesión de nuevo
                </Link>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

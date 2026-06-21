import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CheckCircle2, Loader2, KeyRound } from "lucide-react";

export function RecoverForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [status, setStatus] = useState<"idle" | "verify" | "success">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getPasswordStrength = () => {
    if (newPassword.length === 0) return 0;
    if (newPassword.length < 5) return 1;
    if (newPassword.length < 8) return 2;
    if (newPassword.match(/[0-9]/) && newPassword.match(/[^A-Za-z0-9]/)) return 4;
    return 3;
  };

  const strength = getPasswordStrength();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setErrorMsg(data.message || "Error al enviar la solicitud");
        return;
      }
      
      setStatus("verify");
    } catch (error) {
      setErrorMsg("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || !newPassword) {
      setErrorMsg("Completa el código de 6 dígitos y tu nueva contraseña");
      return;
    }

    if (strength < 2) {
      setErrorMsg("La contraseña es demasiado débil");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setErrorMsg(data.message || "Error al cambiar la contraseña");
        return;
      }
      
      setStatus("success");
    } catch (error) {
      setErrorMsg("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
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
              <CheckCircle2 className="w-16 h-16" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-serif text-[#112613] mb-4">
              Llave restaurada.
            </h2>
            <p className="text-[#112613]/70 font-body mb-12 leading-relaxed">
              Tu contraseña ha sido actualizada con éxito. Ya puedes volver a entrar a la madriguera con tu nueva llave.
            </p>
            <Link 
              to="/login"
              className="bg-[#112613] text-[#F9F6F0] font-sans font-medium px-8 py-3 rounded-sm hover:-translate-y-0.5 hover:shadow-[0_4px_14px_0_rgba(17,38,19,0.39)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Iniciar sesión
            </Link>
          </motion.div>
        ) : status === "verify" ? (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl font-serif text-[#112613] mb-6 tracking-tight flex items-center gap-3">
              <KeyRound className="w-8 h-8 text-moss-600" />
              Ingresa el código
            </h2>
            <p className="text-[#112613]/70 font-body mb-6 leading-relaxed">
              Enviamos un código de 6 dígitos a <strong>{email}</strong>. Ingrésalo abajo junto con tu nueva contraseña.
            </p>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-sm border border-red-200 text-sm font-medium mb-6">
                {errorMsg}
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleResetPassword}>
              
              <div className="flex flex-col gap-2 relative group">
                <input 
                  type="text" 
                  id="code"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-transparent border-b border-[#112613]/20 py-3 text-[#112613] font-mono tracking-[0.5em] text-center text-xl outline-none transition-colors peer placeholder-transparent"
                  placeholder="000000"
                />
                <label 
                  htmlFor="code" 
                  className="absolute left-0 top-3 text-[#112613]/50 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-moss-600 peer-valid:-top-4 peer-valid:text-xs peer-valid:text-moss-600"
                >
                  Código de 6 dígitos
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-moss-600 transition-all duration-300 peer-focus:w-full"></div>
              </div>

              <div className="flex flex-col gap-2 relative group mt-4">
                <input 
                  type="password" 
                  id="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-[#112613]/20 py-3 text-[#112613] font-body outline-none transition-colors peer placeholder-transparent"
                  placeholder="Nueva Contraseña"
                />
                <label 
                  htmlFor="newPassword" 
                  className="absolute left-0 top-3 text-[#112613]/50 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-moss-600 peer-valid:-top-4 peer-valid:text-xs peer-valid:text-moss-600"
                >
                  Nueva Contraseña
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-moss-600 transition-all duration-300 peer-focus:w-full"></div>
              </div>

              {/* Password Strength Bar */}
              <div className="flex gap-1 h-1.5 mt-[-10px] mb-2">
                <div className={`flex-1 rounded-sm transition-colors duration-300 ${strength >= 1 ? 'bg-red-500' : 'bg-acorn-300'}`}></div>
                <div className={`flex-1 rounded-sm transition-colors duration-300 ${strength >= 2 ? 'bg-amber-400' : 'bg-acorn-300'}`}></div>
                <div className={`flex-1 rounded-sm transition-colors duration-300 ${strength >= 3 ? 'bg-moss-500' : 'bg-acorn-300'}`}></div>
                <div className={`flex-1 rounded-sm transition-colors duration-300 ${strength >= 4 ? 'bg-green-400' : 'bg-acorn-300'}`}></div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="mt-6 w-full bg-[#112613] text-[#F9F6F0] font-sans font-medium py-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] hover:shadow-[2px_2px_0px_0px_rgba(245,158,11,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Actualizando...
                  </>
                ) : "Guardar nueva contraseña"}
              </button>
            </form>
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
              No te preocupes, ocurre en las mejores madrigueras. Ingresa tu correo institucional y te enviaremos una instrucción para restablecer tu llave.
            </p>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-sm border border-red-200 text-sm font-medium mb-6">
                {errorMsg}
              </div>
            )}

            <form className="flex flex-col gap-8" onSubmit={handleSendCode}>
              
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

              <button 
                type="submit" 
                disabled={isLoading}
                className="mt-2 w-full bg-[#112613] text-[#F9F6F0] font-sans font-medium py-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] hover:shadow-[2px_2px_0px_0px_rgba(245,158,11,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex justify-center gap-2 items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando código...
                  </>
                ) : "Enviar instrucciones"}
              </button>

              <div className="mt-4 flex justify-center">
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

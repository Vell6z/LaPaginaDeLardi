import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Squirrel } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
export function SignUpForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success" | "verified">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "verified" && redirectCountdown > 0) {
      timer = setTimeout(() => setRedirectCountdown(redirectCountdown - 1), 1000);
    } else if (status === "verified" && redirectCountdown === 0) {
      navigate("/login");
    }
    return () => clearTimeout(timer);
  }, [status, redirectCountdown, navigate]);

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 5) return 1;
    if (password.length < 8) return 2;
    if (password.match(/[0-9]/) && password.match(/[^A-Za-z0-9]/)) return 4;
    return 3;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !password || !email) {
      setErrorMsg("Por favor, completa todos los campos requeridos");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 500);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit', // No need for cookies on register
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Error al registrar el usuario');
        setStatus("error");
        setTimeout(() => setStatus("idle"), 500);
        return;
      }

      setErrorMsg("");
      setStatus("success");
      setCooldown(60); // Start 60s cooldown for resend
    } catch (error) {
      setErrorMsg("Error de conexión con el servidor");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setErrorMsg("El código debe tener 6 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit', // They log in automatically via cookie returned, but don't need to send one
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Código inválido');
        return;
      }

      setStatus("verified");
    } catch (error) {
      setErrorMsg("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.message || 'Error al reenviar código');
        return;
      }

      setCooldown(60);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center relative">
      <AnimatePresence mode="wait">
        {status === "verified" ? (
          <motion.div 
            key="verified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center text-center p-8 bg-moss-500/10 border border-moss-500/20 rounded-md"
          >
            <div className="w-16 h-16 rounded-full bg-moss-500 flex items-center justify-center mb-6 text-white shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-sans font-bold text-[#112613] mb-4">
              ¡Gracias por verificarte!
            </h2>
            <p className="text-[#112613]/80 font-body mb-4">
              Tu cuenta ha sido confirmada exitosamente. Serás redirigido al inicio de sesión en <span className="font-bold text-moss-600">{redirectCountdown}</span> segundos...
            </p>
          </motion.div>
        ) : status === "success" ? (
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
            <p className="text-[#112613]/80 font-body mb-4">
              A tu correo te enviamos un código de autenticación, ingrésalo para comenzar a aprovechar a LardIA
            </p>
            
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-sm border border-red-200 text-sm font-medium w-full mb-4">
                {errorMsg}
              </div>
            )}

            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-white border-2 border-acorn-700/30 rounded-sm px-4 py-3 text-[#112613] font-body text-center tracking-[0.5em] text-xl font-bold outline-none focus:border-[#112613] transition-colors mb-6"
              placeholder="000000"
              maxLength={6}
            />
            <button 
              onClick={handleVerify}
              disabled={isLoading || code.length !== 6}
              className="w-full bg-[#112613] text-[#F9F6F0] text-center font-sans font-bold py-4 rounded-sm hover:-translate-y-0.5 transition-transform mb-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : "Verificar"}
            </button>
            <button 
              onClick={handleResend}
              disabled={cooldown > 0}
              className="text-sm font-mono text-acorn-600 hover:text-moss-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cooldown > 0 ? `Reenviar código en ${cooldown}s` : "¿No recibiste el código? Reenviar"}
            </button>
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
                disabled={isLoading}
                className="mt-4 w-full bg-[#112613] text-[#F9F6F0] font-sans font-bold py-4 rounded-sm transition-all duration-200 border-b-[4px] border-transparent hover:border-amber-500 hover:-translate-y-0.5 active:translate-y-0 active:border-transparent flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-transparent"
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:animate-pulse">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : "Crear mi cuenta"}
                </span>
                <div className="absolute inset-0 bg-[#F9F6F0]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Error al iniciar sesión');
        return;
      }

      localStorage.setItem('lardi_user', JSON.stringify(data.user));
      
      // Añadir un pequeño retraso para que se vea la animación de carga y no sea "de golpe"
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleLogin}>
      
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-sm border border-red-200 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Input: Correo */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-mono tracking-widest text-[#112613] font-bold">
          &gt; [ IDENTIFICACIÓN ]
        </label>
        <input 
          type="email" 
          id="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-2 border-[#112613]/80 rounded-sm px-4 py-3 text-[#112613] font-mono outline-none focus:bg-[#112613]/5 transition-colors placeholder:text-[#112613]/30"
          placeholder="********"
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="mt-6 w-full bg-[#112613] text-[#F9F6F0] font-mono font-bold uppercase tracking-wider py-4 rounded-sm transition-all duration-200 border-l-[6px] border-transparent hover:bg-black hover:border-amber-500 hover:text-amber-500 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#112613] disabled:hover:border-transparent disabled:hover:text-[#F9F6F0]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            CONECTANDO...
          </>
        ) : "Entrar a la madriguera"}
      </button>

    </form>
  );
}

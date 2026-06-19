import { Squirrel, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full bg-[#112613] text-[#F9F6F0] pt-16 pb-8 px-6 border-t border-[#F9F6F0]/10 font-body">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Main Footer Content - 3 Columns */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-sans font-bold text-xl tracking-tight mb-4 text-[#F9F6F0]">
              <Squirrel className="w-7 h-7" />
              <span>LaPáginadeLardi</span>
            </div>
            <p className="text-[#F9F6F0]/70 leading-relaxed max-w-sm text-sm">
              Estructurando el caos universitario. Herramientas de aprendizaje Top-Down impulsadas por IA y la paciencia de una ardilla.
            </p>
          </div>

          {/* Support */}
          <div className="flex flex-col">
            <h3 className="font-sans font-semibold text-lg mb-4 text-[#F9F6F0]">Soporte</h3>
            <ul className="flex flex-col gap-3 text-sm text-[#F9F6F0]/70">
              <li>
                <Link to="/faq" className="hover:text-[#F2F4EB] hover:underline underline-offset-4 decoration-1 transition-all">Preguntas Frecuentes</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#F2F4EB] hover:underline underline-offset-4 decoration-1 transition-all">Privacidad y Seguridad</Link>
              </li>
              <li>
                <a href="mailto:lapaginadelardi@gmail.com" className="hover:text-[#F2F4EB] hover:underline underline-offset-4 decoration-1 transition-all">Contacto</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#F9F6F0]/10 text-xs text-[#F9F6F0]/50">
          <p>© 2026 La Página de Lardi. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-2">
            <span>Hecho con ☕ y bellotas en Medellín.</span>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="text-[#F9F6F0]/70 hover:text-[#F9F6F0] transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

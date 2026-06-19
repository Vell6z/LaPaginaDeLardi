import { Link, useLocation } from "react-router-dom";
import { 
  Squirrel, Home, Library, Calendar, 
  ChevronLeft, ChevronRight, Brain
} from "lucide-react";
import React, { useState } from "react";

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <aside className={`flex-shrink-0 h-full bg-[#112613] text-[#F9F6F0] flex flex-col justify-between py-8 transition-all duration-300 z-20 relative ${isSidebarOpen ? 'w-64 px-6' : 'w-20 px-4'}`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute -right-3 top-8 bg-moss-600 hover:bg-moss-500 text-white rounded-full p-1 shadow-md transition-colors z-30"
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div className="flex flex-col gap-10 border-b border-transparent">
        {/* Logo */}
        <Link to="/dashboard" className={`flex items-center gap-3 ${isSidebarOpen ? 'justify-start px-2' : 'justify-center'} transition-all`}>
          <Squirrel className="w-8 h-8 text-moss-400 shrink-0" />
          {isSidebarOpen && <span className="font-sans font-bold text-xl tracking-tight text-[#F9F6F0]">LardIA.</span>}
        </Link>
        
        {/* Nav Links */}
        <nav className="flex flex-col gap-2">
          <NavItem to="/dashboard" icon={<Home className="w-5 h-5" />} label="Inicio" isSidebarOpen={isSidebarOpen} active={location.pathname === '/dashboard'} />
          <NavItem to="/materias" icon={<Library className="w-5 h-5" />} label="Mis Materias" isSidebarOpen={isSidebarOpen} active={location.pathname === '/materias'} />
          <NavItem to="/calendario" icon={<Calendar className="w-5 h-5" />} label="Calendario" isSidebarOpen={isSidebarOpen} active={location.pathname === '/calendario'} />
          <NavItem to="/repaso" icon={<Brain className="w-5 h-5" />} label="Repaso Activo" isSidebarOpen={isSidebarOpen} active={location.pathname === '/repaso'} />
        </nav>
      </div>

      {/* User Profile */}
      <Link 
        to="/ajustes" 
        className={`flex items-center gap-3 ${isSidebarOpen ? 'justify-start px-2' : 'justify-center'} border-t border-[#F9F6F0]/10 pt-6 transition-all hover:opacity-80`}
      >
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-moss-700 flex items-center justify-center border-2 border-[#112613]">
            <span className="font-bold text-sm">JP</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#112613]"></div>
        </div>
        {isSidebarOpen && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate leading-tight">Juan Pérez</p>
          </div>
        )}
      </Link>
    </aside>
  );
}

// Sidebar Nav Item Helper
function NavItem({ to, icon, label, active = false, isSidebarOpen = false }: { to: string, icon: React.ReactNode, label: string, active?: boolean, isSidebarOpen?: boolean }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 group ${
        active 
          ? "bg-white/10 text-[#F9F6F0] font-bold" 
          : "text-[#F9F6F0]/60 hover:bg-white/5 hover:text-[#F9F6F0] font-medium"
      }`}
    >
      <div className={`${active ? "text-moss-400" : "text-[#F9F6F0]/60 group-hover:text-moss-400"} transition-colors shrink-0`}>
        {icon}
      </div>
      {isSidebarOpen && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );
}

import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { 
  Search, ChevronDown, Calendar, FileText, 
  Code, FileAudio, Download, ExternalLink, 
  Share2, Squirrel, File
} from "lucide-react";

const mockFiles = [
  { id: 1, title: "Límites y Continuidad", subject: "Cálculo Integral", date: "2025-10-12", format: "text", type: "Clase", semester: "3er Semestre" },
  { id: 2, title: "Proyecto: Árboles Binarios", subject: "Estructura de Datos", date: "2025-11-05", format: "code", type: "Proyecto", semester: "3er Semestre" },
  { id: 3, title: "Transcripción: Leyes de Newton", subject: "Física Mecánica", date: "2025-09-20", format: "audio", type: "Clase", semester: "3er Semestre" },
  { id: 4, title: "Taller de Derivadas", subject: "Cálculo Integral", date: "2025-10-25", format: "file", type: "Taller", semester: "3er Semestre" },
  { id: 5, title: "Parcial 1 - POO", subject: "Programación II", date: "2026-03-10", format: "text", type: "Parcial", semester: "4to Semestre" },
];

export function ArchivePage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFiles = mockFiles.filter(file => 
    file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'code': return <Code className="w-5 h-5 text-emerald-500" />;
      case 'audio': return <FileAudio className="w-5 h-5 text-amber-500" />;
      case 'text': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'file':
      default: return <File className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative selection:bg-moss-200">
      <Sidebar />

      <main className="flex-1 h-full flex overflow-hidden">
        
        {/* Left Filter Sidebar */}
        <aside className="w-64 border-r border-acorn-400/20 bg-[#F9F6F0]/50 h-full p-6 flex flex-col hidden md:flex shrink-0 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-xl font-sans font-bold text-[#112613] tracking-tight">Filtros</h2>
            <p className="text-xs font-medium text-acorn-500 mt-1">Refina tu búsqueda</p>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Semestre Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono tracking-widest uppercase font-bold text-[#112613]/50">Semestre</label>
              <div className="relative group">
                <select className="w-full appearance-none bg-white border border-acorn-400/20 rounded-lg px-3 py-2 text-sm text-[#112613] font-medium outline-none focus:border-moss-500 transition-colors shadow-sm cursor-pointer">
                  <option>Todos los semestres</option>
                  <option>4to Semestre (Actual)</option>
                  <option>3er Semestre</option>
                  <option>2do Semestre</option>
                  <option>1er Semestre</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-acorn-400 pointer-events-none group-focus-within:text-moss-500" />
              </div>
            </div>

            {/* Materia Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono tracking-widest uppercase font-bold text-[#112613]/50">Materia</label>
              <div className="relative group">
                <select className="w-full appearance-none bg-white border border-acorn-400/20 rounded-lg px-3 py-2 text-sm text-[#112613] font-medium outline-none focus:border-moss-500 transition-colors shadow-sm cursor-pointer">
                  <option>Todas las materias</option>
                  <option>Cálculo Integral</option>
                  <option>Estructura de Datos</option>
                  <option>Programación II</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-acorn-400 pointer-events-none group-focus-within:text-moss-500" />
              </div>
            </div>

            {/* Tipo de Documento Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono tracking-widest uppercase font-bold text-[#112613]/50">Tipo de Documento</label>
              <div className="relative group">
                <select className="w-full appearance-none bg-white border border-acorn-400/20 rounded-lg px-3 py-2 text-sm text-[#112613] font-medium outline-none focus:border-moss-500 transition-colors shadow-sm cursor-pointer">
                  <option>Todos los tipos</option>
                  <option>Clase</option>
                  <option>Parcial</option>
                  <option>Taller</option>
                  <option>Proyecto</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-acorn-400 pointer-events-none group-focus-within:text-moss-500" />
              </div>
            </div>

            <div className="h-px w-full bg-acorn-400/20 my-2"></div>

            {/* Rango de Fechas */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono tracking-widest uppercase font-bold text-[#112613]/50">Rango de fechas</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input type="date" className="w-full bg-white border border-acorn-400/20 rounded-lg pl-8 pr-2 py-2 text-xs text-[#112613] outline-none focus:border-moss-500 transition-colors shadow-sm" />
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-acorn-400" />
                </div>
                <span className="text-acorn-400">-</span>
                <div className="relative flex-1">
                  <input type="date" className="w-full bg-white border border-acorn-400/20 rounded-lg pl-8 pr-2 py-2 text-xs text-[#112613] outline-none focus:border-moss-500 transition-colors shadow-sm" />
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-acorn-400" />
                </div>
              </div>
            </div>

          </div>

          {/* Lardi Inform Generate Button */}
          <div className="mt-auto pt-8">
            <button className="w-full flex items-center justify-center gap-2 bg-moss-50 hover:bg-moss-100 border border-moss-200 text-moss-800 py-3 rounded-lg font-bold text-xs transition-colors shadow-sm group">
              <Squirrel className="w-4 h-4 text-moss-600 group-hover:scale-110 transition-transform" />
              Generar Informe Semestral
            </button>
            <p className="text-[10px] text-center text-acorn-500 mt-2 font-medium">Lardi compilará un documento con tus apuntes clave.</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 h-full p-6 md:p-10 flex flex-col min-w-0 overflow-y-auto">
          
          <header className="mb-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-sans font-bold tracking-tight text-[#112613]">Archivo Digital</h1>
            </div>
            
            {/* Global Search */}
            <div className="relative max-w-3xl">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca en tus semestres pasados..."
                className="w-full bg-white border-2 border-acorn-400/10 rounded-xl pl-12 pr-4 py-4 text-lg text-[#112613] outline-none focus:border-moss-500 transition-all shadow-sm placeholder-acorn-400 font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-acorn-400 pointer-events-none" />
            </div>
          </header>

          {/* Files Table */}
          <div className="flex-1 bg-white rounded-xl border border-acorn-400/20 shadow-sm overflow-hidden flex flex-col">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-acorn-400/20 bg-[#F9F6F0]/30 text-xs font-mono font-bold uppercase tracking-widest text-acorn-500">
              <div className="col-span-6 md:col-span-5">Nombre del Apunte</div>
              <div className="col-span-3 hidden md:block">Materia</div>
              <div className="col-span-4 md:col-span-2">Fecha</div>
              <div className="col-span-2 md:col-span-2 text-right">Acciones</div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto">
              {filteredFiles.length > 0 ? (
                <div className="flex flex-col">
                  {filteredFiles.map((file) => (
                    <div 
                      key={file.id} 
                      className="grid grid-cols-12 gap-4 p-4 border-b border-acorn-400/10 hover:bg-acorn-50/50 transition-colors items-center group cursor-pointer"
                    >
                      {/* Name & Format */}
                      <div className="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-white border border-acorn-400/10 rounded-md shadow-sm shrink-0">
                          {getFormatIcon(file.format)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-sans font-bold text-sm text-[#112613] truncate group-hover:text-moss-700 transition-colors">
                            {file.title}
                          </h3>
                          <span className="inline-block mt-0.5 text-[10px] uppercase font-mono font-bold tracking-wider text-acorn-500 bg-acorn-100 px-1.5 py-0.5 rounded-sm">
                            {file.type}
                          </span>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="col-span-3 hidden md:flex items-center min-w-0">
                        <span className="text-sm font-medium text-acorn-600 truncate">
                          {file.subject}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="col-span-4 md:col-span-2 flex items-center">
                        <span className="text-sm font-mono text-acorn-600">
                          {file.date}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-acorn-400 hover:text-[#112613] hover:bg-black/5 rounded-md transition-colors" title="Abrir">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-acorn-400 hover:text-[#112613] hover:bg-black/5 rounded-md transition-colors" title="Descargar">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-acorn-400 hover:text-[#112613] hover:bg-black/5 rounded-md transition-colors" title="Compartir">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                /* Empty / No Results State */
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 mb-6 opacity-80 flex items-center justify-center bg-moss-50 rounded-full">
                     <Squirrel className="w-12 h-12 text-moss-400" />
                  </div>
                  <h3 className="text-lg font-bold text-[#112613] mb-2 font-sans">No se encontraron archivos</h3>
                  <p className="text-sm text-acorn-500 max-w-sm font-medium">
                    Tu historia académica se está construyendo aquí. Intenta ajustar los filtros o los términos de búsqueda.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

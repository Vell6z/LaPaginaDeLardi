import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { 
  ChevronLeft, Play, Pause, Squirrel, FilePlus, Mic, Video, FileAudio
} from "lucide-react";
import { motion } from "motion/react";

// Mock data
const mockSessions = [
  { id: 1, title: "Clase 04: Árboles Binarios", date: "2026-03-10", time: "10:00 AM", status: "IA Procesado", type: "Clase", duration: "1h 20m", isHighlighted: false },
  { id: 2, title: "Clase 05: Árboles AVL", date: "2026-03-12", time: "10:00 AM", status: "Transcrito", type: "Clase", duration: "1h 15m", isHighlighted: false },
];

export function ClassDetailPage() {
  const { id, claseId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  // Use a hardcoded session if not found in mock
  const session = mockSessions.find(s => s.id === Number(claseId)) || mockSessions[0];

  const subjectData = {
    id: id,
    name: "Estructura de Datos", // mock
    color: "bg-purple-500",
    textColor: "text-purple-500",
    lightBg: "bg-purple-50",
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative selection:bg-moss-200">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="shrink-0 z-10 bg-white border-b border-acorn-400/20">
          <div className={`h-2 w-full ${subjectData.color}`}></div>
          <div className="px-6 py-6 lg:px-10 flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 text-acorn-400 hover:text-[#112613] hover:bg-black/5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-[#112613] line-clamp-1">
                {session?.title || "Detalle de Clase"}
              </h1>
              <p className="text-sm font-medium text-acorn-500 mt-1">
                {session?.date} • {session?.time}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-[1600px] mx-auto w-full p-6 md:p-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column: Input / Recording / Material */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              {/* Audio Player Header */}
              <div className={`p-8 rounded-2xl border border-acorn-400/20 shadow-sm ${subjectData.lightBg} relative overflow-hidden`}>
                <div className="absolute top-6 right-6 flex items-center gap-3">
                  {isPlaying && (
                    <div className="flex gap-1 h-4 items-end">
                      <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className={`w-1 ${subjectData.color} rounded-t-sm`}></motion.div>
                      <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className={`w-1 ${subjectData.color} rounded-t-sm`}></motion.div>
                      <motion.div animate={{ height: [4, 14, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className={`w-1 ${subjectData.color} rounded-t-sm`}></motion.div>
                    </div>
                  )}
                  <Squirrel className={`w-10 h-10 ${subjectData.textColor} drop-shadow-sm ${isPlaying ? 'scale-110 shadow-lg' : ''} transition-all duration-300 bg-white p-1.5 rounded-full border border-current`} strokeWidth={1.5} />
                </div>

                <h2 className="text-xl md:text-2xl font-bold font-sans text-[#112613] mb-6 pr-20 leading-tight">
                  Grabación de la sesión
                </h2>
                
                {/* Elegant Audio Controller */}
                <div className="flex items-center gap-4 bg-white/70 p-3 rounded-xl border border-white/60 shadow-sm backdrop-blur-sm w-full">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${subjectData.color} shadow-sm active:scale-95 transition-transform shrink-0`}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </button>
                  <div className="flex-1 h-3 bg-black/5 rounded-full overflow-hidden cursor-pointer relative">
                    <div className={`h-full ${subjectData.color} rounded-full absolute left-0 top-0 w-1/3`}></div>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#112613]/60 w-12 text-right">14:05</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-start gap-4 p-5 bg-white hover:bg-moss-50 border border-acorn-300/40 hover:border-moss-300 rounded-xl transition-all shadow-sm group">
                  <FilePlus className="w-6 h-6 text-acorn-500 group-hover:text-moss-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-sm font-bold text-[#112613]">Agregar Material</span>
                    <span className="block text-xs font-medium text-acorn-500">Sube PDFs o imágenes</span>
                  </div>
                </button>
                <button className="flex items-center justify-start gap-4 p-5 bg-white hover:bg-rose-50 border border-acorn-300/40 hover:border-rose-300 rounded-xl transition-all shadow-sm group">
                  <Mic className="w-6 h-6 text-acorn-500 group-hover:text-rose-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-sm font-bold text-[#112613]">Grabar Sonido</span>
                    <span className="block text-xs font-medium text-acorn-500">Inicia una nueva grabación</span>
                  </div>
                </button>
                <button className="flex items-center justify-start gap-4 p-5 bg-white hover:bg-blue-50 border border-acorn-300/40 hover:border-blue-300 rounded-xl transition-all shadow-sm group">
                  <Video className="w-6 h-6 text-acorn-500 group-hover:text-blue-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-sm font-bold text-[#112613]">Grabar Video</span>
                    <span className="block text-xs font-medium text-acorn-500">Captura la pantalla o cámara</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Column: AI Output */}
            <div className="xl:col-span-8 flex flex-col max-w-4xl w-full">
              {/* Document Metatags */}
              <div className="flex items-center flex-wrap gap-3 mb-6">
                  <span className="flex items-center gap-1.5 text-sm font-mono font-bold text-acorn-600 bg-white px-3 py-1.5 rounded-md border border-acorn-200 shadow-sm">
                    <FileAudio className="w-4 h-4" /> Transcripción Generada
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-mono font-bold text-acorn-600 bg-white px-3 py-1.5 rounded-md border border-acorn-200 shadow-sm">
                    Editado hace 2h
                  </span>
              </div>

              <div className="bg-white rounded-2xl border border-acorn-400/20 shadow-sm p-8 md:p-12 prose prose-base md:prose-lg prose-green max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:text-[#112613] prose-p:font-body prose-p:text-acorn-700 prose-p:leading-relaxed">
                <h3>Definición Geométrica</h3>
                <p>
                  El área bajo la curva f(x) en un intervalo [a, b] puede aproximarse dibujando rectángulos. 
                  La precisión mejora a medida que el ancho de estos rectángulos se acerca a cero.
                </p>
                
                <div className={`my-8 border-l-4 ${subjectData.color} border-l-current pl-6 py-4 bg-acorn-50/50 rounded-r-lg`}>
                  <span className={`text-[11px] font-mono tracking-widest uppercase font-bold ${subjectData.textColor} mb-3 block flex items-center gap-2`}>
                    <Squirrel className="w-4 h-4" /> 
                    Concepto Clave Lardi
                  </span>
                  <p className="m-0 font-medium text-[#112613]">
                    La integral definida es básicamente el límite de una Suma de Riemann cuando el número de subintervalos tiende a infinito. Sirve para acumular cantidades continuas.
                  </p>
                </div>
                
                <h3>Propiedades</h3>
                <ul>
                  <li>La integral de una suma es la suma de las integrales.</li>
                  <li>Las constantes se pueden "sacar" de la integral.</li>
                  <li>Invertir los límites de integración cambia el signo del resultado.</li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

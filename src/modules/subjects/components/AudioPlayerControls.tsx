import React, { useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, Squirrel, FilePlus, Mic, Video } from "lucide-react";

export function AudioPlayerControls({ subjectData }: { subjectData: any }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col gap-6">
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
  );
}

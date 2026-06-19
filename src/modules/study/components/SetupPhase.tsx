import React from "react";
import { motion } from "motion/react";
import { X as XIcon, Brain, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SetupPhase({
  subjects,
  methods,
  levels,
  selectedSubject,
  setSelectedSubject,
  selectedMethod,
  setSelectedMethod,
  selectedLevel,
  setSelectedLevel,
  startStudy
}: any) {
  const navigate = useNavigate();
  const subjectInfo = subjects.find((s: any) => s.id === selectedSubject);

  return (
    <motion.div 
      key="setup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full h-full flex flex-col items-center justify-center p-6 lg:p-12"
    >
      <div className="absolute top-8 left-8">
        <button onClick={() => navigate(-1)} className="text-acorn-500 hover:text-[#112613] transition-colors flex items-center gap-2">
          <XIcon className="w-5 h-5" />
          <span className="font-bold">Salir</span>
        </button>
      </div>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <Brain className="w-12 h-12 text-moss-500 mx-auto mb-4" />
          <h1 className="text-4xl font-sans font-bold text-[#112613] mb-3 tracking-tight">Entrenador de Conocimiento</h1>
          <p className="text-acorn-600 font-medium text-lg">Configura tu sesión de enfoque profundo.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Materia Activa</label>
              <div className="relative group">
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full appearance-none bg-white border border-acorn-400/20 rounded-xl px-4 py-4 text-[#112613] font-bold text-lg outline-none focus:border-moss-500 shadow-sm transition-all"
                >
                  {subjects.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-acorn-400 pointer-events-none group-focus-within:text-moss-500" />
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${subjectInfo?.color}`}></div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Nivel de Dificultad</label>
              <div className="bg-white border border-acorn-400/20 rounded-xl p-1.5 flex flex-col sm:flex-row shadow-sm">
                {levels.map((l: any) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLevel(l.id)}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                      selectedLevel === l.id 
                        ? 'bg-[#112613] text-[#F9F6F0] shadow-md' 
                        : 'text-acorn-500 hover:text-[#112613] hover:bg-acorn-50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Método de Estudio</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {methods.map((m: any) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`flex flex-col text-left p-6 rounded-2xl border-2 transition-all ${
                    selectedMethod === m.id 
                      ? 'bg-white border-moss-500 shadow-lg scale-[1.02]' 
                      : 'bg-white border-acorn-400/10 shadow-sm hover:border-acorn-400/30 text-acorn-500 hover:text-[#112613]'
                  }`}
                >
                  <div className={`p-3 rounded-xl inline-flex w-fit mb-4 ${selectedMethod === m.id ? 'bg-moss-100 text-moss-700' : 'bg-acorn-50 text-acorn-400'}`}>
                    {m.icon}
                  </div>
                  <h3 className={`font-sans font-bold text-lg mb-2 ${selectedMethod === m.id ? 'text-[#112613]' : ''}`}>{m.title}</h3>
                  <p className={`text-sm font-medium leading-relaxed ${selectedMethod === m.id ? 'text-acorn-600' : 'text-acorn-400'}`}>{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={startStudy}
            className="bg-[#112613] hover:bg-moss-900 focus:bg-moss-900 text-[#F9F6F0] px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-[6px_6px_0px_0px_rgba(74,103,65,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(74,103,65,0.2)] hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95 active:shadow-none"
          >
            Comenzar Inmersión
          </button>
        </div>

      </div>
    </motion.div>
  );
}

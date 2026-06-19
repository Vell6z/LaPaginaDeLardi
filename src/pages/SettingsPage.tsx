import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { 
  Squirrel, User, Brain, Shield, Palette, Download, Key, Monitor, Moon, Sun, MonitorSmartphone, Settings
} from "lucide-react";
import { motion } from "motion/react";

export function SettingsPage() {
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(true);
  const [summaryMode, setSummaryMode] = useState("Largo");
  const [smartHighlight, setSmartHighlight] = useState(true);
  const [aiTone, setAiTone] = useState("Académico");
  const [themeMode, setThemeMode] = useState("Sistema");
  const [accentColor, setAccentColor] = useState("moss");

  const colors = [
    { id: 'moss', bg: 'bg-moss-500' },
    { id: 'blue', bg: 'bg-blue-500' },
    { id: 'purple', bg: 'bg-purple-500' },
    { id: 'rose', bg: 'bg-rose-500' },
    { id: 'acorn', bg: 'bg-acorn-500' },
  ];

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative selection:bg-moss-200">
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative isolate">
        {/* Lardi Watermark Illustration */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.03] -z-10 w-[500px] h-[500px] flex items-center justify-center">
          <Squirrel className="w-full h-full" />
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10 md:py-16 flex flex-col gap-12">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-moss-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-sans font-bold tracking-tight text-[#112613]">
                El Cuarto de Máquinas
              </h1>
              <p className="text-acorn-600 font-medium mt-1">Configuraciones y Perfil de Usuario</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Tarjeta de Identidad (Perfil) */}
            <section className="bg-white rounded-3xl p-8 border border-acorn-400/20 shadow-sm col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-moss-600" />
                <h2 className="text-xl font-sans font-bold text-[#112613]">Perfil de Usuario</h2>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-moss-100 flex items-center justify-center border-4 border-white shadow-sm shrink-0 text-3xl font-bold text-moss-700">
                  JP
                </div>
                <div className="flex flex-col items-start gap-1">
                  <h3 className="text-2xl font-bold font-sans">Juan Pérez</h3>
                  <p className="text-sm font-medium text-acorn-500">Juane8w@eafit.edu.co</p>
                </div>
              </div>

              <div className="mt-auto pt-6">
                 <button className="px-5 py-2.5 rounded-xl border-2 border-acorn-200 hover:border-moss-400 text-[#112613] font-bold text-sm transition-colors w-full sm:w-auto">
                   Editar Perfil
                 </button>
              </div>
            </section>

            {/* Tarjeta de Almacenamiento y Seguridad */}
            <section className="bg-white rounded-3xl p-8 border border-acorn-400/20 shadow-sm col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-moss-600" />
                <h2 className="text-xl font-sans font-bold text-[#112613]">Almacenamiento y Seguridad</h2>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-[#112613]">Uso de Almacenamiento</span>
                  <span className="text-sm font-medium text-acorn-500">4.2 GB / 10 GB</span>
                </div>
                <div className="h-3 w-full bg-acorn-100 rounded-full overflow-hidden">
                  <div className="h-full bg-moss-500 w-[42%] rounded-full"></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-moss-50 hover:bg-moss-100 text-moss-800 font-bold text-sm transition-colors">
                  <Download className="w-4 h-4" /> Exportar Apuntes
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-rose-100 hover:border-rose-200 text-rose-600 font-bold text-sm transition-colors">
                  <Key className="w-4 h-4" /> Restablecer Clave
                </button>
              </div>
            </section>

            {/* Tarjeta de Preferencias de IA */}
            <section className="bg-white rounded-3xl p-8 border border-acorn-400/20 shadow-sm col-span-1 md:col-span-2 flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-moss-600" />
                <h2 className="text-xl font-sans font-bold text-[#112613]">El Cerebro de Lardi (IA)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                  {/* Toggles */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold block text-[#112613]">Transcripción Automática</span>
                      <span className="text-xs font-medium text-acorn-500">Transcribe audio al subirlo</span>
                    </div>
                    <button 
                      onClick={() => setTranscriptionEnabled(!transcriptionEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${transcriptionEnabled ? 'bg-moss-500' : 'bg-acorn-300'}`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${transcriptionEnabled ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold block text-[#112613]">Resaltado Inteligente</span>
                      <span className="text-xs font-medium text-acorn-500">Destaca conceptos clave automáticamente</span>
                    </div>
                    <button 
                      onClick={() => setSmartHighlight(!smartHighlight)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${smartHighlight ? 'bg-moss-500' : 'bg-acorn-300'}`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${smartHighlight ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                     <label className="text-sm font-bold text-[#112613]">Modo de Resumen</label>
                     <div className="flex bg-acorn-50 rounded-lg p-1 border border-acorn-200">
                        {["Corto", "Medio", "Largo"].map(mode => (
                          <button 
                            key={mode}
                            onClick={() => setSummaryMode(mode)}
                            className={`flex-1 text-sm font-bold py-1.5 rounded-md transition-colors ${summaryMode === mode ? 'bg-white shadow-sm text-moss-700' : 'text-acorn-500 hover:text-[#112613]'}`}
                          >
                            {mode}
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-sm font-bold text-[#112613]">Tono de la IA</label>
                     <select 
                       value={aiTone}
                       onChange={(e) => setAiTone(e.target.value)}
                       className="w-full bg-white border border-acorn-300 rounded-xl px-4 py-2 text-sm text-[#112613] outline-none focus:border-moss-500 font-medium appearance-none"
                     >
                       <option>Académico</option>
                       <option>Sencillo</option>
                       <option>Técnico</option>
                     </select>
                  </div>
                </div>
              </div>
            </section>

            

          </div>

          <footer className="mt-8 text-center pb-8 border-t border-acorn-300/40 pt-8">
            <p className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-400">
              Versión 1.0.0 (Beta) | Universidad EAFIT
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

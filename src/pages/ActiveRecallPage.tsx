import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Layers, Lightbulb, PenTool, Sparkles, 
  ChevronDown, Check, X as XIcon, RotateCcw, 
  Squirrel, Brain, HelpCircle
} from "lucide-react";

const subjects = [
  { id: '1', name: 'Cálculo Integral', color: 'bg-blue-500', text: 'text-blue-500' },
  { id: '2', name: 'Programación II', color: 'bg-emerald-500', text: 'text-emerald-500' },
  { id: '3', name: 'Estructura de Datos', color: 'bg-purple-500', text: 'text-purple-500' },
];

const methods = [
  { id: 'flashcards', title: 'Flashcards', desc: 'Repaso rápido de conceptos clave.', icon: <Layers className="w-6 h-6" /> },
  { id: 'quiz', title: 'Cuestionario Lógico', desc: 'Evalúa tu entendimiento con opciones.', icon: <Lightbulb className="w-6 h-6" /> },
  { id: 'feynman', title: 'Desafío de Explicación', desc: 'Explica con tus palabras (Método Feynman).', icon: <PenTool className="w-6 h-6" /> },
];

const levels = [
  { id: 'basic', label: 'Básico' },
  { id: 'intermediate', label: 'Intermedio' },
  { id: 'advanced', label: 'Ingeniería' },
];

// Mock flashcards
const mockCards = [
  { q: "¿Cuál es la definición geométrica de la integral definida?", a: "Representa el área neta bajo la curva de una función en un intervalo dado [a, b]." },
  { q: "¿Qué establece el Teorema Fundamental del Cálculo?", a: "Conecta la derivación y la integración, estableciendo que son operaciones inversas. Permite evaluar integrales definidas usando antiderivadas." },
  { q: "¿Cuándo usar integración por partes?", a: "Cuando el integrando es un producto de dos funciones no relacionadas, a menudo siguiendo la regla ILATE (Inversas, Logarítmicas, Algebraicas, Trigonométricas, Exponenciales)." }
];

export function ActiveRecallPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'setup' | 'study' | 'complete'>('setup');
  
  // Setup state
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [selectedMethod, setSelectedMethod] = useState('flashcards');
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
  
  // Study state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  const startStudy = () => {
    setStep('study');
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setShowHint(false);
    setMasteredCount(0);
  };

  const handleNext = (mastered: boolean) => {
    if (mastered) {
      setMasteredCount(prev => prev + 1);
    }
    
    if (currentCardIdx < mockCards.length - 1) {
      setCurrentCardIdx(prev => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    } else {
      setStep('complete');
    }
  };

  const subjectInfo = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative selection:bg-moss-200">
      
      <AnimatePresence mode="wait">
        
        {/* ===================== SETUP PHASE ===================== */}
        {step === 'setup' && (
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
                
                {/* Left Column: Subject & Level */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                  {/* Subject Selector */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Materia Activa</label>
                    <div className="relative group">
                      <select 
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full appearance-none bg-white border border-acorn-400/20 rounded-xl px-4 py-4 text-[#112613] font-bold text-lg outline-none focus:border-moss-500 shadow-sm transition-all shadow-sm"
                      >
                        {subjects.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-acorn-400 pointer-events-none group-focus-within:text-moss-500" />
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${subjectInfo?.color}`}></div>
                    </div>
                  </div>

                  {/* Level Selector */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Nivel de Dificultad</label>
                    <div className="bg-white border border-acorn-400/20 rounded-xl p-1.5 flex flex-col sm:flex-row shadow-sm">
                      {levels.map(l => (
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

                {/* Right Column: Methods */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <label className="text-xs font-mono tracking-widest uppercase font-bold text-acorn-500">Método de Estudio</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {methods.map(m => (
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
        )}

        {/* ===================== STUDY PHASE ===================== */}
        {step === 'study' && (
          <motion.div 
            key="study"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col"
          >
            {/* Top Navigation */}
            <header className="fixed top-0 left-0 w-full p-6 flex items-center justify-between z-20 pointer-events-none">
              <div className="pointer-events-auto">
                <button onClick={() => setStep('setup')} className="text-acorn-500 hover:text-[#112613] transition-colors flex items-center gap-2 bg-[#F9F6F0] p-2 rounded-lg">
                  <XIcon className="w-5 h-5" />
                  <span className="font-bold hidden sm:inline">Salir</span>
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="flex-1 max-w-md mx-6 flex flex-col items-center gap-2">
                <div className="w-full h-1.5 bg-acorn-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentCardIdx / mockCards.length) * 100}%` }}
                    className={`h-full ${subjectInfo?.color} rounded-full`}
                  />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-acorn-400">
                  Concepto {currentCardIdx + 1} de {mockCards.length}
                </span>
              </div>

              <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-acorn-400/20 shadow-sm text-sm font-bold text-[#112613]">
                <div className={`w-2 h-2 rounded-full ${subjectInfo?.color}`}></div>
                <span className="hidden sm:inline">{subjectInfo?.name}</span>
              </div>
            </header>

            {/* Study Container */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-8 pt-24 pb-24 relative">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIdx + (isFlipped ? '-a' : '-q')}
                  initial={{ opacity: 0, y: 20, rotateX: isFlipped ? -90 : 0 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: 90 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-acorn-400/10 min-h-[400px] flex flex-col relative"
                >
                  <div className={`absolute top-0 left-0 w-full h-2 rounded-t-3xl ${subjectInfo?.color}`}></div>
                  
                  <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center items-center text-center">
                    
                    {selectedMethod === 'feynman' && (
                      <div className="w-full text-left mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-acorn-50 text-acorn-600 rounded-lg text-xs font-bold uppercase tracking-wider font-mono mb-4 border border-acorn-100">
                          <PenTool className="w-3.5 h-3.5" /> Desafío Feynman
                        </span>
                      </div>
                    )}

                    <h2 className={`font-sans font-bold text-[#112613] leading-snug tracking-tight ${selectedMethod === 'feynman' ? 'text-2xl sm:text-3xl text-left w-full' : 'text-3xl sm:text-4xl'}`}>
                      {isFlipped ? mockCards[currentCardIdx].a : mockCards[currentCardIdx].q}
                    </h2>

                    {/* Feynman Typing Area */}
                    {selectedMethod === 'feynman' && !isFlipped && (
                      <div className="w-full mt-8">
                        <textarea 
                          placeholder="Explícalo con tus propias palabras como si le enseñaras a un principiante..."
                          className="w-full h-40 resize-none bg-[#F9F6F0] border border-acorn-400/20 rounded-xl p-4 text-[#112613] font-body text-lg outline-none focus:border-moss-400 focus:bg-white transition-colors"
                        ></textarea>
                      </div>
                    )}

                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Action Buttons (Bottom floating) */}
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
                
                {!isFlipped ? (
                  <button 
                    onClick={() => setIsFlipped(true)}
                    className="flex items-center gap-3 bg-[#112613] hover:bg-moss-900 text-[#F9F6F0] px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-moss-900/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5" />
                    {selectedMethod === 'feynman' ? "Comparar con respuesta ideal" : "Voltear tarjeta / Mostrar"}
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleNext(false)}
                      className="flex border-2 items-center gap-2 bg-white border-rose-200 hover:border-rose-400 text-rose-600 hover:bg-rose-50 px-6 sm:px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-acorn-400/5 hover:shadow-xl hover:-translate-y-1"
                    >
                      <XIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">Aún no</span>
                    </button>
                    <button 
                      onClick={() => handleNext(true)}
                      className="flex border-2 items-center gap-2 bg-white border-emerald-200 hover:border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-6 sm:px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-acorn-400/5 hover:shadow-xl hover:-translate-y-1"
                    >
                      <Check className="w-5 h-5" />
                      <span className="hidden sm:inline">Lo dominé</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Feynman Helper Lardi Avatar */}
              <AnimatePresence>
                {selectedMethod === 'feynman' && !isFlipped && (
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="fixed right-6 bottom-32 sm:right-12 sm:bottom-12 flex flex-col items-end gap-3 z-30"
                  >
                    <AnimatePresence>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="bg-white border border-moss-200 text-moss-800 p-4 rounded-2xl rounded-br-sm shadow-xl w-64 text-sm font-medium"
                        >
                          Piensa en la relación entre el área de rectángulos pequeños y cómo se acumulan al hacerlos infinitamente estrechos.
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <button 
                      onClick={() => setShowHint(!showHint)}
                      className="w-14 h-14 bg-moss-600 hover:bg-moss-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 relative group"
                    >
                      <Squirrel size={28} />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-acorn-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-acorn-500 text-[8px] items-center justify-center leading-none text-white font-bold">?</span>
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </main>
          </motion.div>
        )}

        {/* ===================== COMPLETE PHASE (Gamification) ===================== */}
        {step === 'complete' && (
          <motion.div 
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center z-30 relative"
          >
            {/* Minimal Background Confetti Mock - Using absolute icons */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute text-emerald-400/30 top-1/4 left-1/4"><Sparkles size={40} /></motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} className="absolute text-blue-400/30 bottom-1/3 right-1/4"><Sparkles size={30} /></motion.div>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="absolute text-amber-400/30 top-1/3 right-1/3"><Sparkles size={50} /></motion.div>
            
            <div className="bg-white p-12 rounded-3xl shadow-2xl border border-acorn-400/10 max-w-lg w-full flex flex-col items-center relative overflow-hidden">
              <div className="w-full h-2 bg-gradient-to-r from-emerald-400 to-moss-600 absolute top-0 left-0"></div>
              
              <div className="w-24 h-24 bg-moss-50 rounded-full flex items-center justify-center mb-6">
                <Squirrel className="w-12 h-12 text-moss-600" />
              </div>
              
              <h1 className="text-4xl font-sans font-bold text-[#112613] mb-4">¡Imparable!</h1>
              
              <p className="text-acorn-600 text-lg mb-8 font-medium">
                Has dominado <strong className="text-emerald-600 text-2xl mx-1">{masteredCount}</strong> conceptos hoy en <strong>{subjectInfo?.name}</strong>.
              </p>

              <div className="bg-[#F9F6F0] w-full rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#112613]">Racha activada</h4>
                    <p className="text-xs text-acorn-500">3 días seguidos estudiando</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#112613]">Eficiencia cognitiva</h4>
                    <p className="text-xs text-acorn-500">Retención estimada del 85%</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-4">
                <button 
                  onClick={() => setStep('setup')}
                  className="flex-1 bg-white border border-[#112613]/20 hover:bg-[#112613]/5 text-[#112613] font-bold py-3.5 rounded-xl transition-all"
                >
                  Otro Set
                </button>
                <Link 
                  to="/dashboard"
                  className="flex-1 bg-[#112613] hover:bg-moss-900 text-white font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:-translate-y-1 hover:shadow-xl"
                >
                  Ir al Dashboard
                </Link>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}


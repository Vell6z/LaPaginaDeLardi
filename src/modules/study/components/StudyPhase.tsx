import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X as XIcon, RotateCcw, Check, Squirrel, PenTool } from "lucide-react";

export function StudyPhase({
  setStep,
  subjectInfo,
  currentCardIdx,
  mockCards,
  isFlipped,
  setIsFlipped,
  selectedMethod,
  handleNext,
  showHint,
  setShowHint
}: any) {
  return (
    <motion.div 
      key="study"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col"
    >
      <header className="fixed top-0 left-0 w-full p-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <button onClick={() => setStep('setup')} className="text-acorn-500 hover:text-[#112613] transition-colors flex items-center gap-2 bg-[#F9F6F0] p-2 rounded-lg">
            <XIcon className="w-5 h-5" />
            <span className="font-bold hidden sm:inline">Salir</span>
          </button>
        </div>
        
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
  );
}

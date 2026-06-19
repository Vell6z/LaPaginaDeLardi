import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Squirrel, Check, Brain } from "lucide-react";

export function CompletePhase({
  masteredCount,
  subjectInfo,
  setStep
}: any) {
  return (
    <motion.div 
      key="complete"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col items-center justify-center p-6 text-center z-30 relative"
    >
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
  );
}

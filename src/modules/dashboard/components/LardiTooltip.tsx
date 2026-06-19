import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Squirrel } from "lucide-react";

export function LardiTooltip() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <AnimatePresence>
      {showTooltip && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-end gap-3 max-w-[280px] md:max-w-sm"
        >
          <div className="bg-white p-4 rounded-2xl rounded-br-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-acorn-400/10 relative">
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-acorn-400 hover:text-acorn-600 transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-sm font-medium text-[#112613] leading-relaxed pr-4">
              ¿Necesitas ayuda para organizar esta semana? <a href="#" className="text-moss-600 font-bold underline decoration-moss-300 underline-offset-2 hover:text-moss-700 transition-colors">Click aquí</a> para ver recomendaciones de estudio.
            </p>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-moss-100 flex items-center justify-center border-[3px] border-white shadow-lg shrink-0">
            <Squirrel className="w-6 h-6 md:w-8 md:h-8 text-moss-600" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

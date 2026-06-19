import React from "react";
import { Mic, ListTree, Share2, BookOpen, Check, MousePointer2 } from "lucide-react";

export function PathSection() {
  return (
    <section className="w-full bg-moss-800 bg-topo py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center relative z-10 w-full">
        <h2 className="text-3xl md:text-5xl font-sans font-bold text-cream-150 mb-12 md:mb-16 text-center w-full">
          El Camino del Conocimiento
        </h2>
        
        <div className="relative w-full pt-4 lg:pt-28 pb-12 lg:pb-36 mt-4 lg:mt-0">
          {/* The curving path line (Desktop Horizontal Wave) */}
          <div className="absolute top-1/2 left-0 w-full hidden lg:block opacity-70 z-0 -translate-y-1/2 pointer-events-none">
             <svg width="100%" height="200" preserveAspectRatio="none" viewBox="0 0 1000 200" className="stroke-acorn-300 overflow-visible" strokeWidth="4" fill="none" strokeDasharray="12 12" strokeLinecap="round">
               <path d="M-50,100 C150,250 350,-50 500,100 C650,250 850,-50 1050,100" />
             </svg>
          </div>
          
          {/* The vertical path line (Mobile/Tablet) */}
          <div className="absolute top-0 bottom-0 left-8 lg:hidden w-[4px] bg-acorn-300 opacity-60 z-0 border-l-[4px] border-dashed border-acorn-300"></div>

          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-stretch gap-12 lg:gap-6 xl:gap-8 relative z-10 w-full pl-12 lg:pl-0 pr-2 lg:pr-0">
            
            {/* Step 1 */}
            <div className="flex w-full lg:w-1/4 relative group lg:-translate-y-16 xl:-translate-y-24">
              <div className="bg-cream-150 w-full rounded-2xl flex flex-row shadow-[0_12px_40px_-10px_rgba(10,30,15,0.9)] relative border border-acorn-600/10 transition-transform duration-300 hover:-translate-y-1">
                
                {/* Icon Block */}
                <div className="w-1/3 sm:w-2/5 bg-[#EBE5D8] rounded-l-2xl flex flex-col items-center justify-center p-4 relative min-h-[140px]">
                   {/* Break out icon */}
                   <div className="absolute -top-6 left-2 sm:left-4 xl:-top-8 bg-moss-600 text-cream-150 p-3 sm:p-4 rounded-2xl shadow-xl rotate-[-5deg] group-hover:rotate-[0deg] transition-transform duration-300">
                     <Mic className="w-6 h-6 sm:w-8 sm:h-8" />
                   </div>
                   {/* Audio Wave Animation */}
                   <div className="flex items-center justify-center gap-1 opacity-50 mt-4">
                     <div className="w-1.5 bg-moss-700 rounded-full animate-[audio-wave-1_1s_ease-in-out_infinite]" />
                     <div className="w-1.5 bg-moss-700 rounded-full animate-[audio-wave-2_1.2s_ease-in-out_infinite]" />
                     <div className="w-1.5 bg-moss-700 rounded-full animate-[audio-wave-3_0.8s_ease-in-out_infinite]" />
                     <div className="w-1.5 bg-moss-700 rounded-full animate-[audio-wave-1_1.1s_ease-in-out_infinite]" />
                     <div className="w-1.5 bg-moss-700 rounded-full animate-[audio-wave-2_0.9s_ease-in-out_infinite]" />
                   </div>
                </div>
                
                {/* Text Block */}
                <div className="w-2/3 sm:w-3/5 p-4 sm:p-5 xl:p-6 flex flex-col justify-center">
                   <h3 className="font-sans text-lg sm:text-xl xl:text-2xl font-bold text-moss-700 mb-2">1. Captura</h3>
                   <p className="text-acorn-600/90 text-xs sm:text-sm leading-relaxed font-body">
                     Graba o sube el audio de tu clase. Lardi escuchará atentamente sin interrupciones.
                   </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex w-full lg:w-1/4 relative group lg:translate-y-16 xl:translate-y-24">
              <div className="bg-cream-150 w-full rounded-2xl flex flex-row-reverse shadow-[0_12px_40px_-10px_rgba(10,30,15,0.9)] relative border border-acorn-600/10 transition-transform duration-300 hover:-translate-y-1">
                
                {/* Icon Block */}
                <div className="w-1/3 sm:w-2/5 bg-[#EBE5D8] rounded-r-2xl flex flex-col items-center justify-center p-4 relative min-h-[140px]">
                   {/* Break out icon */}
                   <div className="absolute -top-6 right-2 sm:right-4 xl:-top-8 bg-moss-600 text-cream-150 p-3 sm:p-4 rounded-2xl shadow-xl rotate-[5deg] group-hover:rotate-[0deg] transition-transform duration-300 z-10">
                     <ListTree className="w-6 h-6 sm:w-8 sm:h-8" />
                   </div>
                   {/* Diagram logic visualization inside to fill space */}
                   <div className="flex flex-col items-center opacity-60 mt-4">
                     <div className="w-8 h-2 bg-moss-700 shadow-[0_0_8px_rgba(44,76,59,0.5)] rounded-sm mb-1.5 animate-pulse" style={{ animationDuration: '2s' }} />
                     <div className="w-px h-3 bg-moss-700/50 mb-1.5" />
                     <div className="flex gap-2">
                       <div className="w-4 h-2 bg-moss-700 shadow-[0_0_8px_rgba(44,76,59,0.5)] rounded-sm animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
                       <div className="w-4 h-2 bg-moss-700 shadow-[0_0_8px_rgba(44,76,59,0.5)] rounded-sm animate-pulse" style={{ animationDuration: '2s', animationDelay: '1.2s' }} />
                     </div>
                   </div>
                </div>
                
                {/* Text Block */}
                <div className="w-2/3 sm:w-3/5 p-4 sm:p-5 xl:p-6 flex flex-col justify-center text-left lg:text-left">
                   <h3 className="font-sans text-lg sm:text-xl xl:text-2xl font-bold text-moss-700 mb-2">2. Estructura</h3>
                   <p className="text-acorn-600/90 text-xs sm:text-sm leading-relaxed font-body">
                     La IA mapea la estructura lógica antes que los detalles.
                   </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex w-full lg:w-1/4 relative group lg:-translate-y-16 xl:-translate-y-24">
              <div className="bg-cream-150 w-full rounded-2xl flex flex-row shadow-[0_12px_40px_-10px_rgba(10,30,15,0.9)] relative border border-acorn-600/10 transition-transform duration-300 hover:-translate-y-1">
                
                {/* Icon Block */}
                <div className="w-1/3 sm:w-2/5 bg-[#EBE5D8] rounded-l-2xl flex items-center justify-center p-4 relative min-h-[140px]">
                   
                   <div className="absolute -top-6 left-2 sm:left-4 xl:-top-8 bg-moss-600 text-cream-150 p-3 sm:p-4 rounded-2xl shadow-xl rotate-[-3deg] group-hover:rotate-[0deg] transition-transform duration-300 z-10">
                     <Share2 className="w-6 h-6 sm:w-8 sm:h-8" />
                   </div>

                  {/* Share Micro-animation Block */}
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center mt-2 opacity-70">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-5 bg-moss-500/20 rounded flex items-center justify-center animate-[share-button-click_3s_ease-in-out_infinite]">
                        <Share2 className="w-3 h-3 text-moss-700" />
                      </div>
                      <div className="absolute animate-[share-check-popup_3s_ease-in-out_infinite] bg-[#4ADE80] w-6 h-5 rounded flex items-center justify-center shadow-sm">
                         <Check className="w-3 h-3 text-moss-700 font-bold" />
                      </div>
                    </div>
                    <div className="absolute w-3 h-3 text-moss-700 animate-[share-cursor-move_3s_ease-in-out_infinite]">
                       <MousePointer2 className="fill-current w-full h-full" />
                    </div>
                  </div>
                </div>
                
                {/* Text Block */}
                <div className="w-2/3 sm:w-3/5 p-4 sm:p-5 xl:p-6 flex flex-col justify-center">
                   <h3 className="font-sans text-lg sm:text-xl xl:text-2xl font-bold text-moss-700 mb-2">3. Comparte</h3>
                   <p className="text-acorn-600/90 text-xs sm:text-sm leading-relaxed font-body">
                     Envía tus apuntes a tu grupo de estudio con un solo clic.
                   </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex w-full lg:w-1/4 relative group lg:translate-y-16 xl:translate-y-24">
              <div className="bg-cream-150 w-full rounded-2xl flex flex-row-reverse shadow-[0_12px_40px_-10px_rgba(10,30,15,0.9)] relative border border-acorn-600/10 transition-transform duration-300 hover:-translate-y-1">
                
                {/* Icon Block */}
                <div className="w-1/3 sm:w-2/5 bg-[#EBE5D8] rounded-r-2xl flex flex-col items-center justify-center p-4 relative min-h-[140px]">
                   {/* Break out icon */}
                   <div className="absolute -top-6 right-2 sm:right-4 xl:-top-8 bg-moss-600 text-cream-150 p-3 sm:p-4 rounded-2xl shadow-xl rotate-[4deg] group-hover:rotate-[0deg] transition-transform duration-300 z-10">
                     <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                   </div>
                    {/* Highlight Book Animation */}
                    <div className="relative mt-4 flex flex-col gap-1.5 w-10 sm:w-12 border border-moss-700/10 bg-white/60 p-2 rounded shadow-sm rotate-[-2deg]">
                       <div className="h-1.5 w-full bg-moss-700/10 rounded relative overflow-hidden">
                         <div className="absolute inset-y-0 left-0 bg-yellow-400 origin-left animate-[highlight-swipe_2.5s_ease-out_infinite] w-full" />
                       </div>
                       <div className="h-1.5 w-4/5 bg-moss-700/10 rounded relative overflow-hidden">
                         <div className="absolute inset-y-0 left-0 bg-yellow-400 origin-left animate-[highlight-swipe_2.5s_ease-out_infinite] w-full" style={{ animationDelay: '0.4s' }} />
                       </div>
                       <div className="h-1.5 w-full bg-moss-700/10 rounded relative overflow-hidden">
                         <div className="absolute inset-y-0 left-0 bg-yellow-400 origin-left animate-[highlight-swipe_2.5s_ease-out_infinite] w-full" style={{ animationDelay: '0.8s' }} />
                       </div>
                    </div>
                </div>
                
                {/* Text Block */}
                <div className="w-2/3 sm:w-3/5 p-4 sm:p-5 xl:p-6 flex flex-col justify-center text-left lg:text-left">
                   <h3 className="font-sans text-lg sm:text-xl xl:text-2xl font-bold text-moss-700 mb-2">4. Estudia</h3>
                   <p className="text-acorn-600/90 text-xs sm:text-sm leading-relaxed font-body">
                     Prepárate para los parciales con notas perfectas.
                   </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

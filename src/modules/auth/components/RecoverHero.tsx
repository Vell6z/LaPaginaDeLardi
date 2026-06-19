import React from "react";
import { KeyRound } from "lucide-react";

export function RecoverHero() {
  return (
    <div className="hidden lg:flex w-[40%] bg-[#0A140B] relative flex-col justify-end p-16 overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-moss-900/40 via-[#0A140B] to-[#0A140B]"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
      </div>

      {/* Abstract Graphic Area (Lardi looking at key/envelope) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 z-10 flex items-center justify-center">
          {/* Subtle glow */}
          <div className="absolute w-48 h-48 bg-amber-500/5 blur-[60px] rounded-full mix-blend-screen"></div>
          
          <div className="relative z-20 flex flex-col items-center drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <KeyRound className="w-16 h-16 text-amber-500/80 mb-6 animate-pulse" strokeWidth={1} />
          </div>
      </div>

    </div>
  );
}

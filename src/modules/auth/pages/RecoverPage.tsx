import React from "react";
import { RecoverHero } from "../components/RecoverHero";
import { RecoverForm } from "../components/RecoverForm";

export function RecoverPage() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body">
      {/* Left Half: Art & Atmosphere (30-40% width) */}
      <RecoverHero />

      {/* Right Half: Form (60-70% width) */}
      <div className="w-full lg:w-[60%] h-full flex flex-col px-8 py-12 md:px-24 md:py-16 overflow-y-auto bg-[#F9F6F0] relative">
        {/* Grain texture overlay for right half */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none"></div>

        <RecoverForm />
      </div>
    </div>
  );
}

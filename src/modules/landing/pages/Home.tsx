import React from "react";

import { FAQSection } from "../components/FAQSection";
import { Footer } from "../../../shared/layout/Footer";
import { Navbar } from "../../../shared/layout/Navbar";
import { HeroSection } from "../components/HeroSection";
import { StorySection } from "../components/StorySection";
import { PathSection } from "../components/PathSection";

export function Home() {
  return (
    <div className="min-h-screen bg-cream-100 bg-grain text-acorn-600 font-body relative overflow-clip flex flex-col">
      {/* Ambient Lighting Gradient */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-moss-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/4 translate-y-1/4" />

      {/* Navbar */}
      <Navbar />

      <HeroSection />

      <StorySection />

      <PathSection />

      <FAQSection />
      
      <Footer />
    </div>
  );
}

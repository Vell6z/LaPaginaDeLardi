import React from "react";
import { ChevronRight, Play, Sparkles } from "lucide-react";
import { TypewriterEffect } from "./TypewriterEffect";

export function HeroSection() {
  return (
    <main className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32 flex-1 flex flex-col justify-center">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Column - Text & CTA */}
        <div className="flex flex-col items-start space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-moss-600 leading-[1.1] tracking-tight">
            Tu compañero <br />
            <span className="text-acorn-500 relative inline-block">
              inteligente
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-400/30 -rotate-1 rounded-full" />
            </span> de estudio
          </h1>
          
          <p className="text-lg md:text-xl text-acorn-500/80 max-w-lg leading-relaxed">
            Automatiza tus apuntes, organiza tus clases y domina el semestre con la ayuda de Lardi y la IA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="group bg-moss-500 hover:bg-moss-600 text-white text-lg font-medium px-8 py-4 rounded-2xl shadow-lg shadow-moss-500/20 transition-all hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3">
              Empieza a estudiar ahora
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-cream-200 hover:bg-cream-200/50 text-acorn-600 font-medium transition-colors border border-transparent hover:border-acorn-500/20">
              <Play className="w-5 h-5 fill-current" />
              Ver el video
            </button>
          </div>
        </div>

        {/* Right Column - Illustration Mock */}
        <div className="relative w-full aspect-square max-w-[500px] mx-auto lg:mx-0 lg:max-w-none">
          {/* The "Tree Base / Madriguera" */}
          <div className="absolute inset-0 bg-gradient-to-br from-acorn-400/20 to-moss-500/10 rounded-[3rem] rotate-3 shadow-2xl backdrop-blur-sm border border-white/40" />
          
          {/* Main Illustration Container */}
          <div className="absolute inset-0 bg-white/40 rounded-[3rem] shadow-inner backdrop-blur-md border border-white/60 overflow-hidden flex items-end justify-center p-8">
            
            {/* Lardi Placeholder Image */}
            <div className="relative w-full h-full flex flex-col items-center justify-end z-10">
              {/* Holographic Screen */}
              <div className="w-[80%] h-48 bg-cream-100/80 backdrop-blur-md rounded-2xl border border-white shadow-xl mb-8 p-4 relative transform -rotate-2 -translate-y-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-acorn-400/10 pb-2">
                  <div className="flex items-center gap-2 text-moss-600 text-sm font-semibold font-sans">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>Lardi IA Transcribiendo...</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-acorn-400/40" />
                    <div className="w-2 h-2 rounded-full bg-acorn-400/40" />
                    <div className="w-2 h-2 rounded-full bg-acorn-400/40" />
                  </div>
                </div>
                <div className="flex-1">
                  <TypewriterEffect />
                </div>
                {/* Floating Acorns */}
                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-yellow-400/30 backdrop-blur-sm shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center justify-center animate-bounce">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="absolute top-1/2 -left-6 w-6 h-6 rounded-full bg-yellow-400/20 backdrop-blur-sm flex items-center justify-center animate-bounce delay-100">
                  <Sparkles className="w-3 h-3 text-yellow-600" />
                </div>
              </div>

              {/* Squirrel Image */}
              <img 
                src="https://instagram.feoh8-1.fna.fbcdn.net/v/t51.82787-15/620404657_18091082336477689_6156583094789273968_n.jpg?stp=dst-jpg_e35_p720x720_tt6&_nc_cat=101&ig_cache_key=MjUxMDU5NTU4NTAxNzEzOTc2Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=J5gdzoV0zQ8Q7kNvwEbng6_&_nc_oc=AdoJQI4b-TniH93_7iyrfxGLhR59dNgkzpwktr905DZiwEcvHAgzFbtiaVhQ9ZSdnWk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.feoh8-1.fna&_nc_gid=ikp-P_bx9YXjMYEwISnQXA&_nc_ss=7a22e&oh=00_Af94zjtI0AQ3uyGcCASqoFeDflDjS1VKQiV_XuD7ptYw_Q&oe=6A3B2DB3" 
                alt="Lardi la ardilla" 
                className="w-64 h-64 object-cover object-center rounded-full shadow-2xl border-4 border-cream-100 z-10 animate-[spin_10s_linear_infinite]"
              />
            </div>

          </div>
        </div>
        
      </div>
    </main>
  );
}

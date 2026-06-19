import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

export function StorySection() {
  return (
    <section className="relative z-10 max-w-5xl w-full mx-auto px-6 pb-32">
      <div className="relative group">
        {/* Decorative background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-moss-500/5 to-acorn-400/5 rounded-[2.5rem] rotate-1 group-hover:rotate-2 transition-transform duration-500" />
        <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] shadow-sm -rotate-1 group-hover:-rotate-2 transition-transform duration-500" />
        
        {/* Content Container */}
        <div className="relative bg-cream-100 rounded-[2.5rem] p-10 md:p-16 shadow-xl shadow-acorn-500/5 border border-acorn-400/10 flex flex-col md:flex-row gap-12 items-center">
          
          {/* Left side: Icon/Avatar representation */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
              <img 
                src="https://instagram.feoh14-1.fna.fbcdn.net/v/t51.82787-15/619897701_18132171799504147_9088983098473146097_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MjE3MDUwOTc4MjA0MTkxMzUwNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTA4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=bbQ2T_M3y78Q7kNvwExDgXI&_nc_oc=AdqqvAJHTem6i35Djc93i0r-ewJuQwCWvJvDNRSHfRVfvGA-JmSsR7queVb-LmnvvEE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.feoh14-1.fna&_nc_gid=PCVkm53zitj-f3hzUDqgMg&_nc_ss=7a22e&oh=00_Af-uea5uDCiVzdIyZF6LnMpdbAHq38CAyg-nKxySbfXisw&oe=6A3B1A06" 
                alt="Lardi estudiando" 
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
              />
              <div className="absolute -bottom-2 -right-2 bg-moss-500 text-white p-3 rounded-full shadow-lg z-20">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-sans font-bold text-moss-600 text-xl">Lardi</h3>
              <p className="text-acorn-500 text-sm font-medium">Ph.D. en Ingeniería de Nueces</p>
            </div>
          </div>

          {/* Right side: Story Text */}
          <div className="w-full md:w-2/3 flex flex-col space-y-6">
            <div className="inline-flex items-center gap-2 text-yellow-600 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Nuestra Historia</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-moss-600 leading-tight">
              El estudiante más fiel de EAFIT
            </h2>
            
            <div className="space-y-4 text-acorn-600/90 leading-relaxed font-body">
              <p>
                Lardi no es una ardilla cualquiera. Es, sin lugar a dudas, el residente más antiguo y dedicado de todo el campus. Actualmente cursando su tercer doctorado en <strong>Ingeniería Avanzada de las Nueces</strong>, Lardi conoce cada rincón, cada placa y cada atajo hacia la biblioteca.
              </p>
              <p>
                Tras años de observar a los estudiantes lidiar con montañas de apuntes desorganizados, conferencias interminables y el inevitable estrés de la semana de parciales, Lardi decidió que era momento de devolverle el favor a su querida <em>alma mater</em>. Como buen ingeniero, supo que el trabajo duro debe complementarse con trabajo inteligente.
              </p>
              <p>
                Así nació <strong>La Página de Lardi</strong>: un proyecto diseñado para optimizar la forma en que los universitarios interactúan con su conocimiento. Combinando la paciencia infinita de la ardilla más sabia del campus con Inteligencia Artificial, Lardi busca facilitar tu educación, organizar el caos y darte más tiempo libre para disfrutar del campus bajo la sombra de los robles.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import { 
  Menu, 
  Sparkles, 
  Mic, 
  FolderOpen, 
  BookOpen, 
  ChevronRight, 
  Play, 
  FileText,
  Squirrel,
  GraduationCap,
  ListTree,
  Share2,
  Check,
  MousePointer2
} from "lucide-react";
import { useState, useEffect } from "react";

import { FAQSection } from "../components/FAQSection";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

const TYPEWRITER_TEXTS = [
  "Calculando la derivada de la función...",
  "Extrayendo puntos clave de la clase...",
  "Resumiendo el capítulo de microeconomía...",
  "Organizando estructuras de datos..."
];

function TypewriterEffect() {
  const [text, setText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = TYPEWRITER_TEXTS[textIndex];
    const typeSpeed = isDeleting ? 25 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentText) {
        setTimeout(() => setIsDeleting(true), 2500);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
        return;
      }

      setText(
        isDeleting
          ? currentText.substring(0, text.length - 1)
          : currentText.substring(0, text.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [text, textIndex, isDeleting]);

  return (
    <div className="text-sm text-acorn-600 font-body flex items-start h-full pt-2 px-1">
      <p className="flex-1 leading-relaxed min-h-[40px]">
        {text}
        <span className="inline-block w-[2px] h-[1.1em] ml-[2px] bg-moss-500 animate-pulse align-text-bottom" />
      </p>
    </div>
  );
}

export function Home() {
  return (
    <div className="min-h-screen bg-cream-100 bg-grain text-acorn-600 font-body relative overflow-clip flex flex-col">
      {/* Ambient Lighting Gradient */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-moss-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/4 translate-y-1/4" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
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

      {/* Story Section */}
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

      {/* Camino del Conocimiento Section */}
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

      <FAQSection />
      <Footer />
    </div>
  );
}

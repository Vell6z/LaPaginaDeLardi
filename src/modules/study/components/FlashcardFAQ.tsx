import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "¿Por qué no usar simplemente otra IA genérica?",
    answer: "Lardi está diseñada específicamente para el ecosistema universitario. Mantiene un archivo cronológico por materia, clase y semestre, enfocado en el rigor académico."
  },
  {
    question: "¿Entiende código o estructuras complejas?",
    answer: "El procesamiento está optimizado para identificar bloques de lógica, facilitando la lectura de programación y aislando la sintaxis del concepto principal."
  },
  {
    question: "¿Me ayuda a repasar para los parciales?",
    answer: "¡Sí! A partir de la transcripción, el sistema genera resúmenes estructurados y extrae los puntos clave ideales para estudiar."
  },
  {
    question: "¿Y si la clase dura 3 horas y el profe habla rápido?",
    answer: "Lardi tiene paciencia infinita. Procesa audios extensos sin problema y su IA filtra el ruido de fondo, adaptándose a diferentes ritmos y acentos."
  },
  {
    question: "¿Puedo editar lo que la IA generó?",
    answer: "Siempre tendrás el control total. La vista de estudio te permite modificar, resaltar texto y agregar tus propias notas manuales a la transcripción."
  },
  {
    question: "¿Funciona si mi clase es en inglés o bilingüe?",
    answer: "Totalmente. El motor de IA es multilingüe y detecta el idioma, estructurando los apuntes con precisión sin importar si cambias de idioma a mitad de la clase."
  },
  {
    question: "¿Mis grabaciones están seguras?",
    answer: "Completamente. La plataforma pasa por rigurosas auditorías de seguridad a nivel de desarrollo, protegiendo las peticiones de red y asegurando tu privacidad."
  },
  {
    question: "¿Necesito estar conectado a internet?",
    answer: "Solo requieres conexión para subir el audio y que la IA procese la clase. Una vez listos tus apuntes, puedes consultarlos o exportarlos en cualquier momento."
  },
  {
    question: "¿Qué formatos de audio acepta la plataforma?",
    answer: "Soporta los formatos de grabación más comunes (MP3, WAV, M4A, etc.). Puedes grabar desde tu celular y subir el archivo directamente."
  },
  {
    question: "¿Tengo que esperar en la pantalla a que termine de procesar?",
    answer: "Para nada. Lardi procesa en segundo plano. Puedes ir a otra materia o cerrar la pestaña, y tus apuntes estarán listos y organizados cuando regreses."
  },
  {
    question: "¿Es una herramienta gratuita?",
    answer: "El objetivo principal es apoyar el aprendizaje de la comunidad universitaria, optimizando los recursos de procesamiento para que sea accesible para los estudiantes."
  },
  {
    question: "¿Lardi reemplaza ir a clase?",
    answer: "¡No! Lardi es tu asistente, no tu sustituto. Te libera de escribir frenéticamente para que puedas prestar atención al 100%, participar y entender la lógica en vivo."
  }
];

export function FlashcardFAQ() {
  return (
    <section className="w-full bg-[#F9F6F0] py-20 px-6 relative">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Lardi Mascot Peeking */}


        {/* Header */}
        <div className="text-center mb-16 relative z-20 bg-[#F9F6F0] pt-4 px-8 rounded-t-3xl">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-[#1E3F20] mb-4 tracking-tight">
            ¿Dudas antes del parcial?
          </h2>
          <p className="text-acorn-600 font-body text-lg">
            Pasa el cursor sobre las tarjetas para descubrir cómo funciona Lardi.
          </p>
        </div>

        {/* Grid of Flashcards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full perspective-[1000px]">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="relative w-full h-64 group [perspective:1000px]"
            >
              {/* Inner Card Container */}
              <div className="w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-md rounded-2xl cursor-pointer">
                
                {/* Front Face */}
                <div className="absolute inset-0 w-full h-full bg-[#FAFAFA] rounded-2xl [backface-visibility:hidden] flex flex-col items-center justify-center p-6 text-center border border-acorn-400/10">
                  <HelpCircle className="w-8 h-8 text-[#1E3F20] mb-4" />
                  <h3 className="text-xl font-sans font-bold text-[#1E3F20] leading-snug">
                    {faq.question}
                  </h3>
                  <p className="absolute bottom-4 text-xs text-acorn-500 font-medium tracking-wider">
                    Girar tarjeta ⤵
                  </p>
                </div>
                
                {/* Back Face */}
                <div className="absolute inset-0 w-full h-full bg-[#1E3F20] rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center p-8 text-center shadow-lg border border-moss-500/20">
                  <p className="text-[#F9F6F0] font-body text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

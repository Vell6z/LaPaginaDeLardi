import { ShieldCheck, MicOff, ServerCrash, FileKey } from "lucide-react";

export function PrivacySection() {
  return (
    <section className="w-full bg-[#112613] py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 max-w-3xl">
          <div className="mb-6 p-4 bg-[#F9F6F0]/5 rounded-full border border-[#F9F6F0]/10 text-amber-100">
            <ShieldCheck className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-[#F9F6F0] mb-6 tracking-tight">
            Tu conocimiento está blindado.
          </h2>
          <p className="text-[#F9F6F0]/70 md:text-lg font-body leading-relaxed">
            Diseñamos Lardi priorizando la privacidad desde el código base, para que tus clases y apuntes sean estrictamente confidenciales.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
          
          {/* Pillar 1 */}
          <div className="flex flex-col items-start p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-[#F9F6F0]/20 hover:bg-white/[0.04] transition-colors">
            <div className="mb-6 p-3 bg-moss-500/20 rounded-xl text-moss-300">
              <MicOff className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-sans font-semibold text-[#F9F6F0] mb-3">
              Procesamiento Aislado
            </h3>
            <p className="text-[#F9F6F0]/60 font-body text-sm leading-relaxed">
              Los audios de tus profesores y tus notas de voz se procesan de manera efímera. La IA extrae la estructura y el contenido, y el archivo original no se expone a terceros.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col items-start p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-[#F9F6F0]/20 hover:bg-white/[0.04] transition-colors">
            <div className="mb-6 p-3 bg-moss-500/20 rounded-xl text-moss-300">
              <ServerCrash className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-sans font-semibold text-[#F9F6F0] mb-3">
              Infraestructura Auditada
            </h3>
            <p className="text-[#F9F6F0]/60 font-body text-sm leading-relaxed">
              Mantenemos protocolos de seguridad rigurosos en nuestro backend. Realizamos auditorías constantes para blindar la API y aplicamos políticas CORS estrictas para garantizar que nadie más que tú pueda acceder a tus peticiones de red.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col items-start p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-[#F9F6F0]/20 hover:bg-white/[0.04] transition-colors">
            <div className="mb-6 p-3 bg-moss-500/20 rounded-xl text-moss-300">
              <FileKey className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-sans font-semibold text-[#F9F6F0] mb-3">
              Tú tienes el control
            </h3>
            <p className="text-[#F9F6F0]/60 font-body text-sm leading-relaxed">
              Tus apuntes te pertenecen. Puedes exportar, modificar o eliminar tu base de conocimiento en cualquier momento, sin ataduras.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

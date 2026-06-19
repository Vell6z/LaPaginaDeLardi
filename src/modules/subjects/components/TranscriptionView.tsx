import React from "react";
import { FileAudio, Squirrel } from "lucide-react";

export function TranscriptionView({ subjectData }: { subjectData: any }) {
  return (
    <div className="flex flex-col max-w-4xl w-full">
      {/* Document Metatags */}
      <div className="flex items-center flex-wrap gap-3 mb-6">
          <span className="flex items-center gap-1.5 text-sm font-mono font-bold text-acorn-600 bg-white px-3 py-1.5 rounded-md border border-acorn-200 shadow-sm">
            <FileAudio className="w-4 h-4" /> Transcripción Generada
          </span>
          <span className="flex items-center gap-1.5 text-sm font-mono font-bold text-acorn-600 bg-white px-3 py-1.5 rounded-md border border-acorn-200 shadow-sm">
            Editado hace 2h
          </span>
      </div>

      <div className="bg-white rounded-2xl border border-acorn-400/20 shadow-sm p-8 md:p-12 prose prose-base md:prose-lg prose-green max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:text-[#112613] prose-p:font-body prose-p:text-acorn-700 prose-p:leading-relaxed">
        <h3>Definición Geométrica</h3>
        <p>
          El área bajo la curva f(x) en un intervalo [a, b] puede aproximarse dibujando rectángulos. 
          La precisión mejora a medida que el ancho de estos rectángulos se acerca a cero.
        </p>
        
        <div className={`my-8 border-l-4 ${subjectData.color} border-l-current pl-6 py-4 bg-acorn-50/50 rounded-r-lg`}>
          <span className={`text-[11px] font-mono tracking-widest uppercase font-bold ${subjectData.textColor} mb-3 block flex items-center gap-2`}>
            <Squirrel className="w-4 h-4" /> 
            Concepto Clave Lardi
          </span>
          <p className="m-0 font-medium text-[#112613]">
            La integral definida es básicamente el límite de una Suma de Riemann cuando el número de subintervalos tiende a infinito. Sirve para acumular cantidades continuas.
          </p>
        </div>
        
        <h3>Propiedades</h3>
        <ul>
          <li>La integral de una suma es la suma de las integrales.</li>
          <li>Las constantes se pueden "sacar" de la integral.</li>
          <li>Invertir los límites de integración cambia el signo del resultado.</li>
        </ul>
      </div>
    </div>
  );
}

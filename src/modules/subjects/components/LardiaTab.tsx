import React, { useState, useRef, useEffect } from "react";
import { Brain, Sparkles, Send, Loader2, MessageSquare, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export function LardiaTab({ session, fetchData }: any) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: '¡Hola! Soy LardIA. Ya analicé el contexto de esta clase. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);
    // Simular llamada al backend
    setTimeout(() => {
      // Por ahora no modificaremos la DB de verdad hasta la integración real
      // Pero quitaremos el estado de carga para mostrar que "terminó"
      setIsGeneratingSummary(false);
      alert("Simulación: Resumen generado. (La integración real actualizará la base de datos)");
    }, 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simular respuesta de la IA
    setTimeout(() => {
      const aiResponse: Message = { role: 'ai', text: 'Esta es una respuesta simulada. Pronto estaré conectada al modelo de lenguaje real para analizar tus apuntes.' };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  // Datos simulados si la sesión no tiene contenido real
  const summaryText = session?.aiContent?.summary || "Aún no se ha generado un resumen automático para esta clase. LardIA puede analizar la transcripción o los apuntes para generar uno.";
  const highlights = session?.aiContent?.smartHighlights && session.aiContent.smartHighlights.length > 0 
    ? session.aiContent.smartHighlights 
    : ["Inteligencia Artificial", "Análisis de Datos", "Redes Neuronales"]; // Mocks
  const transcript = session?.aiContent?.transcript || "No hay transcripción disponible. Sube un audio para que LardIA pueda transcribirlo.";

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full h-full max-w-7xl mx-auto">
      
      {/* PANEL IZQUIERDO: Resumen y Conceptos */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
        
        {/* Cabecera LardIA */}
        <div className="bg-gradient-to-br from-moss-50 to-moss-100 p-6 rounded-2xl border border-moss-200/50 flex items-start gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-moss-200/40 rotate-12">
            <Brain className="w-48 h-48" />
          </div>
          <div className="w-14 h-14 bg-moss-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md relative z-10">
            <Brain className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold font-sans text-moss-900">Análisis LardIA</h2>
            <p className="text-moss-700 text-sm mt-1 max-w-md">
              Tu asistente de estudio impulsado por IA. Usa este panel para digerir la información de la clase rápidamente.
            </p>
          </div>
        </div>

        {/* Sección de Resumen */}
        <div className="bg-white p-6 rounded-2xl border border-acorn-400/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Resumen Automático
            </h3>
            {(!session?.aiContent?.summary) && (
              <button 
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="flex items-center gap-2 bg-moss-100 hover:bg-moss-200 text-moss-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
              >
                {isGeneratingSummary ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generar ahora"}
              </button>
            )}
          </div>
          
          {isGeneratingSummary ? (
            <div className="py-8 flex flex-col items-center justify-center text-moss-600 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-bold animate-pulse">LardIA está procesando la clase...</p>
            </div>
          ) : (
            <p className="text-acorn-700 leading-relaxed text-sm">
              {summaryText}
            </p>
          )}
        </div>

        {/* Conceptos Clave */}
        <div className="bg-white p-6 rounded-2xl border border-acorn-400/20 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Conceptos Clave
          </h3>
          <div className="flex flex-wrap gap-2">
            {highlights.map((tag: string, idx: number) => (
              <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-bold shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Transcripción (Acordeón) */}
        <div className="bg-white rounded-2xl border border-acorn-400/20 shadow-sm overflow-hidden">
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between p-6 hover:bg-acorn-50 transition-colors"
          >
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> Transcripción
            </h3>
            {showTranscript ? <ChevronUp className="w-5 h-5 text-acorn-500" /> : <ChevronDown className="w-5 h-5 text-acorn-500" />}
          </button>
          
          <AnimatePresence>
            {showTranscript && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 border-t border-acorn-100">
                  <div className="h-48 overflow-y-auto text-sm text-acorn-600 p-4 bg-acorn-50 rounded-xl leading-relaxed whitespace-pre-wrap">
                    {transcript}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* PANEL DERECHO: Chat Interactivo */}
      <div className="flex-1 w-full xl:max-w-md h-[600px] xl:h-[calc(100vh-180px)] flex flex-col bg-white rounded-2xl border border-acorn-400/20 shadow-sm overflow-hidden">
        <div className="p-4 bg-moss-600 text-white flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">Chat con LardIA</h3>
            <p className="text-xs text-moss-100">Basado en el contexto de esta clase</p>
          </div>
        </div>

        {/* Area de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-acorn-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl p-3 shadow-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#112613] text-white rounded-tr-sm' 
                    : 'bg-white border border-acorn-400/10 text-acorn-800 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-acorn-400/10 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-moss-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-moss-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-moss-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-acorn-400/10 flex items-end gap-2 shrink-0">
          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Pregunta sobre la clase..."
            className="flex-1 max-h-32 min-h-[44px] bg-acorn-50 border border-acorn-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-moss-500 transition-colors resize-none overflow-y-auto"
            rows={1}
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-11 h-11 bg-moss-600 hover:bg-moss-700 disabled:bg-acorn-300 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </form>
      </div>
      
    </div>
  );
}

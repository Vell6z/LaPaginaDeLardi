import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Layers, Lightbulb, PenTool } from "lucide-react";
import { SetupPhase } from "../components/SetupPhase";
import { StudyPhase } from "../components/StudyPhase";
import { CompletePhase } from "../components/CompletePhase";

const subjects = [
  { id: '1', name: 'Cálculo Integral', color: 'bg-blue-500', text: 'text-blue-500' },
  { id: '2', name: 'Programación II', color: 'bg-emerald-500', text: 'text-emerald-500' },
  { id: '3', name: 'Estructura de Datos', color: 'bg-purple-500', text: 'text-purple-500' },
];

const methods = [
  { id: 'flashcards', title: 'Flashcards', desc: 'Repaso rápido de conceptos clave.', icon: <Layers className="w-6 h-6" /> },
  { id: 'quiz', title: 'Cuestionario Lógico', desc: 'Evalúa tu entendimiento con opciones.', icon: <Lightbulb className="w-6 h-6" /> },
  { id: 'feynman', title: 'Desafío de Explicación', desc: 'Explica con tus palabras (Método Feynman).', icon: <PenTool className="w-6 h-6" /> },
];

const levels = [
  { id: 'basic', label: 'Básico' },
  { id: 'intermediate', label: 'Intermedio' },
  { id: 'advanced', label: 'Ingeniería' },
];

const mockCards = [
  { q: "¿Cuál es la definición geométrica de la integral definida?", a: "Representa el área neta bajo la curva de una función en un intervalo dado [a, b]." },
  { q: "¿Qué establece el Teorema Fundamental del Cálculo?", a: "Conecta la derivación y la integración, estableciendo que son operaciones inversas. Permite evaluar integrales definidas usando antiderivadas." },
  { q: "¿Cuándo usar integración por partes?", a: "Cuando el integrando es un producto de dos funciones no relacionadas, a menudo siguiendo la regla ILATE (Inversas, Logarítmicas, Algebraicas, Trigonométricas, Exponenciales)." }
];

export function ActiveRecallPage() {
  const [step, setStep] = useState<'setup' | 'study' | 'complete'>('setup');
  
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [selectedMethod, setSelectedMethod] = useState('flashcards');
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
  
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  const startStudy = () => {
    setStep('study');
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setShowHint(false);
    setMasteredCount(0);
  };

  const handleNext = (mastered: boolean) => {
    if (mastered) {
      setMasteredCount(prev => prev + 1);
    }
    
    if (currentCardIdx < mockCards.length - 1) {
      setCurrentCardIdx(prev => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    } else {
      setStep('complete');
    }
  };

  const subjectInfo = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative selection:bg-moss-200">
      <AnimatePresence mode="wait">
        
        {step === 'setup' && (
          <SetupPhase 
            subjects={subjects}
            methods={methods}
            levels={levels}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            startStudy={startStudy}
          />
        )}

        {step === 'study' && (
          <StudyPhase 
            setStep={setStep}
            subjectInfo={subjectInfo}
            currentCardIdx={currentCardIdx}
            mockCards={mockCards}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            selectedMethod={selectedMethod}
            handleNext={handleNext}
            showHint={showHint}
            setShowHint={setShowHint}
          />
        )}

        {step === 'complete' && (
          <CompletePhase 
            masteredCount={masteredCount}
            subjectInfo={subjectInfo}
            setStep={setStep}
          />
        )}

      </AnimatePresence>
    </div>
  );
}

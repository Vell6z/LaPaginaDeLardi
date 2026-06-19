import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../../../shared/layout/Sidebar";
import { ChevronLeft } from "lucide-react";
import { AudioPlayerControls } from "../components/AudioPlayerControls";
import { TranscriptionView } from "../components/TranscriptionView";

const mockSessions = [
  { id: 1, title: "Clase 04: Árboles Binarios", date: "2026-03-10", time: "10:00 AM", status: "IA Procesado", type: "Clase", duration: "1h 20m", isHighlighted: false },
  { id: 2, title: "Clase 05: Árboles AVL", date: "2026-03-12", time: "10:00 AM", status: "Transcrito", type: "Clase", duration: "1h 15m", isHighlighted: false },
];

export function ClassDetailPage() {
  const { id, claseId } = useParams();
  const navigate = useNavigate();

  const session = mockSessions.find(s => s.id === Number(claseId)) || mockSessions[0];

  const subjectData = {
    id: id,
    name: "Estructura de Datos", 
    color: "bg-purple-500",
    textColor: "text-purple-500",
    lightBg: "bg-purple-50",
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative selection:bg-moss-200">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="shrink-0 z-10 bg-white border-b border-acorn-400/20">
          <div className={`h-2 w-full ${subjectData.color}`}></div>
          <div className="px-6 py-6 lg:px-10 flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 text-acorn-400 hover:text-[#112613] hover:bg-black/5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-[#112613] line-clamp-1">
                {session?.title || "Detalle de Clase"}
              </h1>
              <p className="text-sm font-medium text-acorn-500 mt-1">
                {session?.date} • {session?.time}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-[1600px] mx-auto w-full p-6 md:p-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            <div className="xl:col-span-4 flex flex-col gap-6">
              <AudioPlayerControls subjectData={subjectData} />
            </div>

            <div className="xl:col-span-8 flex flex-col max-w-4xl w-full">
              <TranscriptionView subjectData={subjectData} />
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

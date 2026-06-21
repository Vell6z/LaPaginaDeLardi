import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../../../shared/layout/Sidebar";
import { ChevronLeft, FileText, Mic, Video, Upload, ShieldAlert, Check, Play, Square, Loader2, Smartphone } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from "motion/react";

export function ClassDetailPage() {
  const { id, claseId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const [activeTab, setActiveTab] = useState<"materiales" | "audio" | "video">("materiales");
  
  // Consent Modal State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [pendingAction, setPendingAction] = useState<"audio" | "video" | null>(null);

  // Audio Recording State
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, claseId]);

  const fetchData = async () => {
    try {
      const [subRes, sessRes] = await Promise.all([
        fetch(`http://${window.location.hostname}:5000/api/subjects/${id}`, { credentials: 'include' }),
        fetch(`http://${window.location.hostname}:5000/api/subjects/${id}/sessions/${claseId}`, { credentials: 'include' })
      ]);

      if (subRes.ok && sessRes.ok) {
        setSubject(await subRes.json());
        setSession(await sessRes.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- AUDIO RECORDING ---
  const handleRequestRecord = (type: "audio" | "video") => {
    if (!consentGiven) {
      setPendingAction(type);
      setShowConsentModal(true);
    } else {
      if (type === "audio") startAudioRecording();
      // Si es video, el usuario ya ve el QR
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecordingAudio(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, `recording-${Date.now()}.webm`);

      const res = await fetch(`http://${window.location.hostname}:5000/api/subjects/${id}/sessions/${claseId}/media/audio`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (res.ok) {
        setAudioBlob(null);
        fetchData(); // Recargar la sesión para ver el audio
      } else {
        alert("Error al subir el audio");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // --- MATERIAL UPLOAD ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(e.target.files).forEach(file => {
        formData.append('documents', file);
      });

      const res = await fetch(`http://${window.location.hostname}:5000/api/subjects/${id}/sessions/${claseId}/media/documents`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (res.ok) {
        fetchData();
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert("Error al subir documentos");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // --- POLLING PARA VIDEO ---
  // Hacemos polling cada 3 segundos solo si estamos en la pestaña de video y la sesión no tiene videoUrl aún
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTab === "video" && session && !session.media?.videoUrl) {
      interval = setInterval(() => {
        fetchData();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeTab, session]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Obtener IP local (generalmente es localhost en dev a menos que se inyecte por ENV, pero usaremos el hostname actual)
  const localIp = window.location.hostname;
  const qrUrl = `http://${localIp}:3000/mobile-record/${id}/${claseId}`;


  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(-1);
    }, 400); // 400ms is the duration of the exit animation
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-[#F9F6F0]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-moss-200 blur-xl rounded-full opacity-50 animate-pulse"></div>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-acorn-400/10 relative z-10">
              <Loader2 className="w-10 h-10 animate-spin text-moss-600" />
            </div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-acorn-600 font-medium tracking-wide text-sm"
          >
            Preparando tu clase...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const subjectColor = subject?.colorId ? "bg-purple-500" : "bg-moss-500"; // fallback

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body text-[#112613] relative selection:bg-moss-200">
      <Sidebar />

      <motion.main 
        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
        animate={isExiting ? { opacity: 0, y: 10, filter: "blur(5px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 flex flex-col h-full overflow-hidden relative"
      >
        <header className="shrink-0 z-10 bg-white border-b border-acorn-400/20">
          <div className={`h-2 w-full ${subjectColor}`}></div>
          <div className="px-6 py-6 lg:px-10 flex items-center gap-4">
            <button 
              onClick={handleBack} 
              className="p-2 -ml-2 text-acorn-400 hover:text-[#112613] hover:bg-black/5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-[#112613] line-clamp-1">
                {session?.title}
              </h1>
              <p className="text-sm font-medium text-acorn-500 mt-1">
                {new Date(session?.date).toLocaleDateString()} • {session?.time} • {subject?.name}
              </p>
            </div>
          </div>
        </header>

        {/* Custom Tabs */}
        <div className="px-6 lg:px-10 pt-6 flex gap-2 border-b border-acorn-400/20">
          <button 
            onClick={() => setActiveTab("materiales")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'materiales' ? 'border-[#112613] text-[#112613]' : 'border-transparent text-acorn-500 hover:text-[#112613]'}`}
          >
            <FileText className="w-4 h-4" /> Materiales
          </button>
          <button 
            onClick={() => setActiveTab("audio")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'audio' ? 'border-[#112613] text-[#112613]' : 'border-transparent text-acorn-500 hover:text-[#112613]'}`}
          >
            <Mic className="w-4 h-4" /> Audio
          </button>
          <button 
            onClick={() => setActiveTab("video")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'video' ? 'border-[#112613] text-[#112613]' : 'border-transparent text-acorn-500 hover:text-[#112613]'}`}
          >
            <Video className="w-4 h-4" /> Video QR
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full p-6 md:p-10">
          <div className="max-w-4xl mx-auto w-full">
            
            {/* MATERIALES TAB */}
            {activeTab === "materiales" && (
              <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-2xl border border-acorn-400/20 shadow-sm">
                  <h3 className="text-lg font-bold font-sans mb-4">Subir Material</h3>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      multiple 
                      accept=".pdf,image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 bg-[#112613] hover:bg-moss-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Subir PDFs o Imágenes
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {session?.media?.pdfOrImagesUrls?.map((url: string, idx: number) => (
                    <a 
                      key={idx} 
                      href={`http://localhost:5000${url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group block bg-white p-4 rounded-xl border border-acorn-400/20 hover:border-moss-500 transition-colors shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-lg bg-moss-100 text-moss-600 flex items-center justify-center mb-3 group-hover:bg-moss-500 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-bold truncate">Documento {idx + 1}</p>
                      <p className="text-xs text-acorn-500">Haz clic para abrir</p>
                    </a>
                  ))}
                  {(!session?.media?.pdfOrImagesUrls || session.media.pdfOrImagesUrls.length === 0) && (
                    <div className="col-span-full py-10 text-center text-acorn-500 border-2 border-dashed border-acorn-400/20 rounded-2xl">
                      No hay materiales subidos aún.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AUDIO TAB */}
            {activeTab === "audio" && (
              <div className="flex flex-col gap-6">
                <div className="bg-white p-8 rounded-2xl border border-acorn-400/20 shadow-sm text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-sans mb-2">Grabación de Audio</h3>
                  <p className="text-acorn-500 text-sm mb-8 max-w-md mx-auto">
                    Graba el audio de la clase directamente desde el micrófono de tu computador. Asegúrate de tener el permiso del profesor.
                  </p>

                  {session?.media?.audioUrl ? (
                    <div className="bg-moss-50 p-6 rounded-xl border border-moss-200">
                      <p className="text-moss-800 font-bold mb-4">🎵 Audio de la clase disponible</p>
                      <audio controls className="w-full">
                        <source src={`http://localhost:5000${session.media.audioUrl}`} type="audio/webm" />
                        Tu navegador no soporta el elemento de audio.
                      </audio>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      {isRecordingAudio ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-3xl font-mono font-bold text-red-500 animate-pulse">
                            {formatTime(recordingTime)}
                          </div>
                          <button 
                            onClick={stopAudioRecording}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                          >
                            <Square className="w-5 h-5 fill-current" /> Detener Grabación
                          </button>
                        </div>
                      ) : audioBlob ? (
                        <div className="flex flex-col items-center gap-4 w-full max-w-md">
                          <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                          <div className="flex gap-2 w-full">
                            <button 
                              onClick={() => setAudioBlob(null)}
                              disabled={isUploading}
                              className="flex-1 bg-acorn-100 hover:bg-acorn-200 text-acorn-700 px-4 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
                            >
                              Descartar
                            </button>
                            <button 
                              onClick={uploadAudio}
                              disabled={isUploading}
                              className="flex-2 flex justify-center items-center gap-2 bg-[#112613] hover:bg-moss-900 text-white px-4 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
                            >
                              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />} Guardar Audio
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleRequestRecord("audio")}
                          className="flex items-center gap-2 bg-[#112613] hover:bg-moss-900 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm"
                        >
                          <Play className="w-5 h-5 fill-current" /> Iniciar Grabación
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIDEO TAB */}
            {activeTab === "video" && (
              <div className="flex flex-col gap-6">
                <div className="bg-white p-8 rounded-2xl border border-acorn-400/20 shadow-sm text-center">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-sans mb-2">Video Remoto (QR)</h3>
                  <p className="text-acorn-500 text-sm mb-8 max-w-md mx-auto">
                    Usa tu celular como cámara. Escanea este código QR para abrir la interfaz de grabación móvil. El video se sincronizará aquí automáticamente.
                  </p>

                  {session?.media?.videoUrl ? (
                    <div className="bg-moss-50 p-6 rounded-xl border border-moss-200">
                      <p className="text-moss-800 font-bold mb-4">🎬 Video de la clase disponible</p>
                      <video controls className="w-full rounded-lg bg-black">
                        <source src={`http://localhost:5000${session.media.videoUrl}`} type="video/webm" />
                        Tu navegador no soporta el elemento de video.
                      </video>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      {!consentGiven ? (
                        <button 
                          onClick={() => handleRequestRecord("video")}
                          className="flex items-center gap-2 bg-[#112613] hover:bg-moss-900 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm"
                        >
                          <ShieldAlert className="w-5 h-5" /> Aceptar Política para ver QR
                        </button>
                      ) : (
                        <div className="flex flex-col items-center gap-6">
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-acorn-400/20 inline-block">
                            <QRCodeSVG value={qrUrl} size={200} />
                          </div>
                          <div className="flex items-center gap-3 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                            <Smartphone className="w-5 h-5 animate-pulse" />
                            Esperando video desde el celular...
                          </div>
                          <p className="text-xs text-acorn-500 max-w-xs">
                            Asegúrate de que tu celular y este computador estén conectados a la misma red Wi-Fi.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </motion.main>

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#112613]/60 backdrop-blur-sm" onClick={() => setShowConsentModal(false)} />
          <div className="bg-[#F9F6F0] rounded-3xl shadow-xl w-full max-w-md relative z-10 overflow-hidden border border-acorn-400/20">
            <div className="p-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-sans font-bold text-[#112613]">Cláusula de Ética</h2>
              <p className="text-acorn-600 text-sm leading-relaxed">
                Al grabar una clase (audio o video), te comprometes éticamente a <strong>haber solicitado el permiso explícito del profesor</strong> a cargo de la materia.
              </p>
              <p className="text-acorn-600 text-sm leading-relaxed mb-4">
                El material grabado es para tu uso de estudio personal y no debe ser distribuido sin autorización.
              </p>
              <button 
                onClick={() => {
                  setConsentGiven(true);
                  setShowConsentModal(false);
                  if (pendingAction === "audio") startAudioRecording();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#112613] hover:bg-moss-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
              >
                <Check className="w-5 h-5" /> Entiendo y tengo permiso
              </button>
              <button 
                onClick={() => setShowConsentModal(false)}
                className="w-full text-acorn-500 hover:text-[#112613] font-bold py-2 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

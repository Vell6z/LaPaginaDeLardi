import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../../../shared/layout/Sidebar";
import { ChevronLeft, FileText, Mic, Video, Upload, ShieldAlert, Check, Play, Square, Loader2, Smartphone } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from "motion/react";
import { Save, Trash2, Edit2, X, Brain, Sparkles } from "lucide-react";
import { LardiaTab } from "../components/LardiaTab";
import { usePageTitle } from "../../../core/hooks/usePageTitle";

export function ClassDetailPage() {
  const { id, claseId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);
  usePageTitle(session ? session.title : "Cargando clase...");

  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [missingFiles, setMissingFiles] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<"general" | "bloc" | "lardia" | "materiales" | "audio" | "video">("general");
  
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

  // Material Viewer State
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [editingText, setEditingText] = useState("");
  const [isSavingText, setIsSavingText] = useState(false);

  // Delete Confirmation State
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, claseId]);

  const checkFilesExist = async (sessionData: any) => {
    if (!sessionData?.media?.driveFileIds) return;
    
    const missing: string[] = [];
    const fileIdsMap = sessionData.media.driveFileIds;
    
    for (const [fileName, fileId] of Object.entries(fileIdsMap)) {
      try {
        const res = await fetch(`http://${window.location.hostname}:5000/api/drive/check/${fileId}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (!data.exists) {
            missing.push(fileName);
          }
        }
      } catch (e) {
        console.error('Error checking file', e);
      }
    }
    
    if (missing.length > 0) {
      setMissingFiles(missing);
    }
  };

  const fetchData = async () => {
    try {
      const [subRes, sessRes] = await Promise.all([
        fetch(`http://${window.location.hostname}:5000/api/subjects/${id}`, { credentials: 'include' }),
        fetch(`http://${window.location.hostname}:5000/api/subjects/${id}/sessions/${claseId}`, { credentials: 'include' })
      ]);

      if (subRes.ok && sessRes.ok) {
        setSubject(await subRes.json());
        const sessionData = await sessRes.json();
        setSession(sessionData);
        checkFilesExist(sessionData);
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
      Array.from(e.target.files).forEach((file) => {
        formData.append('documents', file as File);
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

  // --- FILE MANAGEMENT ---
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeletingFile(true);
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/subjects/${id}/sessions/${claseId}/media/${fileToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        if (selectedMaterial?.fileId === fileToDelete) setSelectedMaterial(null);
        setFileToDelete(null);
        fetchData();
      } else {
        alert("Error al eliminar el archivo");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeletingFile(false);
    }
  };

  const handleOpenMaterial = async (mat: any) => {
    setSelectedMaterial(mat);
    if (mat.mimeType === 'text/plain') {
      setIsSavingText(true);
      try {
        const res = await fetch(`http://${window.location.hostname}:5000/api/subjects/${id}/sessions/${claseId}/media/${mat.fileId}/text`, {
          credentials: 'include'
        });
        if (res.ok) {
          const text = await res.text();
          setEditingText(text);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSavingText(false);
      }
    }
  };

  const handleSaveTextFile = async () => {
    if (!selectedMaterial) return;
    setIsSavingText(true);
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/subjects/${id}/sessions/${claseId}/media/${selectedMaterial.fileId}/text`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: editingText })
      });
      if (res.ok) {
        alert("Archivo guardado exitosamente");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingText(false);
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
          
          {missingFiles.length > 0 && (
            <div className="bg-rose-50 border-t border-rose-200 px-6 lg:px-10 py-3 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-rose-800">Archivos eliminados en Google Drive</p>
                <p className="text-sm text-rose-700">Los siguientes archivos fueron eliminados desde Drive y no se pueden recuperar: <span className="font-mono bg-rose-100 px-1 rounded">{missingFiles.join(', ')}</span></p>
              </div>
            </div>
          )}
        </header>

        {/* Custom Tabs */}
        <div className="px-6 lg:px-10 pt-6 flex gap-2 border-b border-acorn-400/20 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("general")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'general' ? 'border-[#112613] text-[#112613]' : 'border-transparent text-acorn-500 hover:text-[#112613]'}`}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5"><div className="bg-current rounded-[2px]" /><div className="bg-current rounded-[2px]" /><div className="bg-current rounded-[2px]" /><div className="bg-current rounded-[2px]" /></div> General
          </button>
          <button 
            onClick={() => setActiveTab("bloc")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'bloc' ? 'border-[#112613] text-[#112613]' : 'border-transparent text-acorn-500 hover:text-[#112613]'}`}
          >
            <FileText className="w-4 h-4" /> Bloc de Notas
          </button>
          <button 
            onClick={() => setActiveTab("lardia")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'lardia' ? 'border-moss-600 text-moss-600' : 'border-transparent text-acorn-500 hover:text-moss-600'}`}
          >
            <Brain className="w-4 h-4" /> LardIA
          </button>
          <button 
            onClick={() => setActiveTab("materiales")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'materiales' ? 'border-[#112613] text-[#112613]' : 'border-transparent text-acorn-500 hover:text-[#112613]'}`}
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
            
            {/* GENERAL OVERVIEW TAB */}
            {activeTab === "general" && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Card */}
                  <div className="bg-white p-6 rounded-2xl border border-acorn-400/20 shadow-sm flex flex-col gap-2">
                    <p className="text-xs font-mono uppercase font-bold text-acorn-500">Estado de la Clase</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${session?.status === 'Estudiado' ? 'bg-emerald-500' : session?.status === 'En Proceso' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      <p className="text-lg font-bold text-[#112613]">{session?.status || 'Pendiente'}</p>
                    </div>
                  </div>
                  
                  {/* Materiales Info */}
                  <button onClick={() => setActiveTab("materiales")} className="bg-white p-6 rounded-2xl border border-acorn-400/20 hover:border-moss-500 transition-colors shadow-sm flex flex-col gap-2 text-left">
                    <p className="text-xs font-mono uppercase font-bold text-acorn-500">Documentos</p>
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-moss-600" />
                      <p className="text-xl font-bold text-[#112613]">{session?.media?.materials?.length || 0} Archivos</p>
                    </div>
                  </button>

                  {/* Audio Info */}
                  <button onClick={() => setActiveTab("audio")} className="bg-white p-6 rounded-2xl border border-acorn-400/20 hover:border-blue-500 transition-colors shadow-sm flex flex-col gap-2 text-left">
                    <p className="text-xs font-mono uppercase font-bold text-acorn-500">Grabaciones</p>
                    <div className="flex items-center gap-3">
                      <Mic className="w-6 h-6 text-blue-500" />
                      <p className="text-xl font-bold text-[#112613]">{session?.media?.audios?.length || 0} Audios</p>
                    </div>
                  </button>

                  {/* Video Info */}
                  <button onClick={() => setActiveTab("video")} className="bg-white p-6 rounded-2xl border border-acorn-400/20 hover:border-rose-500 transition-colors shadow-sm flex flex-col gap-2 text-left">
                    <p className="text-xs font-mono uppercase font-bold text-acorn-500">Video Remoto</p>
                    <div className="flex items-center gap-3">
                      <Video className="w-6 h-6 text-rose-500" />
                      <p className="text-xl font-bold text-[#112613]">{session?.media?.videoUrl ? 'Disponible' : 'Sin Video'}</p>
                    </div>
                  </button>
                </div>

                {/* Resumen Rapido o Bloc */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-acorn-400/20 shadow-sm flex flex-col gap-4">
                    <h3 className="text-lg font-bold font-sans flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" /> Resumen de LardIA
                    </h3>
                    <p className="text-sm text-acorn-700 leading-relaxed line-clamp-4">
                      {session?.aiContent?.summary || "La inteligencia artificial aún no ha generado un resumen para esta clase. Ve a la pestaña LardIA para crearlo."}
                    </p>
                    <button 
                      onClick={() => setActiveTab("lardia")}
                      className="mt-auto text-sm font-bold text-moss-600 hover:text-moss-700 text-left transition-colors"
                    >
                      Ver análisis completo →
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-acorn-400/20 shadow-sm flex flex-col gap-4">
                    <h3 className="text-lg font-bold font-sans flex items-center gap-2">
                      <FileText className="w-5 h-5 text-acorn-600" /> Vistazo a los Apuntes
                    </h3>
                    <p className="text-sm text-acorn-700 font-mono whitespace-pre-wrap leading-relaxed line-clamp-4 bg-acorn-50 p-3 rounded-xl border border-acorn-100 h-full">
                      {session?.media?.rawText || "No hay apuntes escritos en el bloc de notas todavía."}
                    </p>
                    <button 
                      onClick={() => setActiveTab("bloc")}
                      className="mt-auto text-sm font-bold text-[#112613] hover:text-moss-700 text-left transition-colors"
                    >
                      Ir al Bloc de Notas →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BLOC DE NOTAS TAB */}
            {activeTab === "bloc" && (
              <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-2xl border border-acorn-400/20 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xl font-bold font-sans">Bloc de Notas</h3>
                  <textarea 
                    className="w-full h-[60vh] p-4 border border-acorn-300 rounded-xl focus:border-moss-500 outline-none text-[#112613] resize-none"
                    placeholder="Escribe tus apuntes de la clase aquí..."
                    defaultValue={session?.media?.rawText || ""}
                    onBlur={async (e) => {
                      const newText = e.target.value;
                      if (newText !== session?.media?.rawText) {
                        try {
                          await fetch(`http://${window.location.hostname}:5000/api/subjects/${id}/sessions/${claseId}/media/text`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ rawText: newText })
                          });
                          fetchData();
                        } catch (err) {
                          console.error(err);
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-acorn-500">Los apuntes se guardan automáticamente al hacer clic fuera del cuadro de texto.</p>
                </div>
              </div>
            )}

            {/* LARDIA TAB */}
            {activeTab === "lardia" && (
              <LardiaTab session={session} fetchData={fetchData} />
            )}
            
            {/* MATERIALES TAB */}
            {activeTab === "materiales" && (
              <div className="flex flex-col gap-6">
                {!selectedMaterial ? (
                  <>
                    <div className="bg-white p-6 rounded-2xl border border-acorn-400/20 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <h3 className="text-lg font-bold font-sans">Archivos Adjuntos</h3>
                      <div className="flex items-center gap-4">
                        <input 
                          type="file" 
                          multiple 
                          accept=".pdf,image/*,.txt" 
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
                          Subir Archivos
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {session?.media?.materials?.map((mat: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="group relative bg-white p-4 rounded-xl border border-acorn-400/20 hover:border-moss-500 transition-colors shadow-sm flex flex-col"
                        >
                          <button 
                            onClick={() => setFileToDelete(mat.fileId)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-100 text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-200"
                            title="Eliminar archivo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <button onClick={() => handleOpenMaterial(mat)} className="flex-1 text-left">
                            <div className="w-10 h-10 rounded-lg bg-moss-100 text-moss-600 flex items-center justify-center mb-3 group-hover:bg-moss-500 group-hover:text-white transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-bold truncate pr-6" title={mat.name}>{mat.name}</p>
                            <p className="text-xs text-acorn-500 mt-1 uppercase font-bold">{mat.mimeType.split('/')[1] || 'Archivo'}</p>
                          </button>
                        </div>
                      ))}
                      {(!session?.media?.materials || session.media.materials.length === 0) && (
                        <div className="col-span-full py-10 text-center text-acorn-500 border-2 border-dashed border-acorn-400/20 rounded-2xl">
                          No hay archivos adjuntos aún.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-[70vh] bg-white rounded-2xl border border-acorn-400/20 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-acorn-400/20 bg-[#F9F6F0]">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSelectedMaterial(null)}
                          className="p-1.5 hover:bg-acorn-200 text-acorn-600 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-sm font-bold font-sans truncate">{selectedMaterial.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        {selectedMaterial.mimeType === 'text/plain' && (
                          <button 
                            onClick={handleSaveTextFile}
                            disabled={isSavingText}
                            className="flex items-center gap-2 bg-[#112613] hover:bg-moss-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                          >
                            {isSavingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar
                          </button>
                        )}
                        <a 
                          href={selectedMaterial.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-acorn-200 hover:bg-acorn-300 text-acorn-800 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          Abrir en Drive
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-acorn-50 overflow-auto">
                      {selectedMaterial.mimeType === 'text/plain' ? (
                        <textarea 
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full h-full p-6 outline-none resize-none font-mono text-sm bg-white"
                          disabled={isSavingText && editingText === ""}
                        />
                      ) : selectedMaterial.mimeType.startsWith('image/') ? (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <img src={selectedMaterial.url} alt={selectedMaterial.name} className="max-w-full max-h-full object-contain rounded-xl shadow-sm" />
                        </div>
                      ) : (
                        <iframe 
                          src={selectedMaterial.url} 
                          title={selectedMaterial.name}
                          className="w-full h-full border-none"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AUDIO TAB */}
            {activeTab === "audio" && (
              <div className="flex flex-col gap-6">
                
                {/* LISTA DE AUDIOS */}
                {session?.media?.audios && session.media.audios.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-acorn-400/20 shadow-sm">
                    <h3 className="text-lg font-bold font-sans mb-4">Audios Grabados</h3>
                    <div className="flex flex-col gap-4">
                      {session.media.audios.map((aud: any, idx: number) => (
                        <div key={idx} className="flex flex-col md:flex-row items-center gap-4 bg-acorn-50 p-4 rounded-xl border border-acorn-200">
                          <div className="flex items-center gap-3 flex-1 w-full">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                              <Mic className="w-5 h-5" />
                            </div>
                            <div className="truncate flex-1">
                              <p className="text-sm font-bold truncate" title={aud.name}>{aud.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <audio src={aud.url} controls className="h-10 w-full md:w-64" />
                            <button 
                              onClick={() => setFileToDelete(aud.fileId)}
                              className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors shrink-0"
                              title="Eliminar audio"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* GRABADOR DE AUDIO */}
                <div className="bg-white p-8 rounded-2xl border border-acorn-400/20 shadow-sm text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-sans mb-2">Grabar Nuevo Audio</h3>
                  <p className="text-acorn-500 text-sm mb-8 max-w-md mx-auto">
                    Graba el audio de la clase directamente desde el micrófono de tu computador. Asegúrate de tener el permiso del profesor.
                  </p>

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
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />} Subir Audio
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
                    <div className="bg-moss-50 p-6 rounded-xl border border-moss-200 flex flex-col items-center">
                      <p className="text-moss-800 font-bold mb-4">🎬 Video de la clase disponible en Google Drive</p>
                      <a 
                        href={session.media.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-[#112613] hover:bg-moss-900 text-white px-6 py-3 rounded-xl font-bold transition-all"
                      >
                        Abrir Video en Drive
                      </a>
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

      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#112613]/60 backdrop-blur-sm" onClick={() => !isDeletingFile && setFileToDelete(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#F9F6F0] rounded-3xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden border border-acorn-400/20"
          >
            <div className="p-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-2">
                <Trash2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-sans font-bold text-[#112613]">¿Eliminar archivo?</h2>
              <p className="text-acorn-600 text-sm leading-relaxed mb-4">
                Esta acción es irreversible. El archivo será eliminado permanentemente tanto de la aplicación como de tu Google Drive.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setFileToDelete(null)}
                  disabled={isDeletingFile}
                  className="flex-1 bg-acorn-200 hover:bg-acorn-300 text-acorn-800 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDeleteFile}
                  disabled={isDeletingFile}
                  className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {isDeletingFile ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

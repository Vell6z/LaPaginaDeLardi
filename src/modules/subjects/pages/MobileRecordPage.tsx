import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Video, Square, Loader2, ShieldAlert } from "lucide-react";

export function MobileRecordPage() {
  const { id, claseId } = useParams();

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Iniciar cámara al cargar la página
    startCameraPreview();
    return () => {
      stopCamera();
    };
  }, []);

  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Usar cámara trasera si está disponible
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara. Asegúrate de dar los permisos.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm';
    
    mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType });
    
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
      uploadVideo(videoBlob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const uploadVideo = async (blob: Blob) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', blob, `video-${Date.now()}.webm`);

      const res = await fetch(`http://${window.location.hostname}:5000/api/subjects/${id}/sessions/${claseId}/media/video`, {
        method: 'POST',
        credentials: 'include', // Asume que el celular inició sesión, si no, el QR debería enviar un token en la url (lo simplificaremos por ahora asumiendo que el usuario ya se logueó en el celular)
        body: formData
      });

      if (res.ok) {
        setUploadSuccess(true);
        stopCamera();
      } else {
        alert("Error al subir el video.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error de conexión al subir el video.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (uploadSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#112613] text-white p-6 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-bold font-sans mb-4">Video Subido Exitosamente</h1>
        <p className="text-acorn-300">
          Ya puedes ver el video de la clase en tu computador. Puedes cerrar esta ventana.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden relative">
      {/* Header flotante */}
      <div className="absolute top-0 inset-x-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">Grabación de Clase</span>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/50">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="font-mono font-bold text-red-500">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {/* Visor de Cámara */}
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-30' : 'opacity-100'}`}
        />
        
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <Loader2 className="w-16 h-16 text-white animate-spin mb-4" />
            <p className="font-bold text-xl">Subiendo video al servidor...</p>
            <p className="text-acorn-300 text-sm mt-2">Por favor, no cierres esta pantalla.</p>
          </div>
        )}
      </div>

      {/* Controles inferiores */}
      <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 flex justify-center items-center pb-12">
        {!isUploading && (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${
              isRecording 
                ? 'border-red-500 bg-red-500/20' 
                : 'border-white bg-white/20 hover:bg-white/30'
            }`}
          >
            {isRecording ? (
              <div className="w-8 h-8 bg-red-500 rounded-sm"></div>
            ) : (
              <div className="w-16 h-16 bg-red-500 rounded-full"></div>
            )}
          </button>
        )}
      </div>
      
      {/* Aviso de permisos en local */}
      <div className="absolute top-20 inset-x-4 z-10">
        <div className="bg-amber-500/20 border border-amber-500/50 p-3 rounded-xl flex items-start gap-3 backdrop-blur-md">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-100 leading-relaxed">
            Si la cámara no carga, asegúrate de estar usando HTTPS, o de haber dado permisos en tu navegador local.
          </p>
        </div>
      </div>
    </div>
  );
}

import multer from 'multer';

const storage = multer.memoryStorage();

// Limitar a 500MB para videos, 50MB para audio y 20MB para documentos
export const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB global limit
});

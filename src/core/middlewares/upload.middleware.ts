import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Asegurar que los directorios existan
const ensureDirectoryExistence = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'public/uploads/misc';
    
    if (file.mimetype.startsWith('audio/')) {
      folder = 'public/uploads/audio';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'public/uploads/video';
    } else if (file.mimetype.startsWith('application/pdf') || file.mimetype.startsWith('image/')) {
      folder = 'public/uploads/documents';
    }

    ensureDirectoryExistence(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Limitar a 500MB para videos, 50MB para audio y 20MB para documentos
export const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB global limit
});

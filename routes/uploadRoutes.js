import express from 'express';
import multer from 'multer';
import { tambahRuteLengkap } from '../controllers/uploadController.js';

const router = express.Router();

// Setup multer dengan memory storage (agar bisa dikirim ke Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint POST: /api/upload/rute
router.post('/rute', // 
  upload.fields([
    { name: 'placeholder', maxCount: 1 },
    { name: 'langkah_gambar' },
    { name: 'langkah_gif' }
  ]),
  tambahRuteLengkap
);

export default router;

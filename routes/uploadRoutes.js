import express from 'express';
import multer from 'multer';
import { tambahRuteLengkap } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-rute', upload.fields([
  { name: 'placeholder', maxCount: 1 },
  { name: 'langkah_gambar' },
  { name: 'langkah_gif' }
]), tambahRuteLengkap);

export default router;
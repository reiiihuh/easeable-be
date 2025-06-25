import express from 'express';
import multer from 'multer';
import { tambahRuteLengkap} from '../controllers/uploadController.js';
// import { updateLokasi } from '../controllers/locationController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-rute', upload.fields([
  { name: 'placeholder', maxCount: 1 },
  { name: 'langkah_gambar' },
  { name: 'langkah_gif' }
]), tambahRuteLengkap);

// router.put('/locations/:id', 
//   upload.fields([
//     { name: 'placeholder', maxCount: 1 },
//     { name: 'langkah_gambar' },
//     { name: 'langkah_gif' }
//   ]),
//   updateLokasi
// );

export default router;
import express from 'express';
import multer from 'multer';
import { tambahRuteLengkap} from '../controllers/uploadController.js';
// import { updateLokasi } from '../controllers/locationController.js';
import {
  tambahLokasiSaja,
  tambahRuteKeLokasi,
} from '../controllers/uploadController.js';

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




// ADD LOKASI ONLY
router.post('/lokasi',
  upload.fields([{ name: 'url_placeholder', maxCount: 1 }]),
  tambahLokasiSaja
);

// ADD RUTE TO LOKASI
router.post('/rute',
  upload.fields([
    { name: 'langkah_gambar' },
    { name: 'langkah_gif' }
  ]),
  tambahRuteKeLokasi
);


export default router;
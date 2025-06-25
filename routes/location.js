import express from 'express';
import { getAllLocations } from '../controllers/locationController.js';
import {deleteLokasi} from '../controllers/locationController.js';
import { updateLokasi } from '../controllers/locationController.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.get('/locations', getAllLocations);
router.delete('/locations/:id', deleteLokasi)
router.put('/locations/:id',
    upload.fields([
      { name: 'placeholder', maxCount: 1 },
      { name: 'langkah_gambar' },
      { name: 'langkah_gif' }
    ]),
    updateLokasi
  );
  
export default router;

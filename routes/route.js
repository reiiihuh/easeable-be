import express from 'express';
import { getSlidesByLocation } from '../controllers/routeController.js';
import { updateRute } from '../controllers/routeController.js';
import multer from 'multer';
import { deleteRute } from '../controllers/routeController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// SLIDESHOW
router.get('/slides/:location_name', getSlidesByLocation);

// UPDATE RUTE ONLY
router.put('/slides/:id',
  upload.fields([
    { name: 'langkah_gambar', maxCount: 1 },
    { name: 'langkah_gif', maxCount: 1 }
  ]),
  updateRute
);

// DELETE RUTE ONLY
router.delete('/slides/:id', deleteRute);

export default router;
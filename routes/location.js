import express from 'express';
import { getAllLocations } from '../controllers/locationController.js';
import {deleteLokasi} from '../controllers/locationController.js';
import { updateLokasi } from '../controllers/locationController.js';

const router = express.Router();
router.get('/locations', getAllLocations);
router.delete('/locations/:id', deleteLokasi)
router.put('/locations/:id', updateLokasi)

export default router;

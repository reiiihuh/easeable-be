import express from 'express';
import { getSlidesByLocation } from '../controllers/routeController.js';
import { updateRute } from '../controllers/routeController.js';

const router = express.Router();

router.get('/slides/:location_name', getSlidesByLocation);
router.put('/slides/:id', updateRute)

export default router;
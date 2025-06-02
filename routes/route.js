import express from 'express';
import { getSlidesByLocation } from '../controllers/routeController.js';

const router = express.Router();

router.get('/slides/:location_name', getSlidesByLocation);

export default router;
import express from 'express';
import { submitResponFeedback } from '../controllers/notifikasiController.js';
import { getNotifikasiByMahasiswa } from '../controllers/notifikasiController.js';
import { getNotifikasiByAdmin } from '../controllers/notifikasiController.js';

const router = express.Router();

router.post('/submit', submitResponFeedback);
router.get('/:id_mahasiswa', getNotifikasiByMahasiswa);
router.get('/admin/:id_admin', getNotifikasiByAdmin);

export default router;

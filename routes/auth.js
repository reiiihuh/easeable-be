import express from 'express';
import { registerMahasiswa } from '../controllers/authController.js';
import { loginMahasiswa } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerMahasiswa);
router.post('/login', loginMahasiswa);

export default router;

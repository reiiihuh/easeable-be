import express from 'express';
import { registerAdmin } from '../controllers/adminController.js';
import { loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

export default router;

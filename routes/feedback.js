import express from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';
import { getAllFeedback } from '../controllers/feedbackController.js';

const router = express.Router();
router.post('/submit', submitFeedback);
router.get('/all', getAllFeedback); // GET semua feedback

export default router;
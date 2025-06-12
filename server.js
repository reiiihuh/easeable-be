import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import slideRoutes from './routes/route.js';
import locationRoutes from './routes/location.js';
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/feedback.js';



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', slideRoutes);
app.use('/api', locationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
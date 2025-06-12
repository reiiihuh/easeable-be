import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import slideRoutes from './routes/route.js';
import locationRoutes from './routes/location.js';
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/feedback.js';
import notifikasiRoutes from './routes/notifikasi.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', slideRoutes);
app.use('/api', locationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifikasi', notifikasiRoutes);
app.use('/api/admin', adminRoutes);


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
}); 
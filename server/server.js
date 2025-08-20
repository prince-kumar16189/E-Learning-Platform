import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { rsPool } from './src/db.js';
import authRoutes from './src/routes/auth.js';
import courseRoutes from './src/routes/courses.js';
import quizRoutes from './src/routes/quizzes.js';
import progressRoutes from './src/routes/progress.js';
import uploadRoutes from './src/routes/uploads.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.get('/api/health', async (req, res) => {
  try {
    await rsPool.query('SELECT 1');
    res.json({ ok: true, ping: 'pong' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/uploads', uploadRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

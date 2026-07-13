import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initDatabase } from './database';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import configRoutes from './routes/config';
import songRoutes from './routes/songs';
import messageRoutes from './routes/messages';
import aiRoutes from './routes/ai';
import uploadRoutes from './routes/uploads';
import profileRoutes from './routes/profile';
import knowledgeRoutes from './routes/knowledge';
import portfolioRoutes from './routes/portfolio';
import visitorRoutes from './routes/visitor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.env.PERSISTENT_DIR || process.cwd(), 'uploads');

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/config', configRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/visitor', visitorRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'API 不存在' });
      return;
    }
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || '服务器内部错误' });
});

async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Admin route is hidden from the public UI. Configure VITE_ADMIN_BASE for the private frontend path.');
  });
}

start().catch(error => {
  console.error(error);
  process.exit(1);
});

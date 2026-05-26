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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/config', configRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// Start server
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API documentation:`);
    console.log(`  POST /api/auth/login     - 登录`);
    console.log(`  GET  /api/posts          - 获取文章列表`);
    console.log(`  GET  /api/config         - 获取网站配置`);
    console.log(`  GET  /api/songs          - 获取音乐列表`);
    console.log(`  GET  /api/messages       - 获取留言`);
    console.log(`  POST /api/ai/chat        - AI对话`);
    console.log(`  GET  /api/health         - 健康检查`);
  });
}

start().catch(console.error);

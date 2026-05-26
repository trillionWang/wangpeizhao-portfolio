import { Router } from 'express';
import { findAll, insert, remove } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  res.json(findAll('songs'));
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, artist, cover, url } = req.body;
  insert('songs', { title, artist, cover: cover || '', url });
  res.json({ success: true, message: '音乐添加成功' });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const ok = remove('songs', (s: any) => String(s.id) === String(req.params.id));
  res.json({ success: ok, message: ok ? '音乐删除成功' : '音乐不存在' });
});

export default router;

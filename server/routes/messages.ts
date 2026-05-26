import { Router } from 'express';
import { findAll, insert, remove } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  res.json(findAll('messages'));
});

router.post('/', async (req, res) => {
  const { name, content } = req.body;
  if (!name?.trim() || !content?.trim()) {
    res.status(400).json({ error: '请填写昵称和留言内容' });
    return;
  }
  insert('messages', { name: name.trim(), content: content.trim(), date: new Date().toISOString().split('T')[0] });
  res.json({ success: true, message: '留言成功' });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const ok = remove('messages', (m: any) => String(m.id) === String(req.params.id));
  res.json({ success: ok, message: ok ? '留言删除成功' : '留言不存在' });
});

export default router;

import { Router } from 'express';
import { run, get, all } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/messages - 公开接口
router.get('/', async (req, res) => {
  try {
    const messages = await all('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: '获取留言失败' });
  }
});

// POST /api/messages - 公开接口（任何人可以留言）
router.post('/', async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name?.trim() || !content?.trim()) {
      res.status(400).json({ error: '请填写昵称和留言内容' });
      return;
    }
    const date = new Date().toISOString().split('T')[0];
    await run('INSERT INTO messages (name, content, date) VALUES (?, ?, ?)', [name.trim(), content.trim(), date]);
    res.json({ success: true, message: '留言成功' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '留言失败' });
  }
});

// DELETE /api/messages/:id - 需要认证（管理员删除）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await run('DELETE FROM messages WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '留言删除成功' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '删除失败' });
  }
});

export default router;

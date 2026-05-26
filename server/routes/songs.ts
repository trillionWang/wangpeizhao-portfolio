import { Router } from 'express';
import { run, get, all } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/songs - 公开接口
router.get('/', async (req, res) => {
  try {
    const songs = await all('SELECT * FROM songs ORDER BY created_at DESC');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: '获取音乐列表失败' });
  }
});

// POST /api/songs - 需要认证
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, artist, cover, url } = req.body;
    const result = await run('INSERT INTO songs (title, artist, cover, url) VALUES (?, ?, ?, ?)', [title, artist, cover || '', url]);
    res.json({ success: true, message: '音乐添加成功' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '添加失败' });
  }
});

// DELETE /api/songs/:id - 需要认证
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await run('DELETE FROM songs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '音乐删除成功' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '删除失败' });
  }
});

export default router;

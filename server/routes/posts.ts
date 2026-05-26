import { Router } from 'express';
import { run, get, all } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/posts - 公开接口
router.get('/', async (req, res) => {
  try {
    const posts = await all('SELECT * FROM posts WHERE published = 1 ORDER BY date DESC');
    res.json(posts.map(p => ({
      ...p,
      tags: JSON.parse(p.tags || '[]'),
    })));
  } catch (err) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// GET /api/posts/:slug - 公开接口
router.get('/:slug', async (req, res) => {
  try {
    const post = await get('SELECT * FROM posts WHERE slug = ?', [req.params.slug]);
    if (!post) {
      res.status(404).json({ error: '文章不存在' });
      return;
    }
    res.json({ ...post, tags: JSON.parse(post.tags || '[]') });
  } catch (err) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// POST /api/posts - 需要认证
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, slug, content, summary, date, category, tags, word_count, read_time } = req.body;
    await run(
      'INSERT INTO posts (title, slug, content, summary, date, category, tags, word_count, read_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, content, summary, date, category, JSON.stringify(tags || []), word_count || 0, read_time || 0]
    );
    res.json({ success: true, message: '文章创建成功' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '创建文章失败' });
  }
});

// PUT /api/posts/:id - 需要认证
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, slug, content, summary, date, category, tags, word_count, read_time, published } = req.body;
    await run(
      'UPDATE posts SET title = ?, slug = ?, content = ?, summary = ?, date = ?, category = ?, tags = ?, word_count = ?, read_time = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, slug, content, summary, date, category, JSON.stringify(tags || []), word_count || 0, read_time || 0, published ?? 1, req.params.id]
    );
    res.json({ success: true, message: '文章更新成功' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '更新文章失败' });
  }
});

// DELETE /api/posts/:id - 需要认证
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await run('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '文章删除成功' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '删除文章失败' });
  }
});

export default router;

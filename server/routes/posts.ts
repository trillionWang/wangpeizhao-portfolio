import { Router } from 'express';
import { findAll, insert, update, remove } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  const posts = findAll('posts').filter((p: any) => p.published !== 0);
  res.json(posts.map((p: any) => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] })));
});

router.get('/:slug', async (req, res) => {
  const posts = findAll('posts');
  const post = posts.find((p: any) => p.slug === req.params.slug);
  if (!post) {
    res.status(404).json({ error: '文章不存在' });
    return;
  }
  res.json({ ...post, tags: Array.isArray(post.tags) ? post.tags : [] });
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, slug, content, summary, date, category, tags, word_count, read_time } = req.body;
  insert('posts', {
    title, slug, content, summary, date, category,
    tags: Array.isArray(tags) ? tags : [],
    word_count: word_count || 0, read_time: read_time || 0, published: 1,
  });
  res.json({ success: true, message: '文章创建成功' });
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, slug, content, summary, date, category, tags, word_count, read_time, published } = req.body;
  const ok = update('posts', (p: any) => String(p.id) === String(req.params.id), {
    title, slug, content, summary, date, category,
    tags: Array.isArray(tags) ? tags : [],
    word_count: word_count || 0, read_time: read_time || 0, published: published ?? 1,
  });
  res.json({ success: ok, message: ok ? '文章更新成功' : '文章不存在' });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const ok = remove('posts', (p: any) => String(p.id) === String(req.params.id));
  res.json({ success: ok, message: ok ? '文章删除成功' : '文章不存在' });
});

export default router;

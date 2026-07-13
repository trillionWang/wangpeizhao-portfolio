import { Router } from 'express';
import { findAll, insert, update, remove, PostRecord } from '../database';
import { authMiddleware, verifyToken } from '../middleware/auth';

const router = Router();

function canSeeAll(req: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  return token ? !!verifyToken(token) : false;
}

function normalizeBody(body: any) {
  const content = body.content || '';
  const wordCount = Number(body.word_count) || content.replace(/\s/g, '').length || 0;
  return {
    title: body.title || '未命名文章',
    slug: body.slug || `post-${Date.now()}`,
    content,
    summary: body.summary || content.slice(0, 120),
    date: body.date || new Date().toISOString().split('T')[0],
    category: body.category || '生活随笔',
    tags: Array.isArray(body.tags) ? body.tags : [],
    cover: body.cover || '',
    word_count: wordCount,
    read_time: Number(body.read_time) || Math.max(1, Math.ceil(wordCount / 350)),
    published: body.published ?? 1,
  };
}

router.get('/', async (req, res) => {
  const posts = findAll<PostRecord>('posts')
    .filter(post => canSeeAll(req) || post.published !== 0)
    .sort((a, b) => b.date.localeCompare(a.date));
  res.json(posts);
});

router.get('/:slug', async (req, res) => {
  const post = findAll<PostRecord>('posts').find(item => item.slug === req.params.slug);
  if (!post || (post.published === 0 && !canSeeAll(req))) {
    res.status(404).json({ error: '文章不存在' });
    return;
  }
  res.json(post);
});

router.post('/', authMiddleware, async (req, res) => {
  const created = insert<PostRecord>('posts', {
    id: 0,
    ...normalizeBody(req.body),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  res.json({ success: true, message: '文章创建成功', post: created });
});

router.put('/:id', authMiddleware, async (req, res) => {
  const ok = update('posts', post => String(post.id) === String(req.params.id), normalizeBody(req.body));
  res.json({ success: ok, message: ok ? '文章更新成功' : '文章不存在' });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const ok = remove('posts', post => String(post.id) === String(req.params.id));
  res.json({ success: ok, message: ok ? '文章删除成功' : '文章不存在' });
});

export default router;

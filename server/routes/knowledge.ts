import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { findAll, insert, update, remove, KnowledgeRecord } from '../database';

const router = Router();
router.use(authMiddleware);

router.get('/', (_req, res) => {
  res.json(findAll<KnowledgeRecord>('knowledge').sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
});

router.post('/', (req, res) => {
  const { title, category, content, tags, public: isPublic } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: '请填写标题和内容' });
    return;
  }

  const item = insert<KnowledgeRecord>('knowledge', {
    id: 0,
    title,
    category: category || 'other',
    content,
    tags: Array.isArray(tags) ? tags : [],
    public: isPublic ?? 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  res.json({ success: true, item });
});

router.put('/:id', (req, res) => {
  const ok = update('knowledge', item => String(item.id) === String(req.params.id), {
    ...req.body,
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
  });
  res.json({ success: ok, message: ok ? '知识已更新' : '知识不存在' });
});

router.delete('/:id', (req, res) => {
  const ok = remove('knowledge', item => String(item.id) === String(req.params.id));
  res.json({ success: ok, message: ok ? '知识已删除' : '知识不存在' });
});

export default router;

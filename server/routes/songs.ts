import { Router } from 'express';
import { findAll, insert, remove, SongRecord } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  res.json(findAll<SongRecord>('songs').sort((a, b) => b.created_at.localeCompare(a.created_at)));
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, artist, cover, url } = req.body;
  if (!title || !url) {
    res.status(400).json({ error: '请填写歌曲名称和音频地址' });
    return;
  }

  const song = insert<SongRecord>('songs', {
    id: 0,
    title,
    artist: artist || '未知歌手',
    cover: cover || '',
    url,
    created_at: new Date().toISOString(),
  });
  res.json({ success: true, message: '音乐添加成功', song });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const ok = remove('songs', song => String(song.id) === String(req.params.id));
  res.json({ success: ok, message: ok ? '音乐删除成功' : '音乐不存在' });
});

export default router;

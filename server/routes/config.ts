import { Router } from 'express';
import { run, get } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/config - 公开接口
router.get('/', async (req, res) => {
  try {
    const config = await get('SELECT id, avatar, author, nickname, bio, subtitle, announcement, github, email, created_at, updated_at FROM site_config WHERE id = 1');
    res.json(config || {});
  } catch (err) {
    res.status(500).json({ error: '获取配置失败' });
  }
});

// PUT /api/config - 需要认证
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { avatar, author, nickname, bio, subtitle, announcement, github, email } = req.body;
    await run(
      `UPDATE site_config SET
        avatar = COALESCE(?, avatar),
        author = COALESCE(?, author),
        nickname = COALESCE(?, nickname),
        bio = COALESCE(?, bio),
        subtitle = COALESCE(?, subtitle),
        announcement = COALESCE(?, announcement),
        github = COALESCE(?, github),
        email = COALESCE(?, email),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`,
      [avatar, author, nickname, bio, subtitle, announcement, github, email]
    );
    res.json({ success: true, message: '配置更新成功' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '更新配置失败' });
  }
});

// GET /api/config/ai-key - 需要认证（只返回是否有key，不返回key本身）
router.get('/ai-key', authMiddleware, async (req, res) => {
  try {
    const config = await get('SELECT deepseek_key FROM site_config WHERE id = 1');
    res.json({ hasKey: !!(config?.deepseek_key) });
  } catch (err) {
    res.status(500).json({ error: '获取AI配置失败' });
  }
});

// PUT /api/config/ai-key - 需要认证
router.put('/ai-key', authMiddleware, async (req, res) => {
  try {
    const { deepseek_key } = req.body;
    await run('UPDATE site_config SET deepseek_key = ? WHERE id = 1', [deepseek_key]);
    res.json({ success: true, message: 'AI Key更新成功' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '更新失败' });
  }
});

export default router;

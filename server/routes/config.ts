import { Router } from 'express';
import { getConfig, setConfig } from '../database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const config = getConfig();
  const { deepseek_key: _deepseekKey, ...safe } = config;
  res.json(safe);
});

router.put('/', authMiddleware, async (req, res) => {
  const {
    brand,
    avatar,
    author,
    nickname,
    bio,
    subtitle,
    announcement,
    github,
    email,
    location,
    targetRole,
    heroImage,
  } = req.body;
  setConfig({ brand, avatar, author, nickname, bio, subtitle, announcement, github, email, location, targetRole, heroImage });
  res.json({ success: true, message: '配置更新成功' });
});

router.get('/ai-key', authMiddleware, async (_req, res) => {
  const config = getConfig();
  res.json({ hasKey: !!config.deepseek_key });
});

router.put('/ai-key', authMiddleware, async (req, res) => {
  const { deepseek_key } = req.body;
  setConfig({ deepseek_key });
  res.json({ success: true, message: 'AI Key 更新成功' });
});

export default router;

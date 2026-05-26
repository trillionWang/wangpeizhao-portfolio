import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { findOne } from '../database';
import { generateToken } from '../middleware/auth';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: '请填写用户名和密码' });
    return;
  }
  const user = findOne('users', (u: any) => u.username === username);
  if (!user) {
    res.status(401).json({ error: '用户名或密码错误' });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: '用户名或密码错误' });
    return;
  }
  const token = generateToken(username);
  res.json({ token, username });
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: '未登录' });
    return;
  }
  const { verifyToken } = await import('../middleware/auth');
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: '登录已过期' });
    return;
  }
  res.json({ username: decoded.username });
});

export default router;

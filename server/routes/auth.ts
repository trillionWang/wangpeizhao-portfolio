import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { findOne } from '../database';
import { generateToken, verifyToken } from '../middleware/auth';

const router = Router();
const attempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 60_000;

function attemptKey(req: any, username: string) {
  return `${req.ip || 'unknown'}:${username || 'anonymous'}`;
}

function isLocked(key: string) {
  const state = attempts.get(key);
  return !!state && state.lockedUntil > Date.now();
}

function recordFailure(key: string) {
  const state = attempts.get(key) || { count: 0, lockedUntil: 0 };
  state.count += 1;
  if (state.count >= MAX_ATTEMPTS) {
    state.lockedUntil = Date.now() + LOCK_MS;
    state.count = 0;
  }
  attempts.set(key, state);
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const key = attemptKey(req, username);

  if (isLocked(key)) {
    res.status(429).json({ error: '登录失败次数过多，请稍后再试' });
    return;
  }

  if (!username || !password) {
    res.status(400).json({ error: '请填写用户名和密码' });
    return;
  }

  const user = findOne('users', (item: any) => item.username === username);
  const valid = user ? await bcrypt.compare(password, user.password) : false;

  if (!valid) {
    recordFailure(key);
    res.status(401).json({ error: '用户名或密码错误' });
    return;
  }

  attempts.delete(key);
  res.json({ token: generateToken(username), username });
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: '未登录' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: '登录已过期' });
    return;
  }

  res.json({ username: decoded.username });
});

export default router;

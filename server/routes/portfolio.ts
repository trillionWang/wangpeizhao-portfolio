import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { findAll, insert, update, remove, PortfolioProjectRecord, SkillRecord } from '../database';

const router = Router();
router.use(authMiddleware);

router.get('/projects', (_req, res) => {
  res.json(findAll<PortfolioProjectRecord>('projects').sort((a, b) => a.sort - b.sort));
});

router.post('/projects', (req, res) => {
  const project = insert<PortfolioProjectRecord>('projects', normalizeProject(req.body));
  res.json({ success: true, project });
});

router.put('/projects/:id', (req, res) => {
  const ok = update('projects', project => String(project.id) === String(req.params.id), normalizeProject(req.body));
  res.json({ success: ok, message: ok ? '项目已更新' : '项目不存在' });
});

router.delete('/projects/:id', (req, res) => {
  const ok = remove('projects', project => String(project.id) === String(req.params.id));
  res.json({ success: ok, message: ok ? '项目已删除' : '项目不存在' });
});

router.get('/skills', (_req, res) => {
  res.json(findAll<SkillRecord>('skills').sort((a, b) => a.sort - b.sort));
});

router.post('/skills', (req, res) => {
  const skill = insert<SkillRecord>('skills', normalizeSkill(req.body));
  res.json({ success: true, skill });
});

router.put('/skills/:id', (req, res) => {
  const ok = update('skills', skill => String(skill.id) === String(req.params.id), normalizeSkill(req.body));
  res.json({ success: ok, message: ok ? '技能已更新' : '技能不存在' });
});

router.delete('/skills/:id', (req, res) => {
  const ok = remove('skills', skill => String(skill.id) === String(req.params.id));
  res.json({ success: ok, message: ok ? '技能已删除' : '技能不存在' });
});

function list(value: any) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split('\n').map(item => item.trim()).filter(Boolean);
  return [];
}

function normalizeProject(body: any): PortfolioProjectRecord {
  return {
    id: Number(body.id) || 0,
    title: body.title || '未命名项目',
    role: body.role || '负责人',
    summary: body.summary || '',
    description: body.description || '',
    techStack: list(body.techStack),
    highlights: list(body.highlights),
    challenges: list(body.challenges),
    outcomes: list(body.outcomes),
    repoUrl: body.repoUrl || '',
    demoUrl: body.demoUrl || '',
    cover: body.cover || '',
    status: body.status || 'completed',
    featured: body.featured ?? 1,
    public: body.public ?? 1,
    sort: Number(body.sort) || 0,
    created_at: body.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function normalizeSkill(body: any): SkillRecord {
  return {
    id: Number(body.id) || 0,
    name: body.name || 'Skill',
    category: body.category || '后端',
    level: Number(body.level) || 70,
    keywords: list(body.keywords),
    description: body.description || '',
    public: body.public ?? 1,
    sort: Number(body.sort) || 0,
  };
}

export default router;

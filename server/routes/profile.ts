import { Router } from 'express';
import { findAll, getPublicProfile, PortfolioProjectRecord, SkillRecord } from '../database';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getPublicProfile());
});

router.get('/projects', (_req, res) => {
  const projects = findAll<PortfolioProjectRecord>('projects')
    .filter(project => project.public !== 0)
    .sort((a, b) => a.sort - b.sort);
  res.json(projects);
});

router.get('/skills', (_req, res) => {
  const skills = findAll<SkillRecord>('skills')
    .filter(skill => skill.public !== 0)
    .sort((a, b) => a.sort - b.sort);
  res.json(skills);
});

export default router;

import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Github, Loader2, Layers } from 'lucide-react';
import PageLayout from '../sections/PageLayout';
import Footer from '../sections/Footer';
import { getPublicProjects, getPublicSkills } from '../lib/api';

interface Project {
  id: number;
  title: string;
  role: string;
  summary: string;
  description: string;
  techStack: string[];
  highlights: string[];
  challenges: string[];
  outcomes: string[];
  repoUrl: string;
  demoUrl: string;
  cover: string;
  status: 'completed' | 'in-progress';
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  keywords: string[];
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getPublicProjects().then(data => setProjects(Array.isArray(data) ? data : [])).catch(() => {});
    getPublicSkills().then(data => setSkills(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  return (
    <PageLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">项目与能力</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">面向秋招展示的项目实践、工程能力和技术栈。</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="公开项目" value={projects.length} />
          <Stat label="已完成" value={projects.filter(project => project.status === 'completed').length} tone="green" />
          <Stat label="技能项" value={skills.length} tone="blue" />
          <Stat label="核心方向" value={new Set(skills.map(skill => skill.category)).size} tone="amber" />
        </div>

        <div className="space-y-5">
          {projects.map(project => (
            <article key={project.id} className="overflow-hidden rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5">
              <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
                <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-emerald-500 via-slate-900 to-cyan-900">
                  {project.cover ? <img src={project.cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-6xl font-black text-white/80">{project.title[0]}</div>}
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#4ade80]/10 text-[#16a34a]">
                      {project.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Loader2 className="w-3 h-3" />}
                      {project.status === 'completed' ? '已完成' : '进行中'}
                    </span>
                    <span className="text-xs text-gray-500">{project.role}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-7">{project.description || project.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-2.5 py-1 rounded-lg bg-[#4ade80]/10 text-xs text-[#16a34a]">{tech}</span>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ListBlock title="亮点" items={project.highlights} />
                    <ListBlock title="难点" items={project.challenges} />
                    <ListBlock title="成果" items={project.outcomes} />
                  </div>

                  <div className="mt-4 flex gap-3">
                    {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#16a34a]"><Github className="w-4 h-4" />仓库</a>}
                    {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#16a34a]"><ExternalLink className="w-4 h-4" />演示</a>}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#4ade80]" />
            技术栈
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.map(skill => (
              <div key={skill.id} className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#16a34a]">{skill.category}</span>
                  <span className="text-gray-500">{skill.level}%</span>
                </div>
                <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-6">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
}

function Stat({ label, value, tone = 'gray' }: { label: string; value: number; tone?: 'gray' | 'green' | 'blue' | 'amber' }) {
  const color = tone === 'green' ? 'text-[#4ade80]' : tone === 'blue' ? 'text-blue-400' : tone === 'amber' ? 'text-amber-400' : 'text-gray-900 dark:text-white';
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-3">
      <h3 className="text-xs font-semibold text-gray-500 mb-2">{title}</h3>
      <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
        {(items.length ? items : ['待补充']).slice(0, 3).map(item => <li key={item}>· {item}</li>)}
      </ul>
    </div>
  );
}

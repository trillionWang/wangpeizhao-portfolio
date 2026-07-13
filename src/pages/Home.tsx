import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpenText,
  Briefcase,
  ChevronRight,
  Code2,
  FileText,
  FolderOpen,
  Github,
  Mail,
  MapPin,
  MessageSquare,
  Rocket,
  Sparkles,
  Tag,
  Trophy,
} from 'lucide-react';
import Hero from '../sections/Hero';
import Footer from '../sections/Footer';
import PostCard from '../sections/PostCard';
import Calendar from '../sections/Calendar';
import Terminal from '../sections/Terminal';
import { getProfile } from '../lib/api';
import { useConfig } from '../hooks/useConfig';
import { usePosts } from '../hooks/usePosts';

interface Project {
  id: number;
  title: string;
  role: string;
  summary: string;
  techStack: string[] | string;
  highlights?: string[] | string;
  repoUrl?: string;
  demoUrl?: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  description: string;
}

function toList(value: string[] | string | undefined) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(/[\n,，;；|]+/).map(item => item.trim()).filter(Boolean);
  return [];
}

export default function Home() {
  const { config } = useConfig();
  const { posts, loading } = usePosts();
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getProfile()
      .then(data => {
        setProjects(Array.isArray(data.projects) ? data.projects : []);
        setSkills(Array.isArray(data.skills) ? data.skills : []);
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const result: Record<string, number> = {};
    posts.forEach(post => {
      const category = post.category || '默认';
      result[category] = (result[category] || 0) + 1;
    });
    return result;
  }, [posts]);

  const tags = useMemo(() => {
    const all = posts.flatMap(post => toList(post.tags as any));
    return Array.from(new Set(all)).slice(0, 20);
  }, [posts]);

  const featuredProjects = projects.slice(0, 4);
  const visibleSkills = skills.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f4f5f2] text-gray-900 transition-colors duration-300 dark:bg-[#070907] dark:text-white">
      <Hero config={config} />

      <main className="mx-auto grid w-full max-w-[1840px] grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_320px] 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside className="order-2 space-y-5 lg:order-1">
          <ProfileCard config={config} />
          <InfoCard title="公告" icon={Bell}>
            <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">{config.announcement}</p>
          </InfoCard>
          <InfoCard title="分类" icon={FolderOpen}>
            <div className="space-y-1.5">
              {Object.entries(categories).length ? Object.entries(categories).map(([name, count]) => (
                <Link key={name} to={`/archive?category=${encodeURIComponent(name)}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-[#4ade80]/10 hover:text-[#16a34a] dark:text-gray-400">
                  <span className="flex min-w-0 items-center gap-1">
                    <ChevronRight className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{name}</span>
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-white/5">{count}</span>
                </Link>
              )) : <p className="text-sm text-gray-500">暂无分类</p>}
            </div>
          </InfoCard>
          <InfoCard title="标签" icon={Tag}>
            <div className="flex flex-wrap gap-2">
              {tags.length ? tags.map(tag => (
                <span key={tag} className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-400">#{tag}</span>
              )) : <span className="text-sm text-gray-500">暂无标签</span>}
            </div>
          </InfoCard>
        </aside>

        <section className="order-1 min-w-0 space-y-5 lg:order-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Metric icon={Briefcase} label="目标岗位" value={config.targetRole || 'Java 后端开发'} />
            <Metric icon={Code2} label="技能方向" value={`${skills.length || 4} 项能力`} />
            <Metric icon={FileText} label="记录内容" value={`${posts.length} 篇文章`} />
          </div>

          <Panel>
            <SectionHead icon={Trophy} title="重点项目" to="/projects" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {featuredProjects.length ? featuredProjects.map(project => (
                <Link key={project.id} to="/projects" className="group flex min-h-[210px] flex-col rounded-xl border border-gray-200/70 bg-gray-50 p-4 transition-all hover:-translate-y-0.5 hover:border-[#4ade80]/45 hover:bg-[#4ade80]/5 hover:shadow-lg hover:shadow-[#4ade80]/10 dark:border-white/5 dark:bg-white/[0.03]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-lg bg-[#4ade80]/10 px-2 py-1 text-xs font-medium text-[#16a34a]">{project.role || '项目负责人'}</div>
                    <Rocket className="h-4 w-4 text-gray-400 transition-colors group-hover:text-[#4ade80]" />
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-[#16a34a] dark:text-white">{project.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {toList(project.techStack).slice(0, 5).map(tech => (
                      <span key={tech} className="rounded-md bg-white px-2 py-0.5 text-xs text-gray-600 shadow-sm dark:bg-black/20 dark:text-gray-300">{tech}</span>
                    ))}
                  </div>
                </Link>
              )) : (
                <EmptyState text="在 src/data/portfolio.ts 中添加项目后会展示在这里。" />
              )}
            </div>
          </Panel>

          <Panel>
            <SectionHead icon={BookOpenText} title="最新文章 / 记录" to="/archive" />
            <div className="space-y-4">
              {loading ? (
                <EmptyState text="正在加载文章..." />
              ) : posts.length ? (
                posts.slice(0, 8).map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <EmptyState text="暂无文章，在 src/data/posts.ts 中添加后会显示在这里。" />
              )}
            </div>
          </Panel>
        </section>

        <aside className="order-3 hidden space-y-5 xl:block">
          <div className="sticky top-20 space-y-5">
            <InfoCard title="能力速览" icon={Sparkles} dark>
              <div className="space-y-3">
                {visibleSkills.length ? visibleSkills.map(skill => (
                  <div key={skill.id}>
                    <div className="mb-1 flex justify-between gap-3 text-xs">
                      <span className="truncate text-gray-200">{skill.name}</span>
                      <span className="text-[#4ade80]">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#4ade80] to-cyan-300" style={{ width: `${Math.min(100, skill.level)}%` }} />
                    </div>
                  </div>
                )) : <p className="text-sm text-gray-500">在 src/data/portfolio.ts 中添加技能后会展示在这里。</p>}
              </div>
            </InfoCard>

            <InfoCard title="快速入口" icon={MessageSquare}>
              <div className="grid grid-cols-2 gap-2">
                <QuickLink to="/projects" icon={Briefcase} label="项目" />
                <QuickLink to="/archive" icon={FileText} label="文章" />
                <QuickLink to="/albums" icon={FolderOpen} label="相册" />
                <QuickLink to="/messageboard" icon={MessageSquare} label="留言" />
              </div>
            </InfoCard>

            <Calendar />
            <Terminal />
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}

function ProfileCard({ config }: { config: any }) {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-5 text-center shadow-sm dark:border-white/5 dark:bg-[#151515]">
      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-3xl font-black text-white">
        {config.avatar ? <img src={config.avatar} alt="" className="h-full w-full object-cover" /> : (config.author || 'W').charAt(0)}
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{config.author || '王沛钊'}</h2>
      <p className="mt-1 text-sm font-medium text-[#16a34a]">{config.nickname || '@trillionWang'}</p>
      <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{config.bio}</p>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
        <MapPin className="h-3.5 w-3.5" />
        {config.location || '中国'}
      </div>
      <div className="mt-4 flex justify-center gap-3">
        {config.github && <a href={config.github} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:text-[#16a34a] dark:bg-white/5 dark:text-gray-400" aria-label="GitHub"><Github className="h-4 w-4" /></a>}
        {config.email && <a href={`mailto:${config.email}`} className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:text-[#16a34a] dark:bg-white/5 dark:text-gray-400" aria-label="Email"><Mail className="h-4 w-4" /></a>}
      </div>
    </div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#111512]">
      {children}
    </div>
  );
}

function InfoCard({ title, icon: Icon, children, dark = false }: { title: string; icon: LucideIcon; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${dark ? 'border-[#4ade80]/20 bg-[#07110d] text-white' : 'border-gray-200/70 bg-white dark:border-white/5 dark:bg-[#151515]'}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#16a34a] dark:text-[#4ade80]" />
        <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#151515]">
      <Icon className="mb-3 h-5 w-5 text-[#16a34a] dark:text-[#4ade80]" />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 line-clamp-1 font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function SectionHead({ icon: Icon, title, to }: { icon: LucideIcon; title: string; to?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
        <Icon className="h-5 w-5 text-[#16a34a] dark:text-[#4ade80]" />
        {title}
      </h2>
      {to && <Link to={to} className="text-sm text-gray-500 hover:text-[#16a34a]">更多</Link>}
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <Link to={to} className="flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-[#4ade80]/10 hover:text-[#16a34a] dark:bg-white/5 dark:text-gray-400">
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500 dark:border-white/10">{text}</div>;
}

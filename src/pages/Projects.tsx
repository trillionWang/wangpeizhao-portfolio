import { FolderOpen, CheckCircle2, Loader2, Layers } from 'lucide-react';
import { projects } from '../data/content';
import PageLayout from '../sections/PageLayout';
import Footer from '../sections/Footer';

export default function Projects() {
  const completed = projects.filter(p => p.status === 'completed');
  const inProgress = projects.filter(p => p.status === 'in-progress');
  const allTech = [...new Set(projects.flatMap(p => p.techStack))];

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">学习记录</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Studying~</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">项目总数</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 text-center">
            <p className="text-2xl font-bold text-[#4ade80]">{completed.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">已完成</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 text-center">
            <p className="text-2xl font-bold text-amber-400">{inProgress.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">进行中</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 text-center">
            <p className="text-2xl font-bold text-blue-400">{allTech.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">技术栈统计</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#4ade80]" />
            项目
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 overflow-hidden hover:border-[#4ade80]/30 transition-all group"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                    {project.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-500">
                        <CheckCircle2 className="w-3 h-3" />
                        已完成
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-500">
                        <Loader2 className="w-3 h-3" />
                        进行中
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-[#4ade80]/10 text-xs text-[#4ade80]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Tree */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#4ade80]" />
            技能树
          </h2>
          <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
            <div className="flex flex-wrap gap-3">
              {allTech.map(tech => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-[#4ade80]/20 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
}

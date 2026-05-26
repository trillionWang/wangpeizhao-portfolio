import {
  Github, Mail, Bell,
  FolderOpen, Tag, ChevronRight
} from 'lucide-react';
import { siteConfig, categories, tags, announcements } from '../data/posts';
import Calendar from './Calendar';

interface SidebarProps {
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
}

export default function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5 text-center">
        <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-green-600 mb-3">
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
            {siteConfig.author.charAt(0)}
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{siteConfig.author}</h3>
        <p className="text-sm text-[#4ade80] font-medium mt-0.5">{siteConfig.nickname}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{siteConfig.bio}</p>
        <div className="flex justify-center gap-3 mt-3">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={siteConfig.social.email}
            className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Announcement */}
      <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-[#4ade80]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{announcements.title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {announcements.content}
        </p>
      </div>

      {/* Categories */}
      <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="w-4 h-4 text-[#4ade80]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">分类</h3>
        </div>
        <div className="space-y-1.5">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => onCategoryChange?.(cat.name === activeCategory ? '' : cat.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                activeCategory === cat.name
                  ? 'bg-[#4ade80]/10 text-[#4ade80]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-[#4ade80]/5 hover:text-[#4ade80]'
              }`}
            >
              <span className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3" />
                {cat.name}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeCategory === cat.name
                  ? 'bg-[#4ade80]/20 text-[#4ade80]'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-[#4ade80]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">标签</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => {}}
              className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-[#4ade80]/10 hover:text-[#4ade80] transition-all border border-gray-200 dark:border-white/5 hover:border-[#4ade80]/30"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <Calendar />
    </aside>
  );
}

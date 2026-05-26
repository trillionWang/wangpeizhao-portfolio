import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Github, Mail, Bell, FolderOpen, Tag, ChevronRight,
  Monitor, Cpu, Globe
} from 'lucide-react';
import { siteConfig, categories, tags } from '../data/posts';
import Calendar from './Calendar';
import Terminal from './Terminal';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  const location = useLocation();
  const [visitorInfo, setVisitorInfo] = useState({
    os: 'Unknown',
    browser: 'Unknown',
    device: 'Desktop',
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';
    let device = 'Desktop';

    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) { os = 'Android'; device = 'Mobile'; }
    else if (ua.includes('iPhone') || ua.includes('iPad')) { os = 'iOS'; device = 'Mobile'; }

    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';

    setVisitorInfo({ os, browser, device });
  }, []);

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300 pt-14">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-6 order-2 lg:order-1">
            {/* Profile Card */}
            <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5 text-center">
              <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-green-600 mb-3 flex items-center justify-center text-3xl font-bold text-white">
                {siteConfig.author.charAt(0)}
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
                <h3 className="font-semibold text-gray-900 dark:text-white">公告</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                欢迎来到我的博客！目前正在寻找 Java 后端开发工程师的实习/全职机会。
              </p>
              <Link
                to="/about"
                className="inline-block mt-3 px-4 py-1.5 text-xs rounded-lg bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20 transition-colors"
              >
                了解更多
              </Link>
            </div>

            {/* Categories */}
            <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <FolderOpen className="w-4 h-4 text-[#4ade80]" />
                <h3 className="font-semibold text-gray-900 dark:text-white">分类</h3>
              </div>
              <div className="space-y-1.5">
                {categories.filter(c => c.count > 0).map(cat => (
                  <Link
                    key={cat.name}
                    to={`/archive?category=${cat.name}`}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-[#4ade80]/5 hover:text-[#4ade80] transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" />
                      {cat.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500">
                      {cat.count}
                    </span>
                  </Link>
                ))}
                <Link
                  to="/archive"
                  className="block text-center text-xs text-gray-400 hover:text-[#4ade80] transition-colors pt-1"
                >
                  更多
                </Link>
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
                  <Link
                    key={tag}
                    to={`/archive?tag=${tag}`}
                    className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-[#4ade80]/10 hover:text-[#4ade80] transition-all border border-gray-200 dark:border-white/5 hover:border-[#4ade80]/30"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Visitor Info */}
            <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-[#4ade80]" />
                <h3 className="font-semibold text-gray-900 dark:text-white">访客信息</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">操作系统</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{visitorInfo.os}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">设备类型</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{visitorInfo.device}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">浏览器</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{visitorInfo.browser}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <Calendar />

            {/* Terminal - only on home */}
            {isHome && <Terminal />}
          </aside>

          {/* Main Content */}
          <div className="order-1 lg:order-2">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

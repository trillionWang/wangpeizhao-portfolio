import { useState, useMemo } from 'react';
import Hero from '../sections/Hero';
import PostCard from '../sections/PostCard';
import Terminal from '../sections/Terminal';
import Footer from '../sections/Footer';
import { usePosts } from '../hooks/usePosts';
import { useConfig } from '../hooks/useConfig';

export default function Home() {
  const { posts, loading } = usePosts();
  const { config } = useConfig();
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = useMemo(() => {
    const cats: Record<string, number> = { '全部': posts.length };
    posts.forEach(p => {
      cats[p.category] = (cats[p.category] || 0) + 1;
    });
    return cats;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === '全部') return posts;
    return posts.filter(p => p.category === activeCategory);
  }, [activeCategory, posts]);

  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300">
      <Hero config={config} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <div className="order-2 lg:order-1 space-y-6">
            <SidebarContent config={config} categories={categories} />
            <Terminal />
          </div>

          {/* Main Content */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(categories).map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-[#4ade80] text-black'
                      : 'bg-white dark:bg-[#151515] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:border-[#4ade80]/30 hover:text-[#4ade80]'
                  }`}
                >
                  {cat}
                  <span className={`text-xs ${activeCategory === cat ? 'text-black/60' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Post List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-gray-500">加载中...</div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="text-center py-12 text-gray-500">暂无文章</div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState as useState2, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Github, Mail, Bell, FolderOpen, ChevronRight,
  Monitor, Cpu, Globe
} from 'lucide-react';
import Calendar from '../sections/Calendar';

function SidebarContent({ config, categories }: { config: any; categories: Record<string, number> }) {
  const [visitorInfo, setVisitorInfo] = useState2({
    os: 'Unknown', browser: 'Unknown', device: 'Desktop',
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    let os = 'Unknown OS', browser = 'Unknown Browser', device = 'Desktop';
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

  return (
    <>
      {/* Profile Card */}
      <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5 text-center">
        <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-green-600 mb-3 flex items-center justify-center text-3xl font-bold text-white">
          {config?.avatar ? (
            <img src={config.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            (config?.author || 'R').charAt(0)
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{config?.author || '作者'}</h3>
        <p className="text-sm text-[#4ade80] font-medium mt-0.5">{config?.nickname || '@Rua'}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{config?.bio || '简介'}</p>
        <div className="flex justify-center gap-3 mt-3">
          {config?.github && (
            <a href={config.github} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all">
              <Github className="w-4 h-4" />
            </a>
          )}
          {config?.email && (
            <a href={`mailto:${config.email}`}
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all">
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Announcement */}
      <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-[#4ade80]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">公告</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {config?.announcement || '欢迎来到博客！'}
        </p>
      </div>

      {/* Categories */}
      <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="w-4 h-4 text-[#4ade80]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">分类</h3>
        </div>
        <div className="space-y-1.5">
          {Object.entries(categories).filter(([name]) => name !== '全部').map(([name, count]) => (
            <Link key={name} to={`/archive?category=${name}`}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-[#4ade80]/5 hover:text-[#4ade80] transition-all">
              <span className="flex items-center gap-2"><ChevronRight className="w-3 h-3" />{name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500">{count}</span>
            </Link>
          ))}
          <Link to="/archive" className="block text-center text-xs text-gray-400 hover:text-[#4ade80] transition-colors pt-1">更多</Link>
        </div>
      </div>

      {/* Visitor Info */}
      <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-[#4ade80]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">访客信息</h3>
        </div>
        <div className="space-y-3">
          {[
            { icon: Monitor, label: '操作系统', value: visitorInfo.os },
            { icon: Cpu, label: '设备类型', value: visitorInfo.device },
            { icon: Globe, label: '浏览器', value: visitorInfo.browser },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Calendar />
    </>
  );
}

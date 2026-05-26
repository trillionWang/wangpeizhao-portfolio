import { useState, useEffect } from 'react';
import { FileText, Music, MessageSquare, Eye } from 'lucide-react';
import { getPosts, getSongs, getMessages } from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: 0, songs: 0, messages: 0 });

  useEffect(() => {
    async function loadStats() {
      const [posts, songs, messages] = await Promise.all([
        getPosts(),
        getSongs(),
        getMessages(),
      ]);
      setStats({
        posts: Array.isArray(posts) ? posts.length : 0,
        songs: Array.isArray(songs) ? songs.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
      });
    }
    loadStats();
  }, []);

  const statCards = [
    { label: '文章', value: stats.posts, icon: FileText, color: 'text-blue-400' },
    { label: '音乐', value: stats.songs, icon: Music, color: 'text-green-400' },
    { label: '留言', value: stats.messages, icon: MessageSquare, color: 'text-amber-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="rounded-2xl bg-[#151515] border border-white/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-6 h-6 ${card.color}`} />
              <Eye className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#151515] border border-white/5 p-6">
        <h2 className="text-lg font-semibold mb-4">使用指南</h2>
        <div className="space-y-3 text-sm text-gray-400">
          <p className="flex items-start gap-2">
            <span className="text-[#4ade80] mt-0.5">1.</span>
            <span><strong className="text-gray-200">文章管理</strong> - 创建、编辑、删除博客文章。支持Markdown格式内容。</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-[#4ade80] mt-0.5">2.</span>
            <span><strong className="text-gray-200">网站设置</strong> - 修改头像URL、作者名、简介、公告等信息。</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-[#4ade80] mt-0.5">3.</span>
            <span><strong className="text-gray-200">音乐管理</strong> - 添加/删除音乐。支持网易云音乐外链或其他MP3直链。</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-[#4ade80] mt-0.5">4.</span>
            <span><strong className="text-gray-200">AI配置</strong> - 填入你的DeepSeek API Key，即可在博客中使用AI助手。</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-[#4ade80] mt-0.5">5.</span>
            <span><strong className="text-gray-200">留言管理</strong> - 查看和删除访客留言。</span>
          </p>
        </div>
      </div>
    </div>
  );
}

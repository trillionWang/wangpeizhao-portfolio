import { useState, useEffect } from 'react';
import { Save, Image, User, FileText, Bell, Github, Mail } from 'lucide-react';
import { getConfig, updateConfig } from '../lib/api';

interface SiteConfig {
  avatar: string;
  author: string;
  nickname: string;
  bio: string;
  subtitle: string;
  announcement: string;
  github: string;
  email: string;
}

export default function Settings() {
  const [config, setConfig] = useState<SiteConfig>({
    avatar: '', author: '', nickname: '', bio: '', subtitle: '',
    announcement: '', github: '', email: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getConfig().then(data => {
      if (data) setConfig(data);
    });
  }, []);

  async function handleSave() {
    setLoading(true);
    await updateConfig(config);
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields = [
    { key: 'avatar' as keyof SiteConfig, label: '头像URL', icon: Image, placeholder: 'https://example.com/avatar.jpg' },
    { key: 'author' as keyof SiteConfig, label: '作者名', icon: User, placeholder: '你的名字' },
    { key: 'nickname' as keyof SiteConfig, label: '昵称', icon: User, placeholder: '@nickname' },
    { key: 'bio' as keyof SiteConfig, label: '简介', icon: FileText, placeholder: '一句话介绍自己' },
    { key: 'subtitle' as keyof SiteConfig, label: '副标题', icon: FileText, placeholder: '网站副标题' },
    { key: 'announcement' as keyof SiteConfig, label: '公告', icon: Bell, placeholder: '首页公告内容' },
    { key: 'github' as keyof SiteConfig, label: 'GitHub链接', icon: Github, placeholder: 'https://github.com/username' },
    { key: 'email' as keyof SiteConfig, label: '邮箱', icon: Mail, placeholder: 'your@email.com' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">网站设置</h1>
        {saved && (
          <span className="text-sm text-[#4ade80]">保存成功！</span>
        )}
      </div>

      <div className="rounded-2xl bg-[#151515] border border-white/5 p-6 space-y-4">
        {fields.map(field => (
          <div key={field.key}>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
              <field.icon className="w-4 h-4 text-[#4ade80]" />
              {field.label}
            </label>
            {field.key === 'announcement' ? (
              <textarea
                value={config[field.key]}
                onChange={e => setConfig({ ...config, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm resize-none"
              />
            ) : (
              <input
                value={config[field.key]}
                onChange={e => setConfig({ ...config, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
            )}
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4ade80] text-black font-medium hover:bg-[#22c55e] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? '保存中...' : '保存设置'}
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-[#151515] border border-white/5 p-6">
        <h2 className="text-lg font-semibold mb-3">头像预览</h2>
        <div className="flex items-center gap-4">
          {config.avatar ? (
            <img src={config.avatar} alt="avatar" className="w-20 h-20 rounded-xl object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-2xl font-bold text-white">
              {config.author?.charAt(0) || 'R'}
            </div>
          )}
          <div>
            <p className="font-medium">{config.author || '作者名'}</p>
            <p className="text-sm text-gray-500">{config.nickname || '@昵称'}</p>
            <p className="text-sm text-gray-500">{config.bio || '简介'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

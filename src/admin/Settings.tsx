import { useState, useEffect } from 'react';
import { Save, Image, User, FileText, Bell, Github, Mail, UploadCloud, Sparkles, MapPin, Briefcase } from 'lucide-react';
import { getConfig, updateConfig, uploadFile } from '../lib/api';

interface SiteConfig {
  brand: string;
  avatar: string;
  author: string;
  nickname: string;
  bio: string;
  subtitle: string;
  announcement: string;
  github: string;
  email: string;
  location: string;
  targetRole: string;
  heroImage: string;
}

const initialConfig: SiteConfig = {
  brand: 'rua',
  avatar: '',
  author: '',
  nickname: '',
  bio: '',
  subtitle: '',
  announcement: '',
  github: '',
  email: '',
  location: '',
  targetRole: '',
  heroImage: '',
};

export default function Settings() {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<keyof SiteConfig | null>(null);

  useEffect(() => {
    getConfig().then(data => {
      if (data) setConfig({ ...initialConfig, ...data });
    });
  }, []);

  async function handleSave() {
    setLoading(true);
    await updateConfig(config);
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleImageUpload(field: 'avatar' | 'heroImage', file?: File) {
    if (!file) return;
    setUploadingField(field);
    try {
      const result = await uploadFile(file, { title: field === 'avatar' ? '头像' : '首屏背景', album: '站点素材' });
      if (result.file?.url) setConfig(current => ({ ...current, [field]: result.file.url }));
    } finally {
      setUploadingField(null);
    }
  }

  const fields = [
    { key: 'brand' as keyof SiteConfig, label: '左上角品牌', icon: Sparkles, placeholder: 'rua' },
    { key: 'author' as keyof SiteConfig, label: '真实姓名', icon: User, placeholder: '王沛钊' },
    { key: 'nickname' as keyof SiteConfig, label: '昵称', icon: User, placeholder: '@trillionWang' },
    { key: 'targetRole' as keyof SiteConfig, label: '目标岗位', icon: Briefcase, placeholder: 'Java 后端开发工程师 / AI 应用工程师' },
    { key: 'location' as keyof SiteConfig, label: '位置', icon: MapPin, placeholder: '中国' },
    { key: 'bio' as keyof SiteConfig, label: '简介', icon: FileText, placeholder: '一句话介绍能力定位' },
    { key: 'subtitle' as keyof SiteConfig, label: '首屏副标题', icon: Sparkles, placeholder: '首屏打字机文案' },
    { key: 'announcement' as keyof SiteConfig, label: '公告', icon: Bell, placeholder: '首页公告内容' },
    { key: 'github' as keyof SiteConfig, label: 'GitHub 链接', icon: Github, placeholder: 'https://github.com/username' },
    { key: 'email' as keyof SiteConfig, label: '邮箱', icon: Mail, placeholder: 'your@email.com' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">网站设置</h1>
        {saved && <span className="text-sm text-[#4ade80]">保存成功</span>}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl bg-[#151515] border border-white/5 p-6 space-y-4">
          <MediaField
            label="头像"
            value={config.avatar}
            placeholder="头像 URL，或点击上传"
            uploading={uploadingField === 'avatar'}
            onChange={value => setConfig({ ...config, avatar: value })}
            onUpload={file => handleImageUpload('avatar', file)}
          />
          <MediaField
            label="首屏背景"
            value={config.heroImage}
            placeholder="首屏背景 URL，或点击上传"
            uploading={uploadingField === 'heroImage'}
            onChange={value => setConfig({ ...config, heroImage: value })}
            onUpload={file => handleImageUpload('heroImage', file)}
          />

          {fields.map(field => (
            <div key={field.key}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                <field.icon className="w-4 h-4 text-[#4ade80]" />
                {field.label}
              </label>
              {field.key === 'announcement' || field.key === 'bio' ? (
                <textarea
                  value={config[field.key]}
                  onChange={event => setConfig({ ...config, [field.key]: event.target.value })}
                  placeholder={field.placeholder}
                  rows={field.key === 'announcement' ? 3 : 2}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm resize-none"
                />
              ) : (
                <input
                  value={config[field.key]}
                  onChange={event => setConfig({ ...config, [field.key]: event.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
                />
              )}
            </div>
          ))}

          <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4ade80] text-black font-medium hover:bg-[#22c55e] transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {loading ? '保存中...' : '保存设置'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-[#151515] border border-white/5 p-6">
            <h2 className="text-lg font-semibold mb-4">前台品牌预览</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4ade80] text-black flex items-center justify-center text-xl font-bold">
                {(config.brand || 'rua').charAt(0)}
              </div>
              <div>
                <p className="font-medium">{config.brand || 'rua'}</p>
                <p className="text-sm text-gray-500">左上角公开展示品牌</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#151515] border border-white/5 p-6">
            <h2 className="text-lg font-semibold mb-4">资料预览</h2>
            <div className="flex items-center gap-4">
              {config.avatar ? (
                <img src={config.avatar} alt="avatar" className="w-20 h-20 rounded-xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
                  {config.author?.charAt(0) || 'W'}
                </div>
              )}
              <div>
                <p className="font-medium">{config.author || '作者名'}</p>
                <p className="text-sm text-[#4ade80]">{config.targetRole || '目标岗位'}</p>
                <p className="text-sm text-gray-500">{config.bio || '简介'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#151515] border border-white/5 overflow-hidden">
            <div className="aspect-video bg-white/5">
              {config.heroImage ? (
                <img src={config.heroImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(74,222,128,.35),transparent_35%),linear-gradient(135deg,#0f172a,#052e16)]" />
              )}
            </div>
            <div className="p-4">
              <p className="text-sm font-medium">首屏背景预览</p>
              <p className="text-xs text-gray-500 mt-1">保存后首页立即使用新的头像、文案和背景。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaField({
  label,
  value,
  placeholder,
  uploading,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  placeholder: string;
  uploading: boolean;
  onChange: (value: string) => void;
  onUpload: (file?: File) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
        <Image className="w-4 h-4 text-[#4ade80]" />
        {label}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-3">
        <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm" />
        <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-[#4ade80]/50 cursor-pointer">
          <UploadCloud className="w-4 h-4" />
          {uploading ? '上传中...' : '上传图片'}
          <input type="file" accept="image/*" className="hidden" onChange={event => onUpload(event.target.files?.[0])} />
        </label>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { KeyRound, Save, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { getAIKeyStatus, updateAIKey } from '../lib/api';

export default function AIConfig() {
  const [key, setKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAIKeyStatus().then(data => {
      if (data) setHasKey(data.hasKey);
    });
  }, []);

  async function handleSave() {
    if (!key.trim()) return;
    await updateAIKey(key.trim());
    setHasKey(true);
    setSaved(true);
    setKey('');
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AI配置</h1>

      <div className="rounded-2xl bg-[#151515] border border-white/5 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[#4ade80]/10">
            <Sparkles className="w-5 h-5 text-[#4ade80]" />
          </div>
          <div>
            <h2 className="font-semibold">DeepSeek API</h2>
            <p className="text-xs text-gray-500">配置后博客AI助手将使用DeepSeek大模型</p>
          </div>
        </div>

        {hasKey ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-400 text-sm mb-4">
            <Check className="w-4 h-4" />
            API Key 已配置
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-400 text-sm mb-4">
            <AlertTriangle className="w-4 h-4" />
            尚未配置 API Key，AI助手将使用模拟回复
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            DeepSeek API Key
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxx"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm font-mono"
              />
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e] transition-colors"
            >
              <Save className="w-4 h-4" />
              {saved ? '已保存' : '保存'}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[#151515] border border-white/5 p-6">
        <h2 className="font-semibold mb-3">获取 API Key</h2>
        <ol className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-[#4ade80]">1.</span>
            <span>访问 <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-[#4ade80] hover:underline">DeepSeek开放平台</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#4ade80]">2.</span>
            <span>注册账号并登录</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#4ade80]">3.</span>
            <span>进入「API Keys」页面，创建新Key</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#4ade80]">4.</span>
            <span>复制 Key 粘贴到上方输入框保存即可</span>
          </li>
        </ol>

        <div className="mt-4 p-3 rounded-lg bg-white/5 text-xs text-gray-500">
          <p>API Key 仅存储在服务器数据库中，不会泄露给任何人。</p>
          <p>每次调用AI对话时，服务器会使用这个Key调用DeepSeek API。</p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Unlock, FileText, KeyRound } from 'lucide-react';
import PageLayout from '../sections/PageLayout';
import Footer from '../sections/Footer';

// Binary rain effect
function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const columns = Math.floor(canvas.width / 14);
    const drops: number[] = new Array(columns).fill(0);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#4ade80';
      ctx.font = '14px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(text, i * 14, drops[i] * 14);

        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
    />
  );
}

const secretNotes = [
  { type: 'text', title: '我的秘密笔记', content: '这是一个加密的档案库页面。你可以在这里记录一些私密的内容，只有通过正确的密钥才能访问。' },
  { type: 'text', title: '2026年目标', content: '1. 找到Java后端开发工作\n2. 深入学习AI Agent\n3. 完成个人博客项目\n4. 学会使用DDD架构' },
  { type: 'text', title: '一些想法', content: '技术不仅仅是工具，更是一种思维方式。每一行代码都是对问题的理解和表达。' },
];

export default function Vault() {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    // Any non-empty password unlocks for demo
    if (password.trim()) {
      setIsUnlocked(true);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {!isUnlocked ? (
          /* Locked State */
          <div className="relative rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden min-h-[400px] flex items-center justify-center">
            <BinaryRain />
            <div className="relative z-10 text-center px-6">
              <div className="text-4xl font-mono font-bold text-[#4ade80] mb-2 tracking-wider">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className="inline-block animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                    {Math.random() > 0.5 ? '1' : '0'}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-6 font-mono">
                SECURE VAULT // ACCESS RESTRICTED
              </p>
              <div className="flex items-center gap-2 max-w-sm mx-auto">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                    placeholder="请输入访问密钥..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-900 dark:text-white outline-none focus:border-[#4ade80]/50 text-sm font-mono"
                  />
                </div>
                <button
                  onClick={handleUnlock}
                  className="px-5 py-3 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e] transition-colors"
                >
                  解锁
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Unlocked State */
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-[#4ade80]/10">
                <Unlock className="w-5 h-5 text-[#4ade80]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">档案库</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">已解锁访问</p>
              </div>
            </div>

            {/* Secret Notes */}
            <div className="grid gap-4">
              {secretNotes.map((note, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-[#4ade80]" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{note.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Hint */}
            <div className="rounded-xl bg-[#4ade80]/5 border border-[#4ade80]/20 p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                这些内容仅保存在本地，不会上传到任何服务器。
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </PageLayout>
  );
}

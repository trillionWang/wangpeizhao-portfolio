import { useState, useRef, useEffect } from 'react';
import { Sparkles, Code2, PenLine, Map, MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { chatWithAI } from '../lib/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const features = [
  { title: '代码助手', description: '智能代码补全、Bug修复、代码重构建议', icon: Code2 },
  { title: '文章生成', description: '根据主题自动生成技术博客文章', icon: PenLine },
  { title: '学习规划', description: '根据个人水平制定个性化学习计划', icon: Map },
  { title: '知识问答', description: 'Java后端、AI Agent领域知识问答', icon: MessageSquare },
];

const quickPrompts = [
  '帮我写一篇关于Spring Boot的入门教程',
  '解释一下Redis缓存穿透、击穿、雪崩的区别',
  '什么是DDD领域驱动设计？',
  '给我制定一个Java后端学习路线',
];

export default function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '你好！我是你的AI助手。我可以帮你解答技术问题、生成文章、制定学习计划等。有什么可以帮你的吗？' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text?: string) {
    const content = text || input.trim();
    if (!content || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await chatWithAI(content);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || data.error || '服务暂时不可用' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '网络连接失败，请检查后端服务是否启动。' }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300 pt-14">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-[#4ade80]/20 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#4ade80]/10">
              <Sparkles className="w-6 h-6 text-[#4ade80]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI 助手</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">基于DeepSeek大语言模型的智能助手</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {features.map(f => (
            <div key={f.title} className="p-4 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#4ade80]/10 flex items-center justify-center mb-2">
                <f.icon className="w-5 h-5 text-[#4ade80]" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{f.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 overflow-hidden">
          {/* Messages */}
          <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant' ? 'bg-gradient-to-br from-emerald-400 to-green-600' : 'bg-gray-200 dark:bg-white/10'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                </div>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'assistant' ? 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-tl-sm' : 'bg-[#4ade80]/10 text-gray-900 dark:text-white rounded-tr-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-white/5">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button key={i} onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-full text-xs bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-[#4ade80]/10 hover:text-[#4ade80] transition-all border border-gray-200 dark:border-white/5">
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="输入你的问题..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-[#4ade80]/50 text-sm" />
              <button onClick={() => handleSend()} disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

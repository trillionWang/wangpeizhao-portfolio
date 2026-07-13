import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageSquare, Minimize2, Send, X } from 'lucide-react';
import { chatWithAI } from '../lib/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const starters = ['介绍一下你的项目', '你的技术栈有哪些？', '适合什么岗位？'];

const initialMessage: ChatMessage = {
  role: 'assistant',
  content: '你好，我是王沛钊个人主页的 AI 助手。你可以问我他的项目、技术栈、文章记录或联系方式。',
};

export default function AIAssistantDock() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function send(text?: string) {
    const content = (text || input).trim();
    if (!content || loading) return;

    setMessages(prev => [...prev, { role: 'user', content }]);
    setInput('');
    setLoading(true);
    setOpen(true);

    try {
      const data = await chatWithAI(content);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || data.error || '暂时无法回答。' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '网络连接失败，请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-2xl border border-[#4ade80]/30 bg-[#07110d]/90 px-4 py-3 text-white shadow-2xl shadow-[#4ade80]/20 backdrop-blur-xl transition-all hover:border-[#4ade80]/70 md:bottom-auto md:right-6 md:top-24"
      >
        <Bot className="h-5 w-5 text-[#4ade80]" />
        <span className="hidden text-sm sm:inline">AI 助手</span>
      </button>
    );
  }

  return (
    <aside className="fixed bottom-3 right-3 z-40 w-[calc(100vw-24px)] max-w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f0d]/92 text-white shadow-2xl shadow-black/40 backdrop-blur-xl md:bottom-auto md:right-6 md:top-20">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4ade80]/15">
            <Bot className="h-5 w-5 text-[#4ade80]" />
          </div>
          <div>
            <p className="text-sm font-semibold">rua AI</p>
            <p className="text-xs text-gray-500">简历 / 项目 / 生活记录</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white" aria-label="收起">
            <Minimize2 className="h-4 w-4" />
          </button>
          <button onClick={() => setMessages([initialMessage])} className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white" aria-label="清空">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[46vh] space-y-3 overflow-y-auto p-4 md:max-h-[430px]">
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && <MessageSquare className="mt-2 h-4 w-4 flex-shrink-0 text-[#4ade80]" />}
            <div className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-6 ${
              message.role === 'assistant'
                ? 'rounded-tl-sm bg-white/7 text-gray-200'
                : 'rounded-tr-sm bg-[#4ade80] text-black'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            正在检索个人资料...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-2">
        {starters.map(starter => (
          <button
            key={starter}
            onClick={() => send(starter)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:border-[#4ade80]/40 hover:text-[#4ade80]"
          >
            {starter}
          </button>
        ))}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => event.key === 'Enter' && send()}
            placeholder="询问项目、能力或经历..."
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#4ade80]/50"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-[#4ade80] p-2 text-black transition-colors hover:bg-[#22c55e] disabled:opacity-50"
            aria-label="发送"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

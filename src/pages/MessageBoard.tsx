import { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Clock } from 'lucide-react';
import { getMessages, createMessage } from '../lib/api';

interface Message {
  id: number;
  name: string;
  content: string;
  date: string;
}

export default function MessageBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await getMessages();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    await createMessage(name.trim(), content.trim());
    setName('');
    setContent('');
    load();
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300 pt-14">
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#4ade80]" />
            留言板
          </h1>
          <p className="text-gray-500 dark:text-gray-400">有什么想对我说的？欢迎留言交流</p>
        </div>

        {/* Post Form */}
        <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">昵称</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="输入你的昵称"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-[#4ade80]/50 text-sm"
                  required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">留言内容</label>
              <textarea value={content} onChange={e => setContent(e.target.value)}
                placeholder="写下你想说的话..." rows={4}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-[#4ade80]/50 text-sm resize-none"
                required />
            </div>
            <button type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4ade80] text-black font-medium hover:bg-[#22c55e] transition-colors">
              <Send className="w-4 h-4" />
              提交留言
            </button>
          </form>
        </div>

        {/* Messages */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                  {msg.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{msg.name}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600">
                      <Clock className="w-3 h-3" />
                      {msg.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-500">还没有留言，来抢沙发吧</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

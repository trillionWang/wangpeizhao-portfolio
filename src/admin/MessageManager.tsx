import { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Clock } from 'lucide-react';
import { getMessages, deleteMessage } from '../lib/api';

interface Message {
  id: number;
  name: string;
  content: string;
  date: string;
  created_at: string;
}

export default function MessageManager() {
  const [messages, setMessages] = useState<Message[]>([]);

  async function load() {
    const data = await getMessages();
    setMessages(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm('确定删除这条留言？')) return;
    await deleteMessage(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">留言管理</h1>
        <span className="text-sm text-gray-500">共 {messages.length} 条留言</span>
      </div>

      <div className="space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className="rounded-xl bg-[#151515] border border-white/5 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-sm font-bold text-white">
                  {msg.name.charAt(0)}
                </div>
                <div>
                  <span className="font-medium text-sm">{msg.name}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                    <Clock className="w-3 h-3" />
                    {msg.date}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(msg.id)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-400 ml-11 whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            暂无留言
          </div>
        )}
      </div>
    </div>
  );
}

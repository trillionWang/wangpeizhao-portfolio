import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { diaryEntries as defaultEntries, type DiaryEntry } from '../data/content';
import PageLayout from '../sections/PageLayout';
import Footer from '../sections/Footer';

function getTimeAgo(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return '今天';
  if (diff === 1) return '昨天';
  if (diff < 30) return `${diff}天前`;
  if (diff < 365) return `${Math.floor(diff / 30)}个月前`;
  return `${Math.floor(diff / 365)}年前`;
}

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('diary-entries');
    return saved ? JSON.parse(saved) : defaultEntries;
  });
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    localStorage.setItem('diary-entries', JSON.stringify(entries));
  }, [entries]);

  const handleAdd = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
      date: new Date().toISOString().split('T')[0],
      images: [],
    };
    setEntries([newEntry, ...entries]);
    setNewTitle('');
    setNewContent('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">日记</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">记录生活和学习片段；临时新增内容仅保存在当前浏览器</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{entries.length}</span> 条短文
            </span>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e] transition-colors"
            >
              <Plus className="w-4 h-4" />
              临时写一条
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">新日记</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="标题..."
              className="w-full px-4 py-2.5 mb-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-[#4ade80]/50 text-sm"
            />
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="写下今天的心情..."
              rows={4}
              className="w-full px-4 py-2.5 mb-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-[#4ade80]/50 text-sm resize-none"
            />
            <button
              onClick={handleAdd}
              className="px-6 py-2 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e] transition-colors"
            >
              发布
            </button>
          </div>
        )}

        {/* Entries */}
        <div className="space-y-4">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{entry.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-500">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(entry.date)}
                    <span className="mx-1">|</span>
                    {entry.date}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
              {entry.images.length > 0 && (
                <div className={`grid gap-2 mt-4 ${entry.images.length === 1 ? 'grid-cols-1' : entry.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {entry.images.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-[4/3]">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-16 text-gray-500 dark:text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>还没有日记，写第一篇吧</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
}

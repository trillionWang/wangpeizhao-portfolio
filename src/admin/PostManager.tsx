import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, FileText } from 'lucide-react';
import { getPosts, createPost, updatePost, deletePost } from '../lib/api';

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  word_count: number;
  read_time: number;
  published: number;
}

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', summary: '', content: '', date: '',
    category: '生活随笔', tags: '', word_count: 0, read_time: 0,
  });

  async function loadPosts() {
    const data = await getPosts();
    setPosts(Array.isArray(data) ? data : []);
  }

  useEffect(() => { loadPosts(); }, []);

  function openEdit(post: Post) {
    setEditing(post);
    setForm({
      title: post.title, slug: post.slug, summary: post.summary,
      content: post.content, date: post.date, category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(',') : post.tags,
      word_count: post.word_count, read_time: post.read_time,
    });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      title: '', slug: '', summary: '', content: '',
      date: new Date().toISOString().split('T')[0],
      category: '生活随笔', tags: '', word_count: 0, read_time: 0,
    });
    setShowForm(true);
  }

  async function handleSave() {
    const postData = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      word_count: parseInt(String(form.word_count)) || 0,
      read_time: parseInt(String(form.read_time)) || 0,
    };
    if (editing) {
      await updatePost(editing.id, postData);
    } else {
      await createPost(postData);
    }
    setShowForm(false);
    loadPosts();
  }

  async function handleDelete(id: number) {
    if (!confirm('确定删除这篇文章？')) return;
    await deletePost(id);
    loadPosts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e] transition-colors"
        >
          <Plus className="w-4 h-4" /> 写文章
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-[#151515] border border-white/5 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{editing ? '编辑文章' : '新建文章'}</h3>
            <button onClick={() => setShowForm(false)} className="p-1 text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="标题"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <input
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                placeholder="URL标识 (如: my-post)"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
            </div>
            <input
              value={form.summary}
              onChange={e => setForm({ ...form, summary: e.target.value })}
              placeholder="摘要"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
            />
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="文章内容 (支持Markdown)"
              rows={8}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm resize-none font-mono"
            />
            <div className="grid grid-cols-4 gap-3">
              <input
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                type="date"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <input
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                placeholder="分类"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <input
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                placeholder="标签 (逗号分隔)"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <input
                value={form.read_time}
                onChange={e => setForm({ ...form, read_time: parseInt(e.target.value) || 0 })}
                placeholder="阅读时间(分钟)"
                type="number"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e] transition-colors"
            >
              {editing ? '保存修改' : '发布文章'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {posts.map(post => (
          <div
            key={post.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#151515] border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-[#4ade80]/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#4ade80]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{post.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {post.date} | {post.category} | {post.read_time}分钟
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => openEdit(post)}
                className="p-2 rounded-lg text-gray-500 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">暂无文章</div>
        )}
      </div>
    </div>
  );
}

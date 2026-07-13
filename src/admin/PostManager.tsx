import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, FileText, UploadCloud, Eye, EyeOff } from 'lucide-react';
import { getPosts, createPost, updatePost, deletePost, uploadFile } from '../lib/api';

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  cover?: string;
  word_count: number;
  read_time: number;
  published: number;
}

const emptyForm = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  category: '生活随笔',
  tags: '',
  cover: '',
  word_count: 0,
  read_time: 0,
  published: 1,
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function loadPosts() {
    const data = await getPosts();
    setPosts(Array.isArray(data) ? data : []);
  }

  useEffect(() => { loadPosts(); }, []);

  function openEdit(post: Post) {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content || '',
      date: post.date,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      cover: post.cover || '',
      word_count: post.word_count || 0,
      read_time: post.read_time || 0,
      published: post.published ?? 1,
    });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function updateContent(content: string) {
    const wordCount = content.replace(/\s/g, '').length;
    setForm({
      ...form,
      content,
      word_count: wordCount,
      read_time: Math.max(1, Math.ceil(wordCount / 350)),
    });
  }

  async function handleCoverUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, { title: form.title || file.name, album: '文章封面' });
      if (result.file?.url) setForm(current => ({ ...current, cover: result.file.url }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    const postData = {
      ...form,
      slug: form.slug || slugify(form.title) || `post-${Date.now()}`,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      word_count: Number(form.word_count) || 0,
      read_time: Number(form.read_time) || 1,
      published: Number(form.published),
    };

    if (editing) await updatePost(editing.id, postData);
    else await createPost(postData);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={form.title}
                onChange={event => setForm({ ...form, title: event.target.value, slug: form.slug || slugify(event.target.value) })}
                placeholder="标题"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <input
                value={form.slug}
                onChange={event => setForm({ ...form, slug: slugify(event.target.value) })}
                placeholder="URL 标识，例如 my-post"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
            </div>

            <textarea
              value={form.summary}
              onChange={event => setForm({ ...form, summary: event.target.value })}
              placeholder="摘要"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm resize-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
              <input
                value={form.cover}
                onChange={event => setForm({ ...form, cover: event.target.value })}
                placeholder="封面 URL，或点击右侧上传"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-[#4ade80]/50 cursor-pointer">
                <UploadCloud className="w-4 h-4" />
                {uploading ? '上传中...' : '上传封面'}
                <input type="file" accept="image/*" className="hidden" onChange={event => handleCoverUpload(event.target.files?.[0])} />
              </label>
            </div>

            {form.cover && (
              <img src={form.cover} alt="" className="h-40 w-full rounded-xl object-cover border border-white/10" />
            )}

            <textarea
              value={form.content}
              onChange={event => updateContent(event.target.value)}
              placeholder="文章内容，支持 Markdown"
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm resize-y font-mono leading-relaxed"
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                value={form.date}
                onChange={event => setForm({ ...form, date: event.target.value })}
                type="date"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <input
                value={form.category}
                onChange={event => setForm({ ...form, category: event.target.value })}
                placeholder="分类"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <input
                value={form.tags}
                onChange={event => setForm({ ...form, tags: event.target.value })}
                placeholder="标签，逗号分隔"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <input
                value={form.read_time}
                onChange={event => setForm({ ...form, read_time: parseInt(event.target.value) || 1 })}
                placeholder="阅读分钟"
                type="number"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <select
                value={form.published}
                onChange={event => setForm({ ...form, published: Number(event.target.value) })}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              >
                <option value={1}>发布</option>
                <option value={0}>草稿</option>
              </select>
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
          <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#151515] border border-white/5 hover:border-white/10 transition-all">
            <div className="w-12 h-12 rounded-lg bg-[#4ade80]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {post.cover ? <img src={post.cover} alt="" className="w-full h-full object-cover" /> : <FileText className="w-5 h-5 text-[#4ade80]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm truncate">{post.title}</h3>
                {post.published === 0 ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-[#4ade80]" />}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {post.date} | {post.category} | {post.read_time} 分钟 | {post.word_count} 字
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(post)} className="p-2 rounded-lg text-gray-500 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && <div className="text-center py-12 text-gray-500">暂无文章</div>}
      </div>
    </div>
  );
}

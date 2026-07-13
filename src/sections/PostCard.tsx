import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText } from 'lucide-react';

interface PostData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  date: string;
  category: string;
  tags: string[] | string;
  cover?: string;
  word_count: number;
  read_time: number;
}

const categoryColors: Record<string, string> = {
  项目: 'bg-blue-500/15 text-blue-500 dark:text-blue-300',
  后端架构: 'bg-purple-500/15 text-purple-500 dark:text-purple-300',
  'AI Agent': 'bg-cyan-500/15 text-cyan-500 dark:text-cyan-300',
  数据结构: 'bg-orange-500/15 text-orange-500 dark:text-orange-300',
  生活随笔: 'bg-pink-500/15 text-pink-500 dark:text-pink-300',
  生活记录: 'bg-pink-500/15 text-pink-500 dark:text-pink-300',
  留言板: 'bg-green-500/15 text-green-500 dark:text-green-300',
  默认: 'bg-gray-500/15 text-gray-500 dark:text-gray-300',
};

function list(value: string[] | string) {
  return Array.isArray(value) ? value : value.split(/[\n,，;；|]+/).map(item => item.trim()).filter(Boolean);
}

export default function PostCard({ post }: { post: PostData }) {
  const catColor = categoryColors[post.category] || categoryColors.默认;
  const tags = list(post.tags || []);

  return (
    <Link
      to={`/post/${post.slug}`}
      className="group flex gap-4 rounded-2xl border border-gray-200/60 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4ade80]/35 hover:shadow-lg hover:shadow-[#4ade80]/10 dark:border-white/5 dark:bg-[#151515]"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${catColor}`}>
            {post.category || '默认'}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-[#16a34a] dark:text-white">
          {post.title}
        </h3>
        <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
          <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{(post.word_count || 0).toLocaleString()} 字</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.read_time || 1} 分钟</span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{post.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map(tag => <span key={tag} className="text-xs text-gray-500">#{tag}</span>)}
        </div>
      </div>
      <div className="hidden h-28 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 via-slate-900 to-cyan-900 sm:block">
        {post.cover ? (
          <img src={post.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-black text-white/85">{post.title.charAt(0)}</div>
        )}
      </div>
    </Link>
  );
}

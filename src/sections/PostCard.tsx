import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText } from 'lucide-react';
interface PostData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  date: string;
  category: string;
  tags: string[];
  word_count: number;
  read_time: number;
}

interface PostCardProps {
  post: PostData;
}

const categoryColors: Record<string, string> = {
  '项目': 'bg-blue-500/20 text-blue-400',
  '后端架构': 'bg-purple-500/20 text-purple-400',
  'AI Agent': 'bg-cyan-500/20 text-cyan-400',
  '数据结构': 'bg-orange-500/20 text-orange-400',
  '生活随笔': 'bg-pink-500/20 text-pink-400',
  '留言板': 'bg-green-500/20 text-green-400',
  '默认': 'bg-gray-500/20 text-gray-400',
};

// Generate a visual thumbnail based on post data
function PostThumbnail({ post }: { post: PostData }) {
  const gradients = [
    'from-emerald-600 to-teal-800',
    'from-blue-600 to-indigo-800',
    'from-violet-600 to-purple-800',
    'from-amber-600 to-orange-800',
    'from-rose-600 to-pink-800',
    'from-cyan-600 to-blue-800',
  ];
  const gradIndex = post.title.charCodeAt(0) % gradients.length;
  const emoji = post.title.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
  const displayChar = emoji ? emoji[0] : post.title.charAt(0);

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradients[gradIndex]} flex items-center justify-center rounded-xl overflow-hidden`}>
      <span className="text-5xl font-bold text-white/90 select-none">{displayChar}</span>
    </div>
  );
}

export default function PostCard({ post }: PostCardProps) {
  const catColor = categoryColors[post.category] || categoryColors['默认'];

  return (
    <Link
      to={`/post/${post.slug}`}
      className="group flex gap-4 p-4 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 hover:border-[#4ade80]/30 dark:hover:border-[#4ade80]/30 hover:shadow-lg hover:shadow-[#4ade80]/5 transition-all duration-300"
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
            {post.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#4ade80] transition-colors line-clamp-1 mb-2">
          {post.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {(post.word_count || 0).toLocaleString()} 字
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.read_time || 0} 分钟
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {post.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-gray-500 dark:text-gray-500 hover:text-[#4ade80] transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="hidden sm:block w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden">
        <PostThumbnail post={post} />
      </div>
    </Link>
  );
}

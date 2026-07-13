import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, FileText, Tag, ChevronRight } from 'lucide-react';
import Terminal from '../sections/Terminal';
import Footer from '../sections/Footer';
import { usePost, usePosts } from '../hooks/usePosts';

export default function PostDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading } = usePost(slug);
  const { posts } = usePosts();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] flex items-center justify-center text-gray-500">
        加载中...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">文章不存在</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">抱歉，找不到这篇文章。</p>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4ade80] text-black font-medium hover:bg-[#22c55e] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = posts.findIndex(item => item.slug === slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300 pt-14">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#4ade80] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <article className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 overflow-hidden">
          {post.cover && (
            <div className="aspect-[21/9] bg-black">
              <img src={post.cover} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 md:p-8 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4ade80]/15 text-[#22c55e]">
                {post.category}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                {(post.word_count || 0).toLocaleString()} 字
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.read_time || 1} 分钟阅读
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {(post.tags || []).map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-400">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-6 md:mx-8 border-t border-gray-200 dark:border-white/5" />

          <div className="p-6 md:p-8">
            <div className="prose-content text-gray-700 dark:text-gray-300">
              <RenderMarkdown content={post.content || post.summary} />
            </div>
          </div>
        </article>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {prevPost ? (
            <Link to={`/post/${prevPost.slug}`} className="p-4 rounded-xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 hover:border-[#4ade80]/30 transition-all">
              <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3 h-3" />
                上一篇
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 hover:text-[#4ade80] transition-colors">
                {prevPost.title}
              </span>
            </Link>
          ) : <div />}

          {nextPost ? (
            <Link to={`/post/${nextPost.slug}`} className="p-4 rounded-xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 hover:border-[#4ade80]/30 transition-all text-right">
              <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mb-1 justify-end">
                下一篇
                <ChevronRight className="w-3 h-3" />
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 hover:text-[#4ade80] transition-colors">
                {nextPost.title}
              </span>
            </Link>
          ) : <div />}
        </div>

        <div className="mt-6">
          <Terminal />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RenderMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-4 leading-8">
      {lines.map((line, index) => {
        if (!line.trim()) return <div key={index} className="h-2" />;
        if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white pt-3">{line.slice(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white pt-4">{line.slice(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-white pt-4">{line.slice(2)}</h1>;
        if (line.startsWith('- ')) return <p key={index} className="pl-4 border-l-2 border-[#4ade80]/40">{line.slice(2)}</p>;
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}

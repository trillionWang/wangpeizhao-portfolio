import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, FileText, Tag, ChevronRight } from 'lucide-react';
import { posts } from '../data/posts';
import Terminal from '../sections/Terminal';
import Footer from '../sections/Footer';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">文章不存在</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">抱歉，找不到这篇文章</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4ade80] text-black font-medium hover:bg-[#22c55e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = posts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const categoryColors: Record<string, string> = {
    '项目': 'bg-blue-500/20 text-blue-400',
    '后端架构': 'bg-purple-500/20 text-purple-400',
    'AI Agent': 'bg-cyan-500/20 text-cyan-400',
    '数据结构': 'bg-orange-500/20 text-orange-400',
    '生活随笔': 'bg-pink-500/20 text-pink-400',
    '留言板': 'bg-green-500/20 text-green-400',
    '默认': 'bg-gray-500/20 text-gray-400',
  };

  const catColor = categoryColors[post.category] || categoryColors['默认'];

  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300 pt-14">
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#4ade80] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        {/* Article */}
        <article className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
                {post.category}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                {post.wordCount.toLocaleString()} 字
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime} 分钟阅读
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-400"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-8 border-t border-gray-200 dark:border-white/5" />

          {/* Content Placeholder */}
          <div className="p-8">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {post.summary}
              </p>
              <div className="mt-8 p-6 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  文章正文内容区域
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                  此处展示文章的完整内容
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Post Navigation */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {prevPost ? (
            <Link
              to={`/post/${prevPost.slug}`}
              className="p-4 rounded-xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 hover:border-[#4ade80]/30 transition-all"
            >
              <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3 h-3" />
                上一篇
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 hover:text-[#4ade80] transition-colors">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              to={`/post/${nextPost.slug}`}
              className="p-4 rounded-xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 hover:border-[#4ade80]/30 transition-all text-right"
            >
              <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mb-1 justify-end">
                下一篇
                <ChevronRight className="w-3 h-3" />
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 hover:text-[#4ade80] transition-colors">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Terminal */}
        <div className="mt-6">
          <Terminal />
        </div>
      </main>
      <Footer />
    </div>
  );
}

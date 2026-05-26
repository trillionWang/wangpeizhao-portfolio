import { Link } from 'react-router-dom';
import { FolderOpen, ChevronRight } from 'lucide-react';
import { posts, categories } from '../data/posts';
import Footer from '../sections/Footer';

export default function Archive() {
  // Group posts by year
  const groupedPosts = posts.reduce((acc, post) => {
    const year = post.date.split('-')[0];
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  const years = Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300 pt-14">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">归档</h1>
          <p className="text-gray-500 dark:text-gray-400">
            共 {posts.length} 篇文章
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <FolderOpen className="w-4 h-4 text-[#4ade80]" />
                <h3 className="font-semibold text-gray-900 dark:text-white">分类</h3>
              </div>
              <div className="space-y-2">
                {categories.filter(c => c.count > 0).map(cat => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">统计</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">文章总数</span>
                  <span className="text-gray-900 dark:text-white font-medium">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">分类数</span>
                  <span className="text-gray-900 dark:text-white font-medium">{categories.filter(c => c.count > 0).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            {years.map(year => (
              <div key={year}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{year}</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {groupedPosts[year].length} 篇文章
                  </span>
                </div>

                <div className="space-y-3">
                  {groupedPosts[year].map(post => (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 hover:border-[#4ade80]/30 transition-all group"
                    >
                      <span className="text-sm text-gray-400 dark:text-gray-600 font-mono whitespace-nowrap">
                        {post.date.slice(5)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#4ade80] transition-colors truncate">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs text-gray-500 dark:text-gray-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#4ade80] transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

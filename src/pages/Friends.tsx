import { Link as LinkIcon, ExternalLink } from 'lucide-react';
import { friends } from '../data/posts';
import Footer from '../sections/Footer';

export default function Friends() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300 pt-14">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <LinkIcon className="w-8 h-8 text-[#4ade80]" />
            友情链接
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            这里是我朋友们的博客，欢迎访问交流
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((f, i) => (
            <a
              key={i}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 hover:border-[#4ade80]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-2xl flex-shrink-0">
                {f.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#4ade80] transition-colors">
                    {f.name}
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {f.desc}
                </p>
              </div>
            </a>
          ))}

          {/* Add Friend Card */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 text-gray-400 dark:text-gray-600">
            <LinkIcon className="w-8 h-8 mb-2" />
            <p className="text-sm">期待你的加入</p>
            <p className="text-xs mt-1">联系我可添加友链</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

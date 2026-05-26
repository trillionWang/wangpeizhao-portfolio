import { useParams } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../sections/Footer';

const pageNames: Record<string, string> = {
  anime: '番剧',
  diary: '日记',
  albums: '相册',
  vault: '档案库',
  projects: '学习记录',
  ai: 'AI',
};

export default function PlaceholderPage() {
  const { page } = useParams<{ page: string }>();
  const name = page ? (pageNames[page] || page) : '页面';

  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300 pt-14">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          <Construction className="w-16 h-16 text-[#4ade80] mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            该页面正在建设中，敬请期待...
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4ade80] text-black font-medium hover:bg-[#22c55e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

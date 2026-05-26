import { Star, CheckCircle, PlayCircle } from 'lucide-react';
import { animeList } from '../data/content';
import PageLayout from '../sections/PageLayout';
import Footer from '../sections/Footer';

export default function Anime() {
  const completed = animeList.filter(a => a.status === 'completed');
  const watching = animeList.filter(a => a.status === 'watching');
  const avgRating = (animeList.reduce((sum, a) => sum + a.rating, 0) / animeList.length).toFixed(1);

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-[#4ade80]/20 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">我的影视记录</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">记录我看过的番剧和影视剧</p>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-xl bg-white dark:bg-[#1a1a1a]">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{animeList.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">总数</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white dark:bg-[#1a1a1a]">
              <p className="text-2xl font-bold text-[#4ade80]">{watching.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">追番中</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white dark:bg-[#1a1a1a]">
              <p className="text-2xl font-bold text-blue-400">{completed.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">已追完</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white dark:bg-[#1a1a1a]">
              <p className="text-2xl font-bold text-amber-400">{avgRating}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">平均评分</p>
            </div>
          </div>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {animeList.map(anime => (
            <div
              key={anime.id}
              className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 overflow-hidden hover:border-[#4ade80]/30 transition-all group"
            >
              {/* Cover */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={anime.cover}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {anime.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/80 text-white">
                      <CheckCircle className="w-3 h-3" />
                      已追完
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/80 text-white">
                      <PlayCircle className="w-3 h-3" />
                      追番中
                    </span>
                  )}
                </div>
                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-white">{anime.rating}</span>
                </div>
                {/* Title & Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{anime.title}</h3>
                  {anime.episodes && (
                    <p className="text-xs text-white/70 mb-1">进度: {anime.episodes}</p>
                  )}
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {anime.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mb-3">
                  <span>年份: {anime.year}</span>
                  <span>制作: {anime.producer}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {anime.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
}

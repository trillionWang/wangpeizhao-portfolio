import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { albums as staticAlbums } from '../data/content';
import PageLayout from '../sections/PageLayout';
import Footer from '../sections/Footer';
import { getUploads } from '../lib/api';

interface MediaItem {
  id: number;
  type: 'image' | 'audio' | 'file';
  title: string;
  url: string;
  album: string;
  description: string;
  created_at: string;
}

interface AlbumView {
  id: string;
  title: string;
  description: string;
  cover: string;
  photos: string[];
  photoCount: number;
  category: string;
  date: string;
  tags: string[];
}

export default function Albums() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    getUploads().then(data => setMedia(Array.isArray(data) ? data : [])).catch(() => setMedia([]));
  }, []);

  const albums = useMemo<AlbumView[]>(() => {
    const images = media.filter(item => item.type === 'image');
    if (images.length === 0) return staticAlbums;

    const grouped = images.reduce<Record<string, MediaItem[]>>((acc, item) => {
      const name = item.album || '默认相册';
      acc[name] = acc[name] || [];
      acc[name].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, items]) => ({
      id: name,
      title: name,
      description: items.find(item => item.description)?.description || '仓库内容文件中的照片记录',
      cover: items[0].url,
      photos: items.map(item => item.url),
      photoCount: items.length,
      category: '照片',
      date: items[0].created_at?.slice(0, 10) || '',
      tags: ['相册', '记录'],
    }));
  }, [media]);

  const album = selectedAlbum ? albums.find(item => item.id === selectedAlbum) : null;

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">相册</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">记录生活中的高光、路过和灵感片段</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Images className="w-4 h-4 text-[#4ade80]" />
            {albums.reduce((sum, item) => sum + item.photoCount, 0)} 张照片
          </div>
        </div>

        {!album ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {albums.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedAlbum(item.id)}
                className="text-left rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 overflow-hidden hover:border-[#4ade80]/30 transition-all group"
              >
                <div className="aspect-[16/10] overflow-hidden bg-white/5">
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mb-3">
                    <span>{item.photoCount} 张照片</span>
                    <span>{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => { setSelectedAlbum(null); setSelectedPhoto(0); }}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#4ade80] transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              返回相册
            </button>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{album.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{album.description}</p>

            {album.photos.length > 0 && (
              <div className="relative rounded-2xl overflow-hidden bg-black mb-4 aspect-video">
                <img src={album.photos[selectedPhoto]} alt="" className="w-full h-full object-contain" />
                {album.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedPhoto(photo => (photo - 1 + album.photos.length) % album.photos.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedPhoto(photo => (photo + 1) % album.photos.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {album.photos.map((photo, index) => (
                <button
                  key={photo}
                  onClick={() => setSelectedPhoto(index)}
                  className={`rounded-xl overflow-hidden aspect-square ${index === selectedPhoto ? 'ring-2 ring-[#4ade80]' : ''}`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </PageLayout>
  );
}

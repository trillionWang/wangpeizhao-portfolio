import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { albums } from '../data/content';
import PageLayout from '../sections/PageLayout';
import Footer from '../sections/Footer';

export default function Albums() {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);

  const album = selectedAlbum ? albums.find(a => a.id === selectedAlbum) : null;

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">相册</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">记录生活中的美好瞬间</p>
        </div>

        {!album ? (
          /* Album List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {albums.map(a => (
              <button
                key={a.id}
                onClick={() => setSelectedAlbum(a.id)}
                className="text-left rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 overflow-hidden hover:border-[#4ade80]/30 transition-all group"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={a.cover}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{a.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                    {a.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mb-3">
                    <span>{a.photoCount} 张照片</span>
                    <span>{a.category}</span>
                    <span>{a.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {a.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Photo Gallery */
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

            {/* Main Photo Viewer */}
            {album.photos.length > 0 && (
              <div className="relative rounded-2xl overflow-hidden bg-black mb-4 aspect-video">
                <img
                  src={album.photos[selectedPhoto]}
                  alt=""
                  className="w-full h-full object-contain"
                />
                {album.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedPhoto(p => (p - 1 + album.photos.length) % album.photos.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedPhoto(p => (p + 1) % album.photos.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {album.photos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedPhoto(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === selectedPhoto ? 'bg-white' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {album.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(i)}
                  className={`rounded-xl overflow-hidden aspect-square ${
                    i === selectedPhoto ? 'ring-2 ring-[#4ade80]' : ''
                  }`}
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

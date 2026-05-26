import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';
import { getSongs } from '../lib/api';

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    getSongs().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setSongs(data);
      }
    });
  }, []);

  const currentSong = songs[currentIndex] || null;

  useEffect(() => {
    if (currentSong?.url) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.addEventListener('ended', () => {
          setCurrentIndex(i => (i + 1) % songs.length);
        });
      }
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked
          setIsPlaying(false);
        });
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentSong, currentIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex(i => (i + 1) % songs.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex(i => (i - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  if (songs.length === 0) return null;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-green-500/30 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Music className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-white/5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Music Player</span>
            <button
              onClick={() => { setIsOpen(false); setIsPlaying(false); }}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              {currentSong?.cover ? (
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
                />
              ) : (
                <div className="w-full h-full bg-[#4ade80]/10 flex items-center justify-center">
                  <Music className="w-6 h-6 text-[#4ade80]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentSong?.title || '未知歌曲'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentSong?.artist || '未知艺术家'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 p-3">
            <button
              onClick={prevSong}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={nextSong}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

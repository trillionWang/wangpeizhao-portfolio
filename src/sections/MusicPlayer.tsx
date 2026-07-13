import { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play, SkipBack, SkipForward, X } from 'lucide-react';
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
  const songsLengthRef = useRef(0);

  useEffect(() => {
    getSongs().then(data => {
      if (Array.isArray(data) && data.length > 0) setSongs(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    songsLengthRef.current = songs.length;
  }, [songs.length]);

  useEffect(() => {
    const audio = new Audio();
    const handleEnded = () => {
      setCurrentIndex(index => songsLengthRef.current ? (index + 1) % songsLengthRef.current : 0);
    };
    audio.addEventListener('ended', handleEnded);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, []);

  const currentSong = songs[currentIndex] || null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.url) return;
    if (audio.src !== currentSong.url) audio.src = currentSong.url;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentSong?.url, isPlaying]);

  const togglePlay = () => {
    if (!currentSong) return;
    setIsPlaying(value => !value);
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex(index => (index + 1) % songs.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex(index => (index - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  if (songs.length === 0) return null;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-green-500/30 transition-transform hover:scale-110"
          aria-label="打开音乐播放器"
        >
          <Music className="h-5 w-5" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-72 animate-in overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl duration-200 fade-in slide-in-from-bottom-2 dark:border-white/10 dark:bg-[#1a1a1a]">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 dark:border-white/5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Music Player</span>
            <button
              onClick={() => { setIsOpen(false); setIsPlaying(false); }}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
              aria-label="关闭音乐播放器"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 p-4">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
              {currentSong?.cover ? (
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className={`h-full w-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#4ade80]/10">
                  <Music className="h-6 w-6 text-[#4ade80]" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {currentSong?.title || '未知歌曲'}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {currentSong?.artist || '未知艺术家'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 p-3">
            <button
              onClick={prevSong}
              className="rounded-full p-2 text-gray-600 transition-all hover:bg-[#4ade80]/10 hover:text-[#4ade80] dark:text-gray-400"
              aria-label="上一首"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={togglePlay}
              className="rounded-full bg-gradient-to-br from-emerald-400 to-green-600 p-3 text-white shadow-lg transition-transform hover:scale-105"
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
            </button>
            <button
              onClick={nextSong}
              className="rounded-full p-2 text-gray-600 transition-all hover:bg-[#4ade80]/10 hover:text-[#4ade80] dark:text-gray-400"
              aria-label="下一首"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

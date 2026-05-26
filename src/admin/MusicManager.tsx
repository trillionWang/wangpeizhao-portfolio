import { useState, useEffect } from 'react';
import { Plus, Trash2, Music, ExternalLink } from 'lucide-react';
import { getSongs, createSong, deleteSong } from '../lib/api';

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

export default function MusicManager() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', artist: '', cover: '', url: '' });

  async function load() {
    const data = await getSongs();
    setSongs(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!form.title || !form.url) return;
    await createSong(form);
    setForm({ title: '', artist: '', cover: '', url: '' });
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('确定删除这首音乐？')) return;
    await deleteSong(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">音乐管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e] transition-colors"
        >
          <Plus className="w-4 h-4" /> 添加音乐
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-[#151515] border border-white/5 p-5 mb-6">
          <h3 className="font-semibold mb-4">添加音乐</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="歌曲名"
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
            />
            <input
              value={form.artist}
              onChange={e => setForm({ ...form, artist: e.target.value })}
              placeholder="歌手"
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
            />
            <input
              value={form.cover}
              onChange={e => setForm({ ...form, cover: e.target.value })}
              placeholder="封面图URL"
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
            />
            <input
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="音乐URL (MP3直链或网易云外链)"
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-6 py-2.5 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e] transition-colors"
          >
            添加
          </button>

          <div className="mt-4 p-3 rounded-lg bg-white/5 text-xs text-gray-400">
            <p className="flex items-center gap-1 mb-1">
              <ExternalLink className="w-3 h-3" />
              <strong className="text-gray-300">网易云外链格式：</strong>
            </p>
            <code className="text-[#4ade80]">https://music.163.com/song/media/outer/url?id=歌曲ID.mp3</code>
            <p className="mt-2 text-gray-500">歌曲ID可在网易云音乐网页版URL中找到</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {songs.map(song => (
          <div
            key={song.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#151515] border border-white/5"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              {song.cover ? (
                <img src={song.cover} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#4ade80]/10 flex items-center justify-center">
                  <Music className="w-5 h-5 text-[#4ade80]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{song.title}</h3>
              <p className="text-xs text-gray-500">{song.artist}</p>
            </div>
            <audio src={song.url} controls className="w-48 h-8" />
            <button
              onClick={() => handleDelete(song.id)}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {songs.length === 0 && (
          <div className="text-center py-12 text-gray-500">暂无音乐</div>
        )}
      </div>
    </div>
  );
}

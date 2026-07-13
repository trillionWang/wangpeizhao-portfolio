import { useState, useEffect } from 'react';
import { Plus, Trash2, Music, UploadCloud } from 'lucide-react';
import { getSongs, createSong, deleteSong, uploadFile } from '../lib/api';

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
  const [uploading, setUploading] = useState<'cover' | 'audio' | null>(null);
  const [form, setForm] = useState({ title: '', artist: '', cover: '', url: '' });

  async function load() {
    const data = await getSongs();
    setSongs(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(kind: 'cover' | 'audio', file?: File) {
    if (!file) return;
    setUploading(kind);
    try {
      const result = await uploadFile(file, {
        title: form.title || file.name,
        album: kind === 'cover' ? '音乐封面' : '音乐',
      });
      if (result.file?.url) {
        setForm(current => ({ ...current, [kind === 'cover' ? 'cover' : 'url']: result.file.url }));
      }
    } finally {
      setUploading(null);
    }
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input
              value={form.title}
              onChange={event => setForm({ ...form, title: event.target.value })}
              placeholder="歌曲名"
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
            />
            <input
              value={form.artist}
              onChange={event => setForm({ ...form, artist: event.target.value })}
              placeholder="歌手"
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
            />
            <div className="grid grid-cols-[1fr_130px] gap-2">
              <input
                value={form.cover}
                onChange={event => setForm({ ...form, cover: event.target.value })}
                placeholder="封面 URL"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <label className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:border-[#4ade80]/50 cursor-pointer">
                <UploadCloud className="w-4 h-4" />
                {uploading === 'cover' ? '上传中' : '封面'}
                <input type="file" accept="image/*" className="hidden" onChange={event => handleUpload('cover', event.target.files?.[0])} />
              </label>
            </div>
            <div className="grid grid-cols-[1fr_130px] gap-2">
              <input
                value={form.url}
                onChange={event => setForm({ ...form, url: event.target.value })}
                placeholder="音乐 URL / MP3 直链"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
              />
              <label className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:border-[#4ade80]/50 cursor-pointer">
                <UploadCloud className="w-4 h-4" />
                {uploading === 'audio' ? '上传中' : '音频'}
                <input type="file" accept="audio/*" className="hidden" onChange={event => handleUpload('audio', event.target.files?.[0])} />
              </label>
            </div>
          </div>

          {(form.cover || form.url) && (
            <div className="mb-4 flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#4ade80]/10 flex items-center justify-center">
                {form.cover ? <img src={form.cover} alt="" className="w-full h-full object-cover" /> : <Music className="w-5 h-5 text-[#4ade80]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{form.title || '未命名音乐'}</p>
                <p className="text-xs text-gray-500">{form.artist || '未知歌手'}</p>
                {form.url && <audio src={form.url} controls className="mt-2 w-full h-8" />}
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            className="px-6 py-2.5 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e] transition-colors"
          >
            添加
          </button>
        </div>
      )}

      <div className="space-y-2">
        {songs.map(song => (
          <div key={song.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#151515] border border-white/5">
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
            <audio src={song.url} controls className="hidden md:block w-48 h-8" />
            <button onClick={() => handleDelete(song.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {songs.length === 0 && <div className="text-center py-12 text-gray-500">暂无音乐</div>}
      </div>
    </div>
  );
}

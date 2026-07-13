import { useEffect, useState } from 'react';
import { Image, Trash2, UploadCloud } from 'lucide-react';
import { deleteUpload, getUploads, uploadFile } from '../lib/api';

interface MediaItem {
  id: number;
  type: 'image' | 'audio' | 'file';
  title: string;
  url: string;
  album: string;
  description: string;
  created_at: string;
}

export default function MediaManager() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [album, setAlbum] = useState('生活记录');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  async function load() {
    const data = await getUploads();
    setMedia(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      await uploadFile(file, { title: title || file.name, album, description });
      setTitle('');
      setDescription('');
      await load();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('确定删除这个文件？')) return;
    await deleteUpload(id);
    load();
  }

  const images = media.filter(item => item.type === 'image');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">媒体库</h1>
      </div>

      <div className="rounded-2xl bg-[#151515] border border-white/5 p-5 mb-6">
        <h3 className="font-semibold mb-4">上传照片</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="标题，可选"
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
          />
          <input
            value={album}
            onChange={event => setAlbum(event.target.value)}
            placeholder="相册名称"
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
          />
          <input
            value={description}
            onChange={event => setDescription(event.target.value)}
            placeholder="描述，可选"
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm"
          />
        </div>
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-gray-300 hover:border-[#4ade80]/50 hover:bg-[#4ade80]/5">
          <UploadCloud className="w-8 h-8 text-[#4ade80]" />
          <span className="text-sm">{uploading ? '上传中...' : '选择图片上传到相册'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={event => handleUpload(event.target.files?.[0])} />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {images.map(item => (
          <div key={item.id} className="rounded-2xl bg-[#151515] border border-white/5 overflow-hidden group">
            <div className="aspect-[4/3] bg-white/5">
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium text-sm truncate">{item.title || '未命名照片'}</h3>
                  <p className="text-xs text-[#4ade80] mt-1">{item.album || '默认相册'}</p>
                  {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                </div>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full rounded-2xl bg-[#151515] border border-white/5 py-16 text-center text-gray-500">
            <Image className="w-10 h-10 mx-auto mb-3 text-gray-600" />
            暂无照片
          </div>
        )}
      </div>
    </div>
  );
}

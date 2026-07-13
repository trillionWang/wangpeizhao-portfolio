import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { findAll, insert, remove, MediaRecord } from '../database';

const router = Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.env.PERSISTENT_DIR || process.cwd(), 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
      .slice(0, 60);
    cb(null, `${Date.now()}-${base || 'upload'}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed =
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('audio/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'text/plain';

    cb(allowed ? null : new Error('仅支持图片、音频、PDF 和文本文件'), allowed);
  },
});

function mediaType(mime: string): MediaRecord['type'] {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('audio/')) return 'audio';
  return 'file';
}

router.get('/', (_req, res) => {
  const media = findAll<MediaRecord>('media').sort((a, b) => b.created_at.localeCompare(a.created_at));
  res.json(media);
});

router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: '请选择要上传的文件' });
    return;
  }

  const record = insert<MediaRecord>('media', {
    id: 0,
    type: mediaType(req.file.mimetype),
    title: req.body.title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    mime: req.file.mimetype,
    size: req.file.size,
    album: req.body.album || '默认相册',
    description: req.body.description || '',
    created_at: new Date().toISOString(),
  });

  res.json({ success: true, file: record });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const media = findAll<MediaRecord>('media');
  const item = media.find(file => String(file.id) === String(req.params.id));
  const ok = remove('media', file => String(file.id) === String(req.params.id));

  if (ok && item?.filename) {
    const filePath = path.resolve(UPLOAD_DIR, item.filename);
    const uploadRoot = path.resolve(UPLOAD_DIR);
    if (filePath.startsWith(uploadRoot) && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  res.json({ success: ok, message: ok ? '文件已删除' : '文件不存在' });
});

export default router;

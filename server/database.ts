import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

interface DB {
  users: any[];
  config: any;
  posts: any[];
  songs: any[];
  messages: any[];
}

let db: DB = { users: [], config: {}, posts: [], songs: [], messages: [] };

function load() {
  if (fs.existsSync(DB_PATH)) {
    try {
      const loaded = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      db = { ...db, ...loaded };
    } catch { /* ignore */ }
  }
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

load();

export async function initDatabase() {
  const bcryptjs = await import('bcryptjs');

  // Default admin
  if (!db.users.find((u: any) => u.username === 'admin')) {
    db.users.push({
      id: 1,
      username: 'admin',
      password: await bcryptjs.default.hash('admin123', 10),
    });
    console.log('Default admin: admin / admin123');
  }

  // Default config
  if (!db.config || !db.config.author) {
    db.config = {
      avatar: '',
      author: 'ruaruarua coder',
      nickname: '@Rua',
      bio: 'Java后端 | AI Agent探索者',
      subtitle: '「吃个面皮」',
      announcement: '欢迎来到我的博客！目前正在寻找 Java 后端开发工程师的实习/全职机会。',
      github: 'https://github.com/wangpeizhao',
      email: '',
      deepseek_key: '',
    };
  }

  // Default posts
  if (db.posts.length === 0) {
    db.posts = [
      { id: 1, title: '🌟 简单自我介绍一下', slug: 'guide', summary: '一个在大学的海洋中挣扎求生的过度思考者，正在将屎山雕琢成艺术品的路上...', content: '', date: '2025-09-08', category: '生活随笔', tags: ['OverThinker','自我介绍','博客','思考'], word_count: 308, read_time: 2, published: 1 },
      { id: 2, title: '基于Websocket制作的网页聊天室', slug: 'chatroom', summary: '一个基于 Java WebSocket 开发的网页聊天室，支持实时消息推送与多人在线。', content: '', date: '2026-04-10', category: '项目', tags: ['Spring Web','网页聊天室','项目','Java'], word_count: 2173, read_time: 11, published: 1 },
      { id: 3, title: '七大排序算法奇幻之旅', slug: 'sorting-algorithms', summary: '从冒泡排序到快速排序，用生动的比喻带你走完七大经典排序算法的奇幻旅程。', content: '', date: '2025-08-22', category: '数据结构', tags: ['Java','数据结构','博客','排序算法'], word_count: 3673, read_time: 18, published: 1 },
      { id: 4, title: '🥊 Map和Set：哈希表与二叉搜索树的对决', slug: 'map-set', summary: 'HashMap vs TreeMap，哈希表和二叉搜索树在 Java 集合框架中的较量。', content: '', date: '2025-08-17', category: '数据结构', tags: ['Java','数据结构','博客','HashMap','TreeMap'], word_count: 2847, read_time: 14, published: 1 },
      { id: 5, title: 'Redis缓存设计与实战', slug: 'redis-cache', summary: '从缓存穿透到缓存击穿的完整防护方案设计与实战代码解析。', content: '', date: '2025-12-15', category: '后端架构', tags: ['Redis','缓存','博客','后端架构'], word_count: 4520, read_time: 22, published: 1 },
      { id: 6, title: 'AgentForge · AI智能体通用脚手架', slug: 'agentforge', summary: '企业级 AI Agent 通用脚手架，基于 DDD 六边形架构设计，支持低代码动态组装工作流。', content: '', date: '2026-03-20', category: 'AI Agent', tags: ['AI Agent','DDD','六边形架构','LangChain4j'], word_count: 3890, read_time: 20, published: 1 },
    ];
  }

  // Default songs
  if (db.songs.length === 0) {
    db.songs = [
      { id: 1, title: '夜空中最亮的星', artist: '逃跑计划', cover: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=200&h=200&fit=crop', url: 'https://music.163.com/song/media/outer/url?id=25706282.mp3' },
      { id: 2, title: '晴天', artist: '周杰伦', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop', url: 'https://music.163.com/song/media/outer/url?id=108418' },
      { id: 3, title: '起风了', artist: '买辣椒也用券', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', url: 'https://music.163.com/song/media/outer/url?id=1338695683' },
    ];
  }

  // Default message
  if (db.messages.length === 0) {
    db.messages.push({ id: 1, name: '访客', content: '欢迎来到留言板！留下你想说的话吧~', date: '2025-09-10' });
  }

  save();
  console.log('Database initialized');
}

// Query helpers
export function findOne(table: keyof DB, where: (item: any) => boolean): any {
  return (db[table] || []).find(where) || null;
}

export function findAll(table: keyof DB): any[] {
  return [...(db[table] || [])];
}

export function insert(table: keyof DB, item: any): any {
  const arr = db[table] || [];
  const newItem = { ...item, id: item.id || Date.now() };
  arr.push(newItem);
  (db as any)[table] = arr;
  save();
  return newItem;
}

export function update(table: keyof DB, where: (item: any) => boolean, data: any): boolean {
  const arr = db[table] || [];
  const idx = arr.findIndex(where);
  if (idx === -1) return false;
  arr[idx] = { ...arr[idx], ...data };
  save();
  return true;
}

export function remove(table: keyof DB, where: (item: any) => boolean): boolean {
  const arr = db[table] || [];
  const len = arr.length;
  (db as any)[table] = arr.filter((item: any) => !where(item));
  if ((db[table] || []).length < len) {
    save();
    return true;
  }
  return false;
}

export function getConfig(): any {
  return db.config || {};
}

export function setConfig(newConfig: any) {
  db.config = { ...db.config, ...newConfig };
  save();
}

export function getTable(table: keyof DB): any[] {
  return db[table] || [];
}

// Legacy API compatibility
export async function get(sql: string, params: any[] = []): Promise<any> {
  // Parse simple SQL patterns
  if (sql.includes('users')) {
    if (sql.includes('WHERE username')) return db.users.find((u: any) => u.username === params[0]) || null;
    return db.users[0] || null;
  }
  if (sql.includes('site_config')) return db.config;
  if (sql.includes('posts')) {
    if (sql.includes('WHERE slug')) return db.posts.find((p: any) => p.slug === params[0]) || null;
    if (sql.includes('COUNT')) return { count: db.posts.length };
    return db.posts[0] || null;
  }
  if (sql.includes('songs')) return db.songs[0] || null;
  if (sql.includes('messages')) return db.messages[0] || null;
  return null;
}

export async function all(sql: string): Promise<any[]> {
  if (sql.includes('posts')) return [...db.posts];
  if (sql.includes('songs')) return [...db.songs];
  if (sql.includes('messages')) return [...db.messages];
  return [];
}

export async function run(sql: string, params: any[] = []): Promise<void> {
  // Parse INSERT
  if (sql.includes('INSERT INTO users')) {
    db.users.push({ id: Date.now(), username: params[0], password: params[1] });
  } else if (sql.includes('INSERT INTO posts')) {
    db.posts.push({ id: Date.now(), title: params[0], slug: params[1], summary: params[2], date: params[3], category: params[4], tags: JSON.parse(params[5] || '[]'), word_count: params[6], read_time: params[7], published: 1 });
  } else if (sql.includes('INSERT INTO songs')) {
    db.songs.push({ id: Date.now(), title: params[0], artist: params[1], cover: params[2], url: params[3] });
  } else if (sql.includes('INSERT INTO messages')) {
    db.messages.push({ id: Date.now(), name: params[0], content: params[1], date: params[2] });
  } else if (sql.includes('UPDATE site_config')) {
    const keys = ['avatar', 'author', 'nickname', 'bio', 'subtitle', 'announcement', 'github', 'email'];
    keys.forEach((k, i) => { if (params[i] !== undefined && params[i] !== null) db.config[k] = params[i]; });
  } else if (sql.includes('UPDATE posts')) {
    const id = params[10];
    const idx = db.posts.findIndex((p: any) => String(p.id) === String(id));
    if (idx !== -1) {
      db.posts[idx] = { ...db.posts[idx], title: params[0], slug: params[1], content: params[2], summary: params[3], date: params[4], category: params[5], tags: JSON.parse(params[6] || '[]'), word_count: params[7], read_time: params[8], published: params[9] };
    }
  } else if (sql.includes('DELETE FROM posts')) {
    db.posts = db.posts.filter((p: any) => String(p.id) !== String(params[0]));
  } else if (sql.includes('DELETE FROM songs')) {
    db.songs = db.songs.filter((s: any) => String(s.id) !== String(params[0]));
  } else if (sql.includes('DELETE FROM messages')) {
    db.messages = db.messages.filter((m: any) => String(m.id) !== String(params[0]));
  }
  save();
}

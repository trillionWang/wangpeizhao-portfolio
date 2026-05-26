import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const JSON_DB_PATH = path.join(DB_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// In-memory data store
let data: any = {
  users: [],
  site_config: {},
  posts: [],
  songs: [],
  messages: [],
  diaries: [],
};

function loadFromJSON() {
  if (fs.existsSync(JSON_DB_PATH)) {
    try {
      const loaded = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
      data = {
        users: [],
        site_config: {},
        posts: [],
        songs: [],
        messages: [],
        diaries: [],
        ...loaded,
      };
    } catch {
      // use defaults
    }
  }
}

function saveToJSON() {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
}

// SQLite wrapper (uses sqlite3 if available, falls back to JSON)
let sqliteAvailable = false;
let db: any = null;

async function initSQLite() {
  try {
    const sqlite3 = await import('sqlite3');
    const dbPath = path.join(DB_DIR, 'blog.db');
    db = new sqlite3.default.Database(dbPath);
    sqliteAvailable = true;
    console.log('Using SQLite database');
  } catch {
    sqliteAvailable = false;
    console.log('SQLite not available, using JSON file storage');
    loadFromJSON();
  }
}

function sqliteGet(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err: any, row: any) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function sqliteAll(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: any, rows: any[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function sqliteRun(sql: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Public API - works with both SQLite and JSON
export async function initDatabase() {
  await initSQLite();

  if (sqliteAvailable) {
    // Create tables
    await sqliteRun(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await sqliteRun(`CREATE TABLE IF NOT EXISTS site_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      avatar TEXT DEFAULT '',
      author TEXT DEFAULT 'ruaruarua coder',
      nickname TEXT DEFAULT '@Rua',
      bio TEXT DEFAULT 'Java后端 | AI Agent探索者',
      subtitle TEXT DEFAULT '「吃个面皮」',
      announcement TEXT DEFAULT '欢迎来到我的博客！目前正在寻找 Java 后端开发工程师的实习/全职机会。',
      github TEXT DEFAULT 'https://github.com/wangpeizhao',
      email TEXT DEFAULT '',
      deepseek_key TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await sqliteRun(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT DEFAULT '',
      summary TEXT DEFAULT '',
      date TEXT NOT NULL,
      category TEXT DEFAULT '未分类',
      tags TEXT DEFAULT '[]',
      word_count INTEGER DEFAULT 0,
      read_time INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await sqliteRun(`CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      cover TEXT DEFAULT '',
      url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await sqliteRun(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await sqliteRun(`CREATE TABLE IF NOT EXISTS diaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await insertDefaults();
  } else {
    // JSON mode
    if (!data.users || data.users.length === 0) {
      await insertDefaults();
    }
  }

  console.log('Database initialized');
}

async function insertDefaults() {
  const bcryptjs = await import('bcryptjs');

  // Default admin
  const admin = await get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!admin) {
    const hashedPassword = await bcryptjs.default.hash('admin123', 10);
    await run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
    console.log('Default admin created: admin / admin123');
  }

  // Default config
  const config = await get('SELECT * FROM site_config WHERE id = 1');
  if (!config) {
    await run(`INSERT INTO site_config (id, avatar, author, nickname, bio, subtitle, announcement, github, email)
      VALUES (1, '', 'ruaruarua coder', '@Rua', 'Java后端 | AI Agent探索者', '「吃个面皮」',
      '欢迎来到我的博客！目前正在寻找 Java 后端开发工程师的实习/全职机会。',
      'https://github.com/wangpeizhao', '')`);
  }

  // Default posts
  const postsCount = await get('SELECT COUNT(*) as count FROM posts');
  if (postsCount.count === 0) {
    const defaultPosts = [
      ['🌟 简单自我介绍一下', 'guide', '一个在大学的海洋中挣扎求生的过度思考者，正在将屎山雕琢成艺术品的路上...', '2025-09-08', '生活随笔', '["OverThinker","自我介绍","博客","思考"]', 308, 2],
      ['基于Websocket制作的网页聊天室', 'chatroom', '一个基于 Java WebSocket 开发的网页聊天室，支持实时消息推送与多人在线。', '2026-04-10', '项目', '["Spring Web","网页聊天室","项目","Java"]', 2173, 11],
      ['七大排序算法奇幻之旅', 'sorting-algorithms', '从冒泡排序到快速排序，用生动的比喻带你走完七大经典排序算法的奇幻旅程。', '2025-08-22', '数据结构', '["Java","数据结构","博客","排序算法"]', 3673, 18],
      ['🥊 Map和Set：哈希表与二叉搜索树的对决', 'map-set', 'HashMap vs TreeMap，哈希表和二叉搜索树在 Java 集合框架中的较量。', '2025-08-17', '数据结构', '["Java","数据结构","博客","HashMap","TreeMap"]', 2847, 14],
      ['Redis缓存设计与实战', 'redis-cache', '从缓存穿透到缓存击穿的完整防护方案设计与实战代码解析。', '2025-12-15', '后端架构', '["Redis","缓存","博客","后端架构"]', 4520, 22],
      ['AgentForge · AI智能体通用脚手架', 'agentforge', '企业级 AI Agent 通用脚手架，基于 DDD 六边形架构设计，支持低代码动态组装工作流。', '2026-03-20', 'AI Agent', '["AI Agent","DDD","六边形架构","LangChain4j"]', 3890, 20],
    ];
    for (const p of defaultPosts) {
      await run('INSERT INTO posts (title, slug, summary, date, category, tags, word_count, read_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', p);
    }
  }

  // Default songs
  const songsCount = await get('SELECT COUNT(*) as count FROM songs');
  if (songsCount.count === 0) {
    const defaultSongs = [
      ['夜空中最亮的星', '逃跑计划', 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=200&h=200&fit=crop', 'https://music.163.com/song/media/outer/url?id=25706282.mp3'],
      ['晴天', '周杰伦', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop', 'https://music.163.com/song/media/outer/url?id=108418'],
      ['起风了', '买辣椒也用券', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', 'https://music.163.com/song/media/outer/url?id=1338695683'],
    ];
    for (const s of defaultSongs) {
      await run('INSERT INTO songs (title, artist, cover, url) VALUES (?, ?, ?, ?)', s);
    }
  }

  // Default message
  const msgCount = await get('SELECT COUNT(*) as count FROM messages');
  if (msgCount.count === 0) {
    await run('INSERT INTO messages (name, content, date) VALUES (?, ?, ?)', ['访客', '欢迎来到留言板！留下你想说的话吧~', '2025-09-10']);
  }
}

// Generic query functions that work with both SQLite and JSON
export async function get(sql: string, params: any[] = []): Promise<any> {
  if (sqliteAvailable) {
    return sqliteGet(sql, params);
  }
  // JSON fallback - simple parsing
  const table = extractTable(sql);
  if (!table) return null;
  const rows = data[table] || [];
  if (!Array.isArray(rows)) return null;
  if (sql.includes('WHERE username =')) {
    return rows.find((r: any) => r.username === params[0]) || null;
  }
  if (sql.includes('WHERE id =')) {
    return rows.find((r: any) => String(r.id) === String(params[0])) || null;
  }
  if (sql.includes('WHERE slug =')) {
    return rows.find((r: any) => r.slug === params[0]) || null;
  }
  if (sql.includes('COUNT')) {
    return { count: rows.length };
  }
  return rows[0] || null;
}

export async function all(sql: string, params: any[] = []): Promise<any[]> {
  if (sqliteAvailable) {
    return sqliteAll(sql, params);
  }
  const table = extractTable(sql);
  if (!table) return [];
  let rows = data[table] || [];
  if (!Array.isArray(rows)) return [];
  // Sort by date desc
  if (sql.includes('ORDER BY date DESC') || sql.includes('ORDER BY created_at DESC')) {
    rows = [...rows].sort((a: any, b: any) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime());
  }
  return rows;
}

export async function run(sql: string, params: any[] = []): Promise<void> {
  if (sqliteAvailable) {
    return sqliteRun(sql, params);
  }
  // JSON fallback
  const table = extractTable(sql);
  if (!table) return;
  
  if (sql.includes('INSERT INTO')) {
    const newRow: any = { id: Date.now() };
    const columns = extractColumns(sql);
    columns.forEach((col, i) => {
      newRow[col] = params[i];
    });
    newRow.created_at = new Date().toISOString();
    data[table].push(newRow);
  } else if (sql.includes('DELETE FROM')) {
    if (sql.includes('WHERE id =')) {
      const id = params[0];
      data[table] = data[table].filter((r: any) => String(r.id) !== String(id));
    }
  } else if (sql.includes('UPDATE')) {
    const id = params[params.length - 1];
    const row = data[table].find((r: any) => String(r.id) === String(id));
    if (row) {
      const columns = extractColumns(sql);
      columns.forEach((col, i) => {
        if (params[i] !== undefined) row[col] = params[i];
      });
      row.updated_at = new Date().toISOString();
    }
  }
  saveToJSON();
}

function extractTable(sql: string): string | null {
  const match = sql.match(/(?:INSERT INTO|SELECT.*FROM|DELETE FROM|UPDATE)\s+(\w+)/);
  return match ? match[1] : null;
}

function extractColumns(sql: string): string[] {
  const match = sql.match(/\(([^)]+)\)/);
  return match ? match[1].split(',').map(c => c.trim()) : [];
}

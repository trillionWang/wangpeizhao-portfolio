import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

export interface UserRecord {
  id: number;
  username: string;
  password: string;
}

export interface SiteConfig {
  brand: string;
  avatar: string;
  author: string;
  nickname: string;
  bio: string;
  subtitle: string;
  announcement: string;
  github: string;
  email: string;
  location: string;
  targetRole: string;
  heroImage: string;
  deepseek_key?: string;
}

export interface PostRecord {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  word_count: number;
  read_time: number;
  published: number;
  created_at: string;
  updated_at: string;
}

export interface SongRecord {
  id: number;
  title: string;
  artist: string;
  cover: string;
  url: string;
  created_at: string;
}

export interface MessageRecord {
  id: number;
  name: string;
  content: string;
  date: string;
}

export interface MediaRecord {
  id: number;
  type: 'image' | 'audio' | 'file';
  title: string;
  url: string;
  filename: string;
  mime: string;
  size: number;
  album: string;
  description: string;
  created_at: string;
}

export interface KnowledgeRecord {
  id: number;
  title: string;
  category: 'profile' | 'project' | 'skill' | 'experience' | 'life' | 'other';
  content: string;
  tags: string[];
  public: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProjectRecord {
  id: number;
  title: string;
  role: string;
  summary: string;
  description: string;
  techStack: string[];
  highlights: string[];
  challenges: string[];
  outcomes: string[];
  repoUrl: string;
  demoUrl: string;
  cover: string;
  status: 'completed' | 'in-progress';
  featured: number;
  public: number;
  sort: number;
  created_at: string;
  updated_at: string;
}

export interface SkillRecord {
  id: number;
  name: string;
  category: string;
  level: number;
  keywords: string[];
  description: string;
  public: number;
  sort: number;
}

interface DB {
  users: UserRecord[];
  config: SiteConfig;
  posts: PostRecord[];
  songs: SongRecord[];
  messages: MessageRecord[];
  media: MediaRecord[];
  knowledge: KnowledgeRecord[];
  projects: PortfolioProjectRecord[];
  skills: SkillRecord[];
}

const defaultConfig: SiteConfig = {
  brand: 'rua',
  avatar: '',
  author: '王沛钊',
  nickname: '@trillionWang',
  bio: '面向秋招的 Java 后端开发者，持续实践 AI Agent、RAG、Web 实时通信和复杂业务系统工程化。',
  subtitle: '在线简历、项目作品集与生活记录',
  announcement: '这里会持续更新我的项目复盘、技术文章、相册和生活记录。后台入口不在公开页面暴露。',
  github: 'https://github.com/trillionWang',
  email: '',
  location: '中国',
  targetRole: 'Java 后端开发工程师 / AI 应用工程师',
  heroImage: '',
  deepseek_key: '',
};

let db: DB = {
  users: [],
  config: defaultConfig,
  posts: [],
  songs: [],
  messages: [],
  media: [],
  knowledge: [],
  projects: [],
  skills: [],
};

function now() {
  return new Date().toISOString();
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function nextId(items: Array<{ id: number }>) {
  return items.length ? Math.max(...items.map(item => Number(item.id) || 0)) + 1 : 1;
}

function ensureUniqueIds<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>();
  return items.map((item, index) => {
    const id = Number(item.id) || index + 1;
    if (!seen.has(id)) {
      seen.add(id);
      return { ...item, id };
    }
    const next = Math.max(...seen, 0) + 1;
    seen.add(next);
    return { ...item, id: next };
  });
}

function isMojibake(value?: string) {
  return !!value && /[�锟]|[\u00c0-\u00ff]{2,}|[閿鐢绋鍙戝垎鏂炵珯]/.test(value);
}

function cleanText(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() && !isMojibake(value) ? value : fallback;
}

function cleanConfig(config: Partial<SiteConfig> = {}): SiteConfig {
  return {
    brand: cleanText(config.brand, defaultConfig.brand),
    avatar: typeof config.avatar === 'string' && !isMojibake(config.avatar) ? config.avatar : defaultConfig.avatar,
    author: cleanText(config.author, defaultConfig.author),
    nickname: cleanText(config.nickname, defaultConfig.nickname),
    bio: cleanText(config.bio, defaultConfig.bio),
    subtitle: cleanText(config.subtitle, defaultConfig.subtitle),
    announcement: cleanText(config.announcement, defaultConfig.announcement),
    github: cleanText(config.github, defaultConfig.github),
    email: typeof config.email === 'string' && !isMojibake(config.email) ? config.email : defaultConfig.email,
    location: cleanText(config.location, defaultConfig.location),
    targetRole: cleanText(config.targetRole, defaultConfig.targetRole),
    heroImage: typeof config.heroImage === 'string' && !isMojibake(config.heroImage) ? config.heroImage : defaultConfig.heroImage,
    deepseek_key: typeof config.deepseek_key === 'string' ? config.deepseek_key : defaultConfig.deepseek_key,
  };
}

function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map(item => item.trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(/[\n,，;；|]+/).map(item => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizePost(post: Partial<PostRecord>): PostRecord {
  const content = cleanText(post.content, '');
  const wordCount = Number(post.word_count) || content.replace(/\s/g, '').length || 0;
  return {
    id: Number(post.id) || nextId(db.posts),
    title: cleanText(post.title, '未命名文章'),
    slug: cleanText(post.slug, `post-${Date.now()}`),
    summary: cleanText(post.summary, content.slice(0, 120)),
    content,
    date: cleanText(post.date, today()),
    category: cleanText(post.category, '生活记录'),
    tags: toList(post.tags).filter(tag => !isMojibake(tag)),
    cover: typeof post.cover === 'string' && !isMojibake(post.cover) ? post.cover : '',
    word_count: wordCount,
    read_time: Number(post.read_time) || Math.max(1, Math.ceil(wordCount / 350)),
    published: post.published ?? 1,
    created_at: post.created_at || now(),
    updated_at: post.updated_at || now(),
  };
}

function normalizeKnowledge(item: Partial<KnowledgeRecord>): KnowledgeRecord {
  return {
    id: Number(item.id) || nextId(db.knowledge),
    title: cleanText(item.title, '未命名知识'),
    category: item.category || 'other',
    content: cleanText(item.content, ''),
    tags: toList(item.tags).filter(tag => !isMojibake(tag)),
    public: item.public ?? 1,
    created_at: item.created_at || now(),
    updated_at: item.updated_at || now(),
  };
}

function normalizeProject(item: Partial<PortfolioProjectRecord>): PortfolioProjectRecord {
  return {
    id: Number(item.id) || nextId(db.projects),
    title: cleanText(item.title, '未命名项目'),
    role: cleanText(item.role, '负责人'),
    summary: cleanText(item.summary, ''),
    description: cleanText(item.description, ''),
    techStack: toList(item.techStack).filter(tag => !isMojibake(tag)),
    highlights: toList(item.highlights).filter(tag => !isMojibake(tag)),
    challenges: toList(item.challenges).filter(tag => !isMojibake(tag)),
    outcomes: toList(item.outcomes).filter(tag => !isMojibake(tag)),
    repoUrl: cleanText(item.repoUrl, ''),
    demoUrl: cleanText(item.demoUrl, ''),
    cover: typeof item.cover === 'string' && !isMojibake(item.cover) ? item.cover : '',
    status: item.status || 'completed',
    featured: item.featured ?? 1,
    public: item.public ?? 1,
    sort: Number(item.sort) || 0,
    created_at: item.created_at || now(),
    updated_at: item.updated_at || now(),
  };
}

function normalizeSkill(item: Partial<SkillRecord>): SkillRecord {
  return {
    id: Number(item.id) || nextId(db.skills),
    name: cleanText(item.name, 'Skill'),
    category: cleanText(item.category, '后端'),
    level: Math.min(100, Math.max(1, Number(item.level) || 70)),
    keywords: toList(item.keywords).filter(tag => !isMojibake(tag)),
    description: cleanText(item.description, ''),
    public: item.public ?? 1,
    sort: Number(item.sort) || 0,
  };
}

function load() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) return;

  try {
    const loaded = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    db = {
      users: Array.isArray(loaded.users) ? loaded.users : [],
      config: cleanConfig(loaded.config || {}),
      posts: ensureUniqueIds(Array.isArray(loaded.posts) ? loaded.posts.map(normalizePost) : []),
      songs: ensureUniqueIds(Array.isArray(loaded.songs) ? loaded.songs : []),
      messages: ensureUniqueIds(Array.isArray(loaded.messages) ? loaded.messages : []),
      media: ensureUniqueIds(Array.isArray(loaded.media) ? loaded.media : []),
      knowledge: ensureUniqueIds(Array.isArray(loaded.knowledge) ? loaded.knowledge.map(normalizeKnowledge) : []),
      projects: ensureUniqueIds(Array.isArray(loaded.projects) ? loaded.projects.map(normalizeProject) : []),
      skills: ensureUniqueIds(Array.isArray(loaded.skills) ? loaded.skills.map(normalizeSkill) : []),
    };
  } catch (error) {
    console.error('Failed to load data/db.json:', error);
  }
}

function save() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

load();

export async function initDatabase() {
  const bcryptjs = await import('bcryptjs');

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change')) {
      throw new Error('Production requires a strong JWT_SECRET.');
    }
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'admin123') {
      throw new Error('Production requires ADMIN_PASSWORD.');
    }
  }

  const adminUser = process.env.ADMIN_USER || 'admin';
  if (!db.users.find(user => user.username === adminUser)) {
    db.users.push({
      id: nextId(db.users),
      username: adminUser,
      password: await bcryptjs.default.hash(process.env.ADMIN_PASSWORD || 'admin123', 10),
    });
    console.log('Default admin created. Change ADMIN_USER and ADMIN_PASSWORD before production.');
  }

  db.config = cleanConfig(db.config);

  if (db.projects.length === 0) {
    db.projects = ensureUniqueIds([
      normalizeProject({
        title: 'AgentForge AI 智能体编排平台',
        role: '后端开发 / Agent 架构设计',
        summary: '面向企业业务流程的 AI Agent 编排原型，支持工具调用、RAG 知识注入和流程配置。',
        description: '基于领域分层组织核心能力，围绕工具注册、上下文构建、执行日志和可观测性设计后端接口。',
        techStack: ['Java', 'Spring Boot', 'LangChain4j', 'Redis', 'MySQL', 'RAG'],
        highlights: ['可插拔工具调用', '本地知识库检索', '执行链路日志', '后台可配置'],
        challenges: ['Agent 状态管理', '工具调用稳定性', '知识检索命中率'],
        outcomes: ['沉淀 AI 应用工程化经验', '形成可复用的 Agent 后端脚手架'],
        sort: 1,
      }),
      normalizeProject({
        title: 'WebSocket 实时聊天室',
        role: '后端开发',
        summary: '支持多人在线、实时消息推送、会话管理和在线状态维护的网页聊天室。',
        description: '围绕连接生命周期、消息广播、异常断连和在线用户状态进行设计，强化实时通信能力。',
        techStack: ['Java', 'Spring Boot', 'WebSocket', 'Redis'],
        highlights: ['实时双向通信', '在线状态维护', '消息广播', '异常断连清理'],
        challenges: ['连接资源释放', '并发消息一致性', '多端状态同步'],
        outcomes: ['强化网络编程和后端状态管理能力'],
        sort: 2,
      }),
    ]);
  }

  if (db.skills.length === 0) {
    db.skills = ensureUniqueIds([
      normalizeSkill({ name: 'Java / Spring Boot', category: '后端', level: 86, keywords: ['Java', 'Spring Boot', 'REST API'], description: '熟悉后端 API、业务分层、权限认证和工程化实践。', sort: 1 }),
      normalizeSkill({ name: 'Redis / MySQL', category: '数据', level: 78, keywords: ['Redis', 'MySQL', '缓存', '索引'], description: '理解缓存、索引、事务和常见性能优化。', sort: 2 }),
      normalizeSkill({ name: 'AI Agent / RAG', category: 'AI', level: 74, keywords: ['Agent', 'RAG', 'Function Calling'], description: '持续实践 Agent 工作流、知识库和工具调用。', sort: 3 }),
      normalizeSkill({ name: '部署与工程化', category: '工程', level: 72, keywords: ['Git', 'Linux', 'CI', 'Node'], description: '关注可维护性、可观测性和部署稳定性。', sort: 4 }),
    ]);
  }

  if (db.knowledge.length === 0) {
    db.knowledge = ensureUniqueIds([
      normalizeKnowledge({
        title: '个人定位',
        category: 'profile',
        content: '王沛钊正在准备秋招，目标岗位是 Java 后端开发工程师，也关注 AI Agent 和 AI 应用工程化方向。',
        tags: ['简历', '求职', '后端'],
      }),
      normalizeKnowledge({
        title: '技术兴趣',
        category: 'skill',
        content: '重点关注 Java 后端、Spring Boot、Redis、MySQL、WebSocket、DDD、AI Agent、RAG 和 Function Calling。',
        tags: ['技术栈', 'AI'],
      }),
    ]);
  }

  if (db.posts.length === 0) {
    db.posts = [
      normalizePost({
        title: '你好，我是王沛钊',
        slug: 'hello',
        summary: '这里会记录我的项目、技术成长、生活片段和长期思考。',
        content: '## 关于这里\n\n这里既是在线简历，也是我的长期记录空间。我会持续补充项目复盘、技术文章、相册和生活记录。',
        category: '生活记录',
        tags: ['个人网站', '秋招', '记录'],
      }),
    ];
  }

  if (db.songs.length === 0) {
    db.songs = [
      {
        id: nextId(db.songs),
        title: '夜空中最亮的星',
        artist: '逃跑计划',
        cover: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=400&fit=crop',
        url: 'https://music.163.com/song/media/outer/url?id=25706282.mp3',
        created_at: now(),
      },
    ];
  }

  if (db.messages.length === 0) {
    db.messages.push({ id: nextId(db.messages), name: '访客', content: '欢迎来到留言板。', date: today() });
  }

  save();
  console.log('Database initialized at data/db.json');
}

export type TableName = keyof DB;

export function findOne<T = any>(table: TableName, where: (item: T) => boolean): T | null {
  const value = db[table];
  if (!Array.isArray(value)) return null;
  return (value as T[]).find(where) || null;
}

export function findAll<T = any>(table: TableName): T[] {
  const value = db[table];
  return Array.isArray(value) ? [...(value as T[])] : [];
}

export function insert<T extends Record<string, any>>(table: TableName, item: T): T {
  const value = db[table];
  if (!Array.isArray(value)) throw new Error(`${String(table)} is not an array table`);
  const newItem = { ...item, id: item.id || nextId(value as Array<{ id: number }>) };
  (value as T[]).push(newItem);
  save();
  return newItem;
}

export function update(table: TableName, where: (item: any) => boolean, data: any): boolean {
  const value = db[table];
  if (!Array.isArray(value)) return false;
  const idx = value.findIndex(where);
  if (idx === -1) return false;
  value[idx] = { ...value[idx], ...data, updated_at: now() };
  save();
  return true;
}

export function remove(table: TableName, where: (item: any) => boolean): boolean {
  const value = db[table];
  if (!Array.isArray(value)) return false;
  const len = value.length;
  (db as any)[table] = value.filter((item: any) => !where(item));
  if (((db as any)[table] || []).length < len) {
    save();
    return true;
  }
  return false;
}

export function getConfig(): SiteConfig {
  return cleanConfig(db.config);
}

export function setConfig(newConfig: Partial<SiteConfig>) {
  db.config = cleanConfig({ ...db.config, ...newConfig });
  save();
}

export function getPublicProfile() {
  const { deepseek_key: _deepseekKey, ...safeConfig } = getConfig();
  return {
    config: safeConfig,
    projects: findAll<PortfolioProjectRecord>('projects').filter(project => project.public !== 0).sort((a, b) => a.sort - b.sort),
    skills: findAll<SkillRecord>('skills').filter(skill => skill.public !== 0).sort((a, b) => a.sort - b.sort),
    posts: findAll<PostRecord>('posts').filter(post => post.published !== 0).slice(0, 6),
  };
}

export function getTable<T = any>(table: TableName): T[] {
  return findAll<T>(table);
}

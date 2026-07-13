import { posts as staticPosts } from '../data/posts';
import { albums, media, songs } from '../data/content';
import { knowledge, profileConfig, projects, skills } from '../data/portfolio';

export const ADMIN_BASE = '/content-by-git';

const messagesKey = 'rua_static_messages';

function wait<T>(value: T) {
  return Promise.resolve(value);
}

function postForApi(post: (typeof staticPosts)[number]) {
  return {
    id: Number(post.id),
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content,
    date: post.date,
    category: post.category,
    tags: post.tags,
    cover: post.cover || '',
    word_count: post.wordCount,
    read_time: post.readTime,
    published: 1,
  };
}

function readLocalMessages() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(messagesKey) || '[]');
  } catch {
    return [];
  }
}

function writeLocalMessages(messages: unknown[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(messagesKey, JSON.stringify(messages));
}

function staticModeError() {
  return Promise.reject(new Error('当前站点为静态部署模式，请在仓库文件中更新内容后提交 Git。'));
}

export async function login() {
  return { error: '静态部署模式没有在线后台，请通过 Git 更新内容。' };
}

export async function getMe() {
  return null;
}

export function logout() {
  return undefined;
}

export async function getProfile() {
  return wait({
    ...profileConfig,
    projects: projects.filter(project => project.public),
    skills: skills.filter(skill => skill.public),
  });
}

export async function getPublicProjects() {
  return wait(projects.filter(project => project.public).sort((a, b) => a.sort - b.sort));
}

export async function getPublicSkills() {
  return wait(skills.filter(skill => skill.public).sort((a, b) => a.sort - b.sort));
}

export async function getVisitorInfo() {
  const fallback = { location: '未知地区', isp: '' };
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('ipapi failed');
    const data = await res.json();
    const location = [data.city, data.region, data.country_name].filter(Boolean).join(' / ');
    return {
      location: location || fallback.location,
      isp: data.org || '',
    };
  } catch {
    try {
      const res = await fetch('https://ipwho.is/');
      const data = await res.json();
      if (!data.success) return fallback;
      const location = [data.city, data.region, data.country].filter(Boolean).join(' / ');
      return {
        location: location || fallback.location,
        isp: data.connection?.isp || '',
      };
    } catch {
      return fallback;
    }
  }
}

export async function getPosts() {
  return wait(staticPosts.map(postForApi));
}

export async function getPost(slug: string) {
  const post = staticPosts.find(item => item.slug === slug);
  return wait(post ? postForApi(post) : { error: '文章不存在' });
}

export const createPost = staticModeError;
export const updatePost = staticModeError;
export const deletePost = staticModeError;

export async function getConfig() {
  return wait(profileConfig);
}

export const updateConfig = staticModeError;

export async function getAIKeyStatus() {
  return { hasKey: false, staticMode: true };
}

export const updateAIKey = staticModeError;

export async function getKnowledge() {
  return wait(knowledge);
}

export const createKnowledge = staticModeError;
export const updateKnowledge = staticModeError;
export const deleteKnowledge = staticModeError;

export async function getPortfolioProjects() {
  return getPublicProjects();
}

export const createPortfolioProject = staticModeError;
export const updatePortfolioProject = staticModeError;
export const deletePortfolioProject = staticModeError;

export async function getSongs() {
  return wait(songs);
}

export const createSong = staticModeError;
export const deleteSong = staticModeError;

export async function getMessages() {
  const seed = [
    {
      id: 1,
      name: 'rua',
      content: '欢迎来到留言板。静态部署下留言会保存在当前浏览器，本人内容更新会通过 Git 提交。',
      date: '2026-07-12',
    },
  ];
  return wait([...seed, ...readLocalMessages()]);
}

export async function createMessage(name: string, content: string) {
  const messages = readLocalMessages();
  const message = {
    id: Date.now(),
    name,
    content,
    date: new Date().toISOString().slice(0, 10),
  };
  writeLocalMessages([message, ...messages]);
  return wait(message);
}

export const deleteMessage = staticModeError;

function findRelevantKnowledge(message: string) {
  const q = message.toLowerCase();
  const corpus = [
    ...knowledge.map(item => ({
      title: item.title,
      content: item.content,
      tags: item.tags,
    })),
    ...projects.map(project => ({
      title: project.title,
      content: `${project.summary} ${project.description} 技术栈：${project.techStack.join('、')}。亮点：${project.highlights.join('、')}。`,
      tags: project.techStack,
    })),
    ...skills.map(skill => ({
      title: skill.name,
      content: `${skill.category}能力：${skill.description}`,
      tags: skill.keywords,
    })),
    ...staticPosts.map(post => ({
      title: post.title,
      content: `${post.summary} ${post.tags.join('、')}`,
      tags: post.tags,
    })),
  ];

  return corpus
    .map(item => {
      const haystack = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
      const score = [...new Set(q.split(/\s+|，|。|、|,|\?/).filter(Boolean))]
        .reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export async function chatWithAI(message: string) {
  const q = message.toLowerCase();

  if (/联系方式|邮箱|email|github|联系/.test(q)) {
    return wait({
      content: `可以通过 GitHub 和邮箱联系王沛钊：\n- GitHub：${profileConfig.github}\n- Email：${profileConfig.email}`,
      staticMode: true,
    });
  }

  if (/项目|作品|经历|project/.test(q)) {
    return wait({
      content: `目前重点展示这些项目：\n${projects
        .filter(project => project.public)
        .map(project => `- ${project.title}：${project.summary} 技术栈：${project.techStack.join('、')}`)
        .join('\n')}`,
      staticMode: true,
    });
  }

  if (/技能|技术栈|能力|skill/.test(q)) {
    return wait({
      content: `他的核心技术栈包括：\n${skills
        .filter(skill => skill.public)
        .map(skill => `- ${skill.name}（${skill.category}）：${skill.description}`)
        .join('\n')}`,
      staticMode: true,
    });
  }

  if (/文章|博客|记录|post/.test(q)) {
    return wait({
      content: `站内最近的文章/记录：\n${staticPosts
        .slice(0, 5)
        .map(post => `- ${post.title}（${post.category}）：${post.summary}`)
        .join('\n')}`,
      staticMode: true,
    });
  }

  if (/照片|相册|音乐|生活/.test(q)) {
    return wait({
      content: `生活记录入口包括相册、日记、音乐和留言板。目前有 ${albums.length} 个相册、${songs.length} 首音乐，内容通过仓库文件长期保存。`,
      staticMode: true,
    });
  }

  const matches = findRelevantKnowledge(message);
  if (matches.length) {
    return wait({
      content: matches.map(item => `- ${item.title}：${item.content}`).join('\n'),
      staticMode: true,
    });
  }

  return wait({
    content: '我是王沛钊个人主页的静态 AI 助手，可以回答他的项目、技术栈、联系方式、文章记录和生活内容。当前站点不连接外部大模型，因此不会暴露 API Key。',
    staticMode: true,
  });
}

export async function getUploads() {
  return wait(media);
}

export const uploadFile = staticModeError;
export const deleteUpload = staticModeError;

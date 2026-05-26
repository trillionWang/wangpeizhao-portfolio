export interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  wordCount: number;
  readTime: number;
  slug: string;
}

export const posts: Post[] = [
  {
    id: "1",
    title: "🌟 简单自我介绍一下",
    date: "2025-09-08",
    category: "生活随笔",
    tags: ["OverThinker", "自我介绍", "博客", "思考"],
    summary: "一个在大学的海洋中挣扎求生的过度思考者，正在将屎山雕琢成艺术品的路上...",
    content: "",
    wordCount: 308,
    readTime: 2,
    slug: "guide"
  },
  {
    id: "2",
    title: "基于Websocket制作的网页聊天室",
    date: "2026-04-10",
    category: "项目",
    tags: ["Spring Web", "网页聊天室", "项目", "Java"],
    summary: "一个基于 Java WebSocket 开发的网页聊天室，支持实时消息推送与多人在线。",
    content: "",
    wordCount: 2173,
    readTime: 11,
    slug: "chatroom"
  },
  {
    id: "3",
    title: "七大排序算法奇幻之旅",
    date: "2025-08-22",
    category: "数据结构",
    tags: ["Java", "数据结构", "博客", "排序算法"],
    summary: "从冒泡排序到快速排序，用生动的比喻带你走完七大经典排序算法的奇幻旅程。",
    content: "",
    wordCount: 3673,
    readTime: 18,
    slug: "sorting-algorithms"
  },
  {
    id: "4",
    title: "🥊 Map和Set：哈希表与二叉搜索树的对决",
    date: "2025-08-17",
    category: "数据结构",
    tags: ["Java", "数据结构", "博客", "HashMap", "TreeMap"],
    summary: "HashMap vs TreeMap，哈希表和二叉搜索树在 Java 集合框架中的较量。",
    content: "",
    wordCount: 2847,
    readTime: 14,
    slug: "map-set"
  },
  {
    id: "5",
    title: "Redis缓存设计与实战",
    date: "2025-12-15",
    category: "后端架构",
    tags: ["Redis", "缓存", "博客", "后端架构"],
    summary: "从缓存穿透到缓存击穿的完整防护方案设计与实战代码解析。",
    content: "",
    wordCount: 4520,
    readTime: 22,
    slug: "redis-cache"
  },
  {
    id: "6",
    title: "AgentForge · AI智能体通用脚手架",
    date: "2026-03-20",
    category: "AI Agent",
    tags: ["AI Agent", "DDD", "六边形架构", "LangChain4j"],
    summary: "企业级 AI Agent 通用脚手架，基于 DDD 六边形架构设计，支持低代码动态组装工作流。",
    content: "",
    wordCount: 3890,
    readTime: 20,
    slug: "agentforge"
  }
];

export const categories = [
  { name: "项目", count: 1 },
  { name: "后端架构", count: 1 },
  { name: "AI Agent", count: 1 },
  { name: "数据结构", count: 2 },
  { name: "生活随笔", count: 1 },
  { name: "留言板", count: 0 },
];

export const tags = [
  "Java", "SpringBoot", "Redis", "Kafka", "MySQL",
  "AI Agent", "LangChain4j", "DDD", "数据结构", "博客"
];

export const friends = [
  { name: "OverThinker", desc: "一个过度思考者的博客", url: "https://www.overthinker13.cn/", avatar: "📚" },
];

export const announcements = {
  title: "公告",
  content: "欢迎来到我的博客！目前正在寻找 Java 后端开发工程师的实习/全职机会。",
  link: "#",
  linkText: "了解更多"
};

export const siteConfig = {
  title: "ruaruarua coder",
  subtitle: "Java后端 | AI Agent探索者",
  author: "ruaruarua coder",
  nickname: "@Rua",
  bio: "「吃个面皮」",
  avatar: "/avatar.jpg",
  social: {
    github: "https://github.com/wangpeizhao",
    email: "mailto:contact@wangpeizhao.top"
  },
  typingTexts: [
    "Java后端开发工程师",
    "AI Agent 探索者",
    "「吃个面皮」"
  ]
};

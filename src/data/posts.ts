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
  cover?: string;
}

export const posts: Post[] = [
  {
    id: '1',
    title: '你好，我是王沛钊',
    date: '2026-07-12',
    category: '生活随笔',
    tags: ['个人网站', '秋招', '记录'],
    summary: '这个站点会记录我的学习、项目、生活碎片和一些长期思考，也会作为秋招阶段的在线简历。',
    content: `## 关于这里

这里既是作品集，也是博客和个人档案库。我会把技术文章、项目复盘、相册、音乐和日常记录都放在这里。

## 更新方式

现在站点采用静态文件持久化：文章、项目、技能、照片和音乐都写在仓库文件里，提交到 GitHub 后由部署平台自动构建。这样没有数据库丢失风险，也不需要把后台暴露在公网。

## 近期重点

- Java 后端工程能力
- Spring Boot、Redis、MySQL、WebSocket
- AI Agent、RAG、Function Calling
- 面向秋招的项目表达和复盘`,
    wordCount: 282,
    readTime: 2,
    slug: 'hello',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=640&fit=crop',
  },
  {
    id: '2',
    title: 'AgentForge：AI 智能体通用脚手架',
    date: '2026-03-20',
    category: 'AI Agent',
    tags: ['AI Agent', 'DDD', 'RAG', 'Function Calling'],
    summary: '面向企业业务流程的 AI Agent 低代码编排原型，重点沉淀工具调用、知识检索和工程化能力。',
    content: `## 项目背景

AgentForge 是我围绕 AI Agent 工程化做的通用脚手架探索，目标是把工具调用、流程编排、知识检索和业务配置拆成更清晰的模块。

## 技术要点

- 使用 DDD 和六边形架构组织核心领域能力
- 将工具调用抽象成可注册、可观测、可测试的执行单元
- 预留 RAG 知识库接入方式，便于注入个人资料、项目说明或业务文档
- 关注日志、状态管理和异常恢复，避免 Agent 只停留在 Demo 层面

## 收获

这个项目让我更系统地理解了 AI 应用从“能回答”到“能稳定执行任务”之间的工程差距。`,
    wordCount: 356,
    readTime: 2,
    slug: 'agentforge',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=640&fit=crop',
  },
  {
    id: '3',
    title: '基于 WebSocket 的实时聊天室',
    date: '2026-04-10',
    category: '项目复盘',
    tags: ['Java', 'Spring Boot', 'WebSocket', 'Redis'],
    summary: '一个支持多人在线、实时消息推送和会话管理的网页聊天室项目。',
    content: `## 核心能力

聊天室项目重点处理连接生命周期、消息广播、异常断连和在线用户状态维护。

## 我关注的问题

- WebSocket 连接的建立、心跳和断开清理
- 多人消息广播和用户状态同步
- Redis 在在线状态、临时会话和消息扩展中的使用
- 前后端交互协议的设计

## 复盘

这个项目让我对网络编程、后端状态管理和并发场景下的边界问题更敏感。`,
    wordCount: 248,
    readTime: 2,
    slug: 'chatroom',
    cover: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&h=640&fit=crop',
  },
  {
    id: '4',
    title: 'Redis 缓存设计与常见问题',
    date: '2025-12-15',
    category: '后端架构',
    tags: ['Redis', '缓存', '后端架构', '性能优化'],
    summary: '从缓存穿透、缓存击穿到缓存雪崩，整理后端系统中常见缓存问题的处理思路。',
    content: `## 常见问题

- 缓存穿透：查询不存在的数据，绕过缓存持续打到数据库
- 缓存击穿：热点 Key 失效后瞬间大量请求打到数据库
- 缓存雪崩：大量 Key 同时失效造成数据库压力突增

## 处理思路

- 对空值做短期缓存
- 使用布隆过滤器过滤明显不存在的请求
- 热点 Key 加互斥锁或逻辑过期
- 给过期时间增加随机偏移

缓存不是简单地加一层 Redis，而是要根据业务读写模式设计一致性、可用性和成本之间的平衡。`,
    wordCount: 312,
    readTime: 2,
    slug: 'redis-cache',
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=640&fit=crop',
  },
  {
    id: '5',
    title: '七大排序算法学习记录',
    date: '2025-08-22',
    category: '数据结构',
    tags: ['Java', '数据结构', '算法', '排序'],
    summary: '从冒泡排序到快速排序，记录经典排序算法的思想、复杂度和适用场景。',
    content: `## 学习重点

排序算法是理解复杂度、交换、分治和稳定性的好入口。

- 冒泡排序：实现简单，适合入门理解交换
- 插入排序：对近乎有序的数据表现较好
- 归并排序：稳定，适合理解分治
- 快速排序：平均性能优秀，但需要注意基准选择

后续我会继续补充代码实现和图解。`,
    wordCount: 216,
    readTime: 2,
    slug: 'sorting-algorithms',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=640&fit=crop',
  },
  {
    id: '6',
    title: 'Map 和 Set：哈希表与树结构',
    date: '2025-08-17',
    category: '数据结构',
    tags: ['Java', 'HashMap', 'TreeMap', '集合框架'],
    summary: '整理 Java 集合中 Map、Set 相关结构的底层思想和使用差异。',
    content: `## 对比维度

HashMap 更关注平均 O(1) 的查询性能，TreeMap 更关注有序遍历和范围查询。

## 面试表达

回答这类问题时，不只背结论，还要说明：

- 数据结构是什么
- 查询、插入、删除复杂度如何
- 是否保持顺序
- 哪些业务场景更适合它

这类基础题其实很适合展示自己对工程选型的理解。`,
    wordCount: 238,
    readTime: 2,
    slug: 'map-set',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=640&fit=crop',
  },
];

export const categories = Array.from(
  posts.reduce((acc, post) => {
    acc.set(post.category, (acc.get(post.category) || 0) + 1);
    return acc;
  }, new Map<string, number>())
).map(([name, count]) => ({ name, count }));

export const tags = Array.from(new Set(posts.flatMap(post => post.tags)));

export const friends = [
  {
    name: 'OverThinker',
    desc: '一个过度思考者的个人博客',
    url: 'https://www.overthinker13.cn/',
    avatar: 'OT',
  },
  {
    name: 'X-Plore',
    desc: '知识与项目记录参考仓库',
    url: 'https://github.com/lvy010/X-Plore',
    avatar: 'XP',
  },
];

export const announcements = {
  title: '公告',
  content: '欢迎来到我的个人主页。这里优先展示秋招项目和工程能力，也会持续记录生活与学习。',
  link: '/projects',
  linkText: '查看项目',
};

export const siteConfig = {
  title: 'rua',
  subtitle: 'Java 后端 | AI Agent 探索者',
  author: '王沛钊',
  nickname: '@trillionWang',
  bio: '面向后端工程、AI 应用和复杂业务系统持续构建。',
  avatar: '/avatar.jpg',
  social: {
    github: 'https://github.com/trillionWang',
    email: 'mailto:wangpeizhao1220@gmail.com',
  },
  typingTexts: [
    'Java 后端开发工程师',
    'AI Agent 探索者',
    '秋招进行中',
  ],
};

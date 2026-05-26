// 番剧数据
export interface Anime {
  id: string;
  title: string;
  cover: string;
  status: 'completed' | 'watching';
  rating: number;
  year: number;
  producer: string;
  description: string;
  tags: string[];
  episodes?: string;
}

export const animeList: Anime[] = [
  {
    id: '1',
    title: 'Stranger Things (1-4)',
    cover: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop',
    status: 'completed',
    rating: 9.5,
    year: 2016,
    producer: 'Netflix',
    description: '以1980年代印第安纳州霍金斯小镇为背景，围绕男孩威尔失踪事件展开，随着超能力女孩Eleven的出现，逐步揭露涉及秘密实验与超自然力量的阴谋。',
    tags: ['科幻', '惊悚', '悬疑'],
  },
  {
    id: '2',
    title: '三体',
    cover: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=600&fit=crop',
    status: 'completed',
    rating: 9.8,
    year: 2023,
    producer: '腾讯视频',
    description: '该剧根据科幻作家刘慈欣同名小说改编，讲述了21世纪初地球基础科学研究遭遇异常干扰，纳米物理学家汪淼与刑警史强联合调查"科学边界"的故事。',
    tags: ['剧情', '科幻', '悬疑'],
  },
  {
    id: '3',
    title: '名侦探柯南',
    cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
    status: 'watching',
    rating: 9.2,
    year: 1996,
    producer: 'TMS Entertainment',
    description: '高中生侦探工藤新一被黑衣组织灌下毒药身体缩小，化名江户川柯南，继续追查组织真相的同时解决各类案件。',
    tags: ['悬疑', '推理', '动画'],
    episodes: '1100+/1232',
  },
];

// 日记数据
export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
}

export const diaryEntries: DiaryEntry[] = [
  {
    id: '1',
    title: 'Spring Boot 学习笔记',
    content: '今天学习了Spring Boot的自动配置原理，感觉收获很大。了解了@SpringBootApplication注解背后的@ComponentScan、@EnableAutoConfiguration和@Configuration三个注解的协同工作原理。',
    date: '2026-05-20',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    ],
  },
  {
    id: '2',
    title: '周末随手拍',
    content: '周末去了趟公园，天气真好，随手拍了几张照片。春天的花开得很美，心情也跟着好起来了。',
    date: '2026-05-18',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    ],
  },
  {
    id: '3',
    title: 'Redis缓存穿透问题解决',
    content: '今天终于把项目中缓存穿透的问题解决了！使用了布隆过滤器+缓存空值的方案，效果很不错。记录一下关键代码和思路。',
    date: '2026-05-15',
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    ],
  },
  {
    id: '4',
    title: '日常碎碎念',
    content: '今天看到了一句话很有感触："代码是写给人看的，顺便给机器执行"。作为开发者，我们不仅要写出能运行的代码，更要写出优雅、可维护的代码。',
    date: '2026-05-10',
    images: [],
  },
  {
    id: '5',
    title: '新键盘到手',
    content: '新买的机械键盘到了！手感超棒，打字的声音也很治愈。忍不住想多写几行代码试试手感。',
    date: '2026-05-05',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=300&fit=crop',
    ],
  },
];

// 相册数据
export interface Album {
  id: string;
  title: string;
  cover: string;
  description: string;
  photoCount: number;
  category: string;
  date: string;
  tags: string[];
  photos: string[];
}

export const albums: Album[] = [
  {
    id: '1',
    title: '一些随拍',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    description: '没有高超的摄影技术，只是单纯的记录生活中的一些瞬间。',
    photoCount: 12,
    category: 'Memories',
    date: '2025/9/11',
    tags: ['snap', 'moments', 'life'],
    photos: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop',
    ],
  },
  {
    id: '2',
    title: '编程时光',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    description: '记录编程学习的点点滴滴，从萌新到进阶的成长之路。',
    photoCount: 8,
    category: 'Coding',
    date: '2025/9/8',
    tags: ['code', 'study', 'growth'],
    photos: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    ],
  },
  {
    id: '3',
    title: '美食记录',
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    description: '人间烟火气，最抚凡人心。记录每一次美味的邂逅。',
    photoCount: 15,
    category: 'Food',
    date: '2025/8/20',
    tags: ['food', 'life', 'delicious'],
    photos: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    ],
  },
];

// 学习记录/项目数据
export interface Project {
  id: string;
  title: string;
  cover: string;
  status: 'completed' | 'in-progress';
  description: string;
  techStack: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    title: '个人博客系统',
    cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
    status: 'in-progress',
    description: '基于React+Vite开发的现代化个人博客，支持暗黑模式、响应式设计、本地存储管理文章等功能。',
    techStack: ['React', 'TypeScript', 'TailwindCSS', 'Vite'],
  },
  {
    id: '2',
    title: 'WebSocket聊天室',
    cover: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=400&fit=crop',
    status: 'in-progress',
    description: '基于Java WebSocket实现的实时聊天应用，支持多人在线、消息推送、用户管理等功能。',
    techStack: ['WebSocket', 'Spring Boot', 'MySQL', 'Redis'],
  },
  {
    id: '3',
    title: 'AgentForge AI脚手架',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    status: 'in-progress',
    description: '企业级AI Agent通用脚手架，基于DDD六边形架构设计，支持低代码动态组装工作流。',
    techStack: ['Java', 'AI Agent', 'DDD', 'LangChain4j'],
  },
  {
    id: '4',
    title: 'JavaSE基础学习',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    status: 'completed',
    description: '系统学习了Java面向对象编程、集合框架、异常处理、IO流、多线程等核心知识点。',
    techStack: ['Java', 'JavaSE', 'OOP'],
  },
  {
    id: '5',
    title: '数据结构与算法',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    status: 'completed',
    description: '深入学习了数组、链表、栈、队列、树、图等数据结构，以及排序、查找、动态规划等算法。',
    techStack: ['Java', '数据结构', '算法'],
  },
];

// 音乐列表
export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

export const songs: Song[] = [
  {
    id: '1',
    title: '夜空中最亮的星',
    artist: '逃跑计划',
    cover: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=200&h=200&fit=crop',
    url: '',
  },
  {
    id: '2',
    title: '晴天',
    artist: '周杰伦',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop',
    url: '',
  },
  {
    id: '3',
    title: '起风了',
    artist: '买辣椒也用券',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    url: '',
  },
];

// AI 页面数据
export const aiFeatures = [
  {
    title: '代码助手',
    description: '智能代码补全、Bug修复、代码重构建议',
    icon: 'code',
  },
  {
    title: '文章生成',
    description: '根据主题自动生成技术博客文章',
    icon: 'pen',
  },
  {
    title: '学习规划',
    description: '根据个人水平制定个性化学习计划',
    icon: 'map',
  },
  {
    title: '知识问答',
    description: 'Java后端、AI Agent领域知识问答',
    icon: 'message',
  },
];

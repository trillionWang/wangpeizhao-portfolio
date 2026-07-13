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
    title: 'Stranger Things',
    cover: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop',
    status: 'completed',
    rating: 9.5,
    year: 2016,
    producer: 'Netflix',
    description: '科幻、悬疑和成长叙事结合得很好的剧集，适合记录一些观影灵感。',
    tags: ['科幻', '悬疑', '成长'],
  },
  {
    id: '2',
    title: '三体',
    cover: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=600&fit=crop',
    status: 'completed',
    rating: 9.2,
    year: 2023,
    producer: '腾讯视频',
    description: '从基础科学异常到文明尺度冲突，适合放在“长期思考”类记录里。',
    tags: ['科幻', '剧情', '思考'],
  },
  {
    id: '3',
    title: '名侦探柯南',
    cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
    status: 'watching',
    rating: 9.0,
    year: 1996,
    producer: 'TMS Entertainment',
    description: '长期追更的推理动画，可以作为生活记录里的轻松部分。',
    tags: ['推理', '动画', '日常'],
    episodes: '长期观看',
  },
];

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
    content: '今天复习了 Spring Boot 自动配置、组件扫描和配置装配流程，准备把这些内容整理成更适合面试表达的笔记。',
    date: '2026-05-20',
    images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop'],
  },
  {
    id: '2',
    title: '周末随手拍',
    content: '天气很好，适合出门走走。网站里保留相册入口，是想让它不只是简历，也能记录真实生活。',
    date: '2026-05-18',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    ],
  },
  {
    id: '3',
    title: 'Redis 缓存穿透问题复盘',
    content: '用布隆过滤器和空值缓存解决缓存穿透问题时，要注意误判率、空值过期时间和业务一致性。',
    date: '2026-05-15',
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'],
  },
];

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
    id: 'daily',
    title: '日常随拍',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    description: '没有复杂的主题，只是记录生活里的路过、天气和瞬间。',
    photoCount: 4,
    category: 'Memories',
    date: '2026/05/18',
    tags: ['snap', 'life', 'moments'],
    photos: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=900&h=650&fit=crop',
    ],
  },
  {
    id: 'coding',
    title: '编程时光',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    description: '记录学习、项目调试和持续构建的一些片段。',
    photoCount: 3,
    category: 'Coding',
    date: '2026/04/10',
    tags: ['code', 'study', 'growth'],
    photos: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&h=650&fit=crop',
    ],
  },
  {
    id: 'food',
    title: '美食记录',
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    description: '人间烟火气，也应该出现在个人主页里。',
    photoCount: 2,
    category: 'Food',
    date: '2026/03/18',
    tags: ['food', 'life'],
    photos: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&h=650&fit=crop',
    ],
  },
];

export interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

export const songs: Song[] = [
  {
    id: 1,
    title: '夜空中最亮的星',
    artist: '逃跑计划',
    cover: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=400&fit=crop',
    url: 'https://music.163.com/song/media/outer/url?id=25706282.mp3',
  },
];

export const media = albums.flatMap((album, albumIndex) =>
  album.photos.map((url, index) => ({
    id: albumIndex * 100 + index + 1,
    type: 'image' as const,
    title: `${album.title} ${index + 1}`,
    url,
    album: album.title,
    description: album.description,
    created_at: album.date.replaceAll('/', '-'),
  }))
);

export const aiFeatures = [
  {
    title: '项目问答',
    description: '基于静态项目资料回答项目经历、职责和技术难点。',
    icon: 'code',
  },
  {
    title: '简历助手',
    description: '快速说明个人定位、技术栈和求职方向。',
    icon: 'map',
  },
  {
    title: '文章检索',
    description: '根据标题、标签和摘要查找站内文章。',
    icon: 'pen',
  },
  {
    title: '生活记录',
    description: '介绍相册、日记和音乐等个人记录入口。',
    icon: 'message',
  },
];

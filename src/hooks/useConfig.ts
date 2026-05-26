import { useState, useEffect } from 'react';
import { getConfig } from '../lib/api';

interface SiteConfig {
  avatar: string;
  author: string;
  nickname: string;
  bio: string;
  subtitle: string;
  announcement: string;
  github: string;
  email: string;
}

const defaultConfig: SiteConfig = {
  avatar: '',
  author: 'ruaruarua coder',
  nickname: '@Rua',
  bio: 'Java后端 | AI Agent探索者',
  subtitle: '「吃个面皮」',
  announcement: '欢迎来到我的博客！目前正在寻找 Java 后端开发工程师的实习/全职机会。',
  github: 'https://github.com/wangpeizhao',
  email: '',
};

export function useConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConfig().then(data => {
      if (data) setConfig({ ...defaultConfig, ...data });
    }).catch(() => {
      // Use defaults on error
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return { config, loading };
}

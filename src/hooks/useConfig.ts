import { useState, useEffect } from 'react';
import { getConfig } from '../lib/api';

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
}

const defaultConfig: SiteConfig = {
  brand: 'rua',
  avatar: '',
  author: '王沛钊',
  nickname: '@trillionWang',
  bio: 'Java 后端开发 / AI Agent 探索者 / 秋招求职中',
  subtitle: '面向后端工程、AI 应用和复杂业务系统的持续构建者',
  announcement: '这里是我的在线简历、项目展示和生活记录入口。',
  github: 'https://github.com/trillionWang',
  email: '',
  location: '中国',
  targetRole: 'Java 后端开发工程师 / AI 应用工程师',
  heroImage: '',
};

export function useConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConfig().then(data => {
      if (data) setConfig({ ...defaultConfig, ...data });
    }).catch(() => {
      setConfig(defaultConfig);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return { config, loading };
}

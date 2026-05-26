import { useState, useEffect } from 'react';
import { getPosts, getPost } from '../lib/api';

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  word_count: number;
  read_time: number;
  published: number;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then(data => {
      setPosts(Array.isArray(data) ? data : []);
    }).catch(() => {
      setPosts([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return { posts, loading, refetch: () => getPosts().then(data => setPosts(Array.isArray(data) ? data : [])) };
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost(slug).then(data => {
      if (data && !data.error) setPost(data);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  }, [slug]);

  return { post, loading };
}

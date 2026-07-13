import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Calendar, Tag } from 'lucide-react';
import { posts } from '../data/posts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl mx-4 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-white/10">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索文章..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white outline-none text-base placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {!query.trim() && (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              输入关键词开始搜索...
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              没有找到与 "{query}" 相关的文章
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs text-gray-500 dark:text-gray-500">
                找到 {results.length} 篇文章
              </div>
              {results.map(post => (
                <Link
                  key={post.id}
                  to={`/post/${post.slug}`}
                  onClick={onClose}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-[#4ade80]/5 transition-colors"
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-[#4ade80]/10 text-[#4ade80]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {post.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-1">
                      {post.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

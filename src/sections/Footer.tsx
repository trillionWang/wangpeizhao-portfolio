import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-gray-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} 王培兆. All Rights Reserved.
        </p>
        <div className="flex items-center justify-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-500">
          <span className="hover:text-[#4ade80] cursor-pointer transition-colors">RSS</span>
          <span>/</span>
          <span className="hover:text-[#4ade80] cursor-pointer transition-colors">Sitemap</span>
          <span>/</span>
          <a
            href="https://github.com/wangpeizhao"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[#4ade80] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-3">
          Powered by React & Vite & TailwindCSS
        </p>
      </div>
    </footer>
  );
}

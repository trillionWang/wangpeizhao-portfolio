import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Archive,
  Home,
  Image,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  PenLine,
  Search,
  Sun,
  User,
  X,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  onSearchOpen: () => void;
}

const links = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/projects', icon: Monitor, label: '项目' },
  { to: '/archive', icon: Archive, label: '文章' },
  { to: '/albums', icon: Image, label: '相册' },
  { to: '/messageboard', icon: MessageSquare, label: '留言' },
  { to: '/about', icon: User, label: '关于' },
];

const moreLinks = [
  { to: '/diary', icon: PenLine, label: '日记' },
];

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const allLinks = [...links, ...moreLinks];
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200/50 bg-white/75 backdrop-blur-xl transition-colors duration-300 dark:border-white/5 dark:bg-[#070907]/80">
      <div className="mx-auto flex h-14 max-w-[1840px] items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white" aria-label="rua home">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4ade80] text-black">r</span>
          <span className="hidden tracking-normal sm:inline">rua</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition-all ${
                isActive(item.to)
                  ? 'bg-[#4ade80]/15 text-[#16a34a]'
                  : 'text-gray-600 hover:bg-[#4ade80]/10 hover:text-[#16a34a] dark:text-gray-400'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={onSearchOpen} className="rounded-xl p-2 text-gray-600 transition-all hover:bg-[#4ade80]/10 hover:text-[#16a34a] dark:text-gray-400" aria-label="搜索">
            <Search className="h-5 w-5" />
          </button>
          <button onClick={toggleTheme} className="rounded-xl p-2 text-gray-600 transition-all hover:bg-[#4ade80]/10 hover:text-[#16a34a] dark:text-gray-400" aria-label="切换主题">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2 text-gray-600 transition-all hover:bg-[#4ade80]/10 hover:text-[#16a34a] dark:text-gray-400 lg:hidden" aria-label="菜单">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200/50 bg-white/95 backdrop-blur-xl dark:border-white/5 dark:bg-[#070907]/95 lg:hidden">
          <div className="mx-auto grid max-w-[1840px] grid-cols-2 gap-2 px-5 py-3">
            {allLinks.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                  isActive(item.to)
                    ? 'bg-[#4ade80]/15 text-[#16a34a]'
                    : 'text-gray-600 hover:bg-[#4ade80]/10 dark:text-gray-400'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

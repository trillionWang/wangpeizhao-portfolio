import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  Home, Archive, Link as LinkIcon, User, Info, MoreHorizontal,
  Moon, Sun, Search, Monitor, BookOpen, MessageSquare, Image,
  Tv, BookMarked, Users, Sparkles
} from 'lucide-react';

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', icon: Home, label: '主页' },
    { to: '/archive', icon: Archive, label: '归档' },
  ];

  type MenuItem = { to: string; icon: React.ElementType; label: string; external?: boolean };

  const dropdownMenus: { key: string; icon: React.ElementType; label: string; items: MenuItem[] }[] = [
    {
      key: 'links',
      icon: LinkIcon,
      label: '链接',
      items: [
        { to: 'https://github.com/wangpeizhao', icon: User, label: 'GitHub', external: true },
        { to: 'https://space.bilibili.com', icon: Tv, label: 'Bilibili', external: true },
        { to: 'https://gitee.com', icon: BookMarked, label: 'Gitee', external: true },
      ]
    },
    {
      key: 'mine',
      icon: User,
      label: '我的',
      items: [
        { to: '/anime', icon: Tv, label: '番剧' },
        { to: '/diary', icon: BookOpen, label: '日记' },
        { to: '/albums', icon: Image, label: '相册' },
        { to: '/messageboard', icon: MessageSquare, label: '留言板' },
        { to: '/friends', icon: Users, label: '友链' },
      ]
    },
    {
      key: 'about',
      icon: Info,
      label: '关于',
      items: [
        { to: '/about', icon: User, label: '关于我' },
        { to: '/friends', icon: LinkIcon, label: '友链' },
      ]
    },
    {
      key: 'more',
      icon: MoreHorizontal,
      label: '其他',
      items: [
        { to: '/projects', icon: Monitor, label: '学习记录' },
        { to: '/vault', icon: Archive, label: '档案库' },
      ]
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-[#0a0a0a]/80 border-b border-gray-200/50 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-[#4ade80] font-bold text-lg hover:opacity-80 transition-opacity">
          <Home className="w-5 h-5" />
          <span>Ruaruarua</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1" ref={dropdownRef}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.to)
                  ? 'text-[#4ade80] bg-[#4ade80]/10'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#4ade80] hover:bg-[#4ade80]/5'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          ))}

          {dropdownMenus.map(menu => (
            <div
              key={menu.key}
              className="relative"
              onMouseEnter={() => handleMouseEnter(menu.key)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  openDropdown === menu.key
                    ? 'text-[#4ade80] bg-[#4ade80]/10'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#4ade80] hover:bg-[#4ade80]/5'
                }`}
              >
                <menu.icon className="w-4 h-4" />
                <span>{menu.label}</span>
                <svg className={`w-3 h-3 transition-transform ${openDropdown === menu.key ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === menu.key && (
                <div className="absolute top-full left-0 mt-1 w-40 py-1.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                  {menu.items.map((item, idx) => (
                    item.external ? (
                      <a
                        key={idx}
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#4ade80] hover:bg-[#4ade80]/5 transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <Link
                        key={idx}
                        to={item.to}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#4ade80] hover:bg-[#4ade80]/5 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            to="/ai"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/ai')
                ? 'text-[#4ade80] bg-[#4ade80]/10'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#4ade80] hover:bg-[#4ade80]/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI</span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all text-sm border border-gray-200 dark:border-white/10"
          >
            <Search className="w-3.5 h-3.5" />
            <span>搜索...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-white/10 rounded">
              Ctrl+K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

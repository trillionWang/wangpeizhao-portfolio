import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Settings, Music, MessageSquare,
  Sparkles, LogOut, ChevronRight, Menu, X
} from 'lucide-react';
import { getMe, logout } from '../lib/api';

const menuItems = [
  { to: '/admin', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/admin/posts', icon: FileText, label: '文章管理' },
  { to: '/admin/settings', icon: Settings, label: '网站设置' },
  { to: '/admin/music', icon: Music, label: '音乐管理' },
  { to: '/admin/ai', icon: Sparkles, label: 'AI配置' },
  { to: '/admin/messages', icon: MessageSquare, label: '留言管理' },
];

export default function AdminLayout() {
  const [username, setUsername] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    getMe().then(data => {
      if (data?.username) setUsername(data.username);
      else logout();
    }).catch(() => logout());
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/5 transform transition-transform lg:transform-none ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-[#4ade80]">Blog Admin</Link>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                location.pathname === item.to
                  ? 'bg-[#4ade80]/10 text-[#4ade80]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
              {location.pathname === item.to && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{username}</span>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <Link to="/" className="text-xs text-gray-600 hover:text-[#4ade80] transition-colors mt-2 block">
            返回博客首页
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center lg:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-400">
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 font-medium text-sm">管理后台</span>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

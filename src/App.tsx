import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ADMIN_BASE } from './lib/api';
import Navbar from './sections/Navbar';
import SearchModal from './sections/SearchModal';
import MusicPlayer from './sections/MusicPlayer';
import AIAssistantDock from './sections/AIAssistantDock';
import VisitorBadge from './sections/VisitorBadge';

import Home from './pages/Home';
import Archive from './pages/Archive';
import About from './pages/About';
import Friends from './pages/Friends';
import MessageBoard from './pages/MessageBoard';
import PostDetail from './pages/PostDetail';
import Anime from './pages/Anime';
import Diary from './pages/Diary';
import Albums from './pages/Albums';
import Projects from './pages/Projects';
import Vault from './pages/Vault';

import AdminLogin from './admin/Login';
import AdminLayout from './admin/Layout';
import AdminDashboard from './admin/Dashboard';
import PostManager from './admin/PostManager';
import Settings from './admin/Settings';
import MusicManager from './admin/MusicManager';
import AIConfig from './admin/AIConfig';
import MessageManager from './admin/MessageManager';
import MediaManager from './admin/MediaManager';

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith(ADMIN_BASE);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      {!isAdmin && <Navbar onSearchOpen={openSearch} />}
      {!isAdmin && <SearchModal isOpen={searchOpen} onClose={closeSearch} />}
      {!isAdmin && <MusicPlayer />}
      {!isAdmin && <AIAssistantDock />}
      {!isAdmin && <VisitorBadge />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/about" element={<About />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/messageboard" element={<MessageBoard />} />
        <Route path="/post/:slug" element={<PostDetail />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/vault" element={<Vault />} />

        <Route path={`${ADMIN_BASE}/login`} element={<AdminLogin />} />
        <Route path={ADMIN_BASE} element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<PostManager />} />
          <Route path="settings" element={<Settings />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="music" element={<MusicManager />} />
          <Route path="ai" element={<AIConfig />} />
          <Route path="messages" element={<MessageManager />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

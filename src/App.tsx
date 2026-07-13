import { Routes, Route } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
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

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(open => !open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Navbar onSearchOpen={openSearch} />
      <SearchModal isOpen={searchOpen} onClose={closeSearch} />
      <MusicPlayer />
      <AIAssistantDock />
      <VisitorBadge />

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

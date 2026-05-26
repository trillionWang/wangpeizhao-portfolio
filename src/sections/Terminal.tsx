import { useState, useRef, useEffect } from 'react';
import { posts } from '../data/posts';

type LineType = 'output' | 'input' | 'error';

interface TLine {
  type: LineType;
  content: string;
}

export default function Terminal() {
  const [lines, setLines] = useState<TLine[]>([
    { type: 'output', content: 'Welcome to Overthinker-Blog Terminal Emulator' },
    { type: 'output', content: 'Type \'help\' to see available commands' },
    { type: 'output', content: '' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const execCommand = (cmd: string, args: string[]): TLine[] => {
    switch (cmd) {
      case 'help':
        return [
          { type: 'output', content: 'Available commands:' },
          { type: 'output', content: '  help          - Show this help message' },
          { type: 'output', content: '  about         - About this blog' },
          { type: 'output', content: '  posts         - List all blog posts' },
          { type: 'output', content: '  post <slug>   - Show post details' },
          { type: 'output', content: '  categories    - List categories' },
          { type: 'output', content: '  tags          - List all tags' },
          { type: 'output', content: '  date          - Show current date' },
          { type: 'output', content: '  clear         - Clear terminal' },
          { type: 'output', content: '  neofetch      - Show system info' },
          { type: 'output', content: '  echo <text>   - Echo text back' },
          { type: 'output', content: '  whoami        - Show current user' },
        ];
      case 'about':
        return [
          { type: 'output', content: '================================' },
          { type: 'output', content: '  ruaruarua coder Blog' },
          { type: 'output', content: '================================' },
          { type: 'output', content: 'Author: ruaruarua coder (@Rua)' },
          { type: 'output', content: 'Role: Java Backend Developer' },
          { type: 'output', content: '     AI Agent Explorer' },
          { type: 'output', content: '' },
          { type: 'output', content: 'Built with React + Vite + Tailwind' },
          { type: 'output', content: `Total Posts: ${posts.length}` },
          { type: 'output', content: '' },
        ];
      case 'posts': {
        const result: TLine[] = [
          { type: 'output', content: 'Blog Posts:' },
          { type: 'output', content: '-----------' },
        ];
        posts.forEach((p, i) => {
          result.push({ type: 'output', content: `${i + 1}. ${p.title} [${p.category}]` });
          result.push({ type: 'output', content: `   ${p.date} | ${p.wordCount} words | ${p.readTime} min read` });
        });
        return result;
      }
      case 'post': {
        if (!args[0]) return [{ type: 'error', content: 'Usage: post <slug>' }];
        const post = posts.find(p => p.slug === args[0]);
        if (!post) return [{ type: 'error', content: `Post "${args[0]}" not found` }];
        return [
          { type: 'output', content: `Title: ${post.title}` },
          { type: 'output', content: `Date: ${post.date}` },
          { type: 'output', content: `Category: ${post.category}` },
          { type: 'output', content: `Tags: ${post.tags.join(', ')}` },
          { type: 'output', content: `Words: ${post.wordCount}` },
          { type: 'output', content: `Read Time: ${post.readTime} min` },
          { type: 'output', content: `Summary: ${post.summary}` },
        ];
      }
      case 'categories': {
        const cats = [...new Set(posts.map(p => p.category))];
        return [
          { type: 'output', content: 'Categories:' },
          ...cats.map(c => {
            const count = posts.filter(p => p.category === c).length;
            return { type: 'output', content: `  ${c}: ${count} post(s)` } as TLine;
          }),
        ];
      }
      case 'tags': {
        const allTags = [...new Set(posts.flatMap(p => p.tags))];
        return [
          { type: 'output', content: 'Tags:' },
          { type: 'output', content: `  ${allTags.join(', ')}` },
        ];
      }
      case 'date':
        return [{ type: 'output', content: new Date().toString() }];
      case 'clear':
        return []; // Special case handled separately
      case 'neofetch':
        return [
          { type: 'output', content: '       _                 _ ' },
          { type: 'output', content: '      | |               | |' },
          { type: 'output', content: '   ___| | ___  _ __ ___ | |' },
          { type: 'output', content: '  / _ \\ |/ _ \\| \'_ ` _ \\| |' },
          { type: 'output', content: ' |  __/ | (_) | | | | | | |' },
          { type: 'output', content: '  \\___|_|\\___/|_| |_| |_|_|' },
          { type: 'output', content: '' },
          { type: 'output', content: 'OS: BlogOS 1.0' },
          { type: 'output', content: 'Shell: rua-shell' },
          { type: 'output', content: 'Resolution: 1920x1080' },
          { type: 'output', content: 'Theme: Green Dark' },
          { type: 'output', content: 'Posts: 6' },
          { type: 'output', content: `Uptime: ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m` },
        ];
      case 'echo':
        return [{ type: 'output', content: args.join(' ') }];
      case 'whoami':
        return [{ type: 'output', content: 'guest' }];
      default:
        return [{ type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` }];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newLines: TLine[] = [...lines, { type: 'input', content: `$ ${trimmed}` }];
    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'clear') {
      setLines([]);
    } else {
      const result = execCommand(cmd, args);
      setLines([...newLines, ...result]);
    }
    setInput('');
  };

  return (
    <div
      className="rounded-2xl bg-[#0d1117] border border-white/10 overflow-hidden cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27ca40]" />
        </div>
        <span className="ml-2 text-xs text-gray-500 font-medium">terminal</span>
      </div>
      <div className="p-4 h-48 overflow-y-auto font-mono text-sm">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`mb-0.5 ${
              line.type === 'input' ? 'text-[#4ade80]' : line.type === 'error' ? 'text-red-400' : 'text-gray-300'
            }`}
          >
            {line.content}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-1">
          <span className="text-[#4ade80]">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-transparent text-gray-300 outline-none font-mono text-sm placeholder:text-gray-600"
            placeholder="Type a command..."
            autoComplete="off"
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

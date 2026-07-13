import { useEffect, useRef, useState } from 'react';

type LineType = 'output' | 'input' | 'error';

interface TLine {
  type: LineType;
  content: string;
}

export default function Terminal() {
  const [lines, setLines] = useState<TLine[]>([
    { type: 'output', content: 'rua@portfolio:~$ welcome' },
    { type: 'output', content: '输入 help 查看可用命令' },
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
          { type: 'output', content: '可用命令:' },
          { type: 'output', content: '  about     - 查看站点定位' },
          { type: 'output', content: '  stack     - 查看主要技术栈' },
          { type: 'output', content: '  contact   - 查看联系方式提示' },
          { type: 'output', content: '  date      - 查看当前时间' },
          { type: 'output', content: '  clear     - 清空终端' },
          { type: 'output', content: '  echo ...  - 输出文本' },
        ];
      case 'about':
        return [
          { type: 'output', content: 'rua portfolio' },
          { type: 'output', content: '在线简历、项目展示、技术文章和生活记录。' },
          { type: 'output', content: '目标方向: Java 后端 / AI 应用工程化。' },
        ];
      case 'stack':
        return [
          { type: 'output', content: 'Java, Spring Boot, MySQL, Redis' },
          { type: 'output', content: 'React, TypeScript, Node.js, Express' },
          { type: 'output', content: 'AI Agent, RAG, Function Calling' },
        ];
      case 'contact':
        return [
          { type: 'output', content: '请查看首页个人卡片或关于页面中的 GitHub / Email。' },
        ];
      case 'date':
        return [{ type: 'output', content: new Date().toLocaleString('zh-CN') }];
      case 'clear':
        return [];
      case 'echo':
        return [{ type: 'output', content: args.join(' ') }];
      default:
        return [{ type: 'error', content: `未找到命令: ${cmd}. 输入 help 查看可用命令。` }];
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextLines: TLine[] = [...lines, { type: 'input', content: `$ ${trimmed}` }];
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'clear') {
      setLines([]);
    } else {
      setLines([...nextLines, ...execCommand(cmd, args)]);
    }
    setInput('');
  };

  return (
    <div
      className="cursor-text overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27ca40]" />
        </div>
        <span className="ml-2 text-xs font-medium text-gray-500">terminal</span>
      </div>
      <div className="h-48 overflow-y-auto p-4 font-mono text-sm">
        {lines.map((line, index) => (
          <div
            key={index}
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
            onChange={event => setInput(event.target.value)}
            className="flex-1 bg-transparent font-mono text-sm text-gray-300 outline-none placeholder:text-gray-600"
            placeholder="输入命令..."
            autoComplete="off"
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

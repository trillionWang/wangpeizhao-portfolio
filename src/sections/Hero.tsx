import { useEffect, useMemo, useRef, useState } from 'react';
import { Github, Mail, Sparkles } from 'lucide-react';

interface HeroProps {
  config?: {
    author?: string;
    nickname?: string;
    subtitle?: string;
    bio?: string;
    github?: string;
    email?: string;
    heroImage?: string;
    targetRole?: string;
  };
}

const fallbackTexts = [
  'Java 后端开发',
  'AI Agent 探索者',
  '在线简历 / 项目作品集 / 生活记录',
];

const defaultBanners = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2000&auto=format&fit=crop',
];

export default function Hero({ config }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typed, setTyped] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const banners = useMemo(() => config?.heroImage ? [config.heroImage, ...defaultBanners] : defaultBanners, [config?.heroImage]);
  const texts = useMemo(() => config?.subtitle ? [config.subtitle, ...fallbackTexts] : fallbackTexts, [config?.subtitle]);

  useEffect(() => {
    const timer = window.setInterval(() => setBannerIndex(index => (index + 1) % banners.length), 5200);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: number;
    const tick = () => {
      const current = texts[textIndex] || '';
      charIndex += deleting ? -1 : 1;
      setTyped(current.slice(0, charIndex));
      if (!deleting && charIndex >= current.length) {
        deleting = true;
        timer = window.setTimeout(tick, 1500);
        return;
      }
      if (deleting && charIndex <= 0) {
        deleting = false;
        textIndex = (textIndex + 1) % texts.length;
        timer = window.setTimeout(tick, 360);
        return;
      }
      timer = window.setTimeout(tick, deleting ? 40 : 86);
    };
    timer = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timer);
  }, [texts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let width = 0;
    let height = 0;
    let raf = 0;
    const dots = Array.from({ length: 56 }, () => ({ x: Math.random(), y: Math.random(), v: 0.12 + Math.random() * 0.25 }));
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      dots.forEach(dot => {
        dot.y -= dot.v / Math.max(height, 1);
        if (dot.y < -0.05) {
          dot.y = 1.05;
          dot.x = Math.random();
        }
        ctx.fillStyle = 'rgba(74,222,128,.55)';
        ctx.beginPath();
        ctx.arc(dot.x * width, dot.y * height, 1.4, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative h-[430px] overflow-hidden pt-14 md:h-[470px]">
      {banners.map((banner, index) => (
        <div
          key={banner}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === bannerIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${banner})` }}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.70))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(74,222,128,.24),transparent_30%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1840px] items-center justify-center px-5 text-center">
        <div className="max-w-4xl">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/85 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#4ade80]" />
            Portfolio / Blog / Life
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-normal text-white drop-shadow-[0_8px_30px_rgba(0,0,0,.5)] md:text-6xl">
            {config?.author || '王沛钊'}
          </h1>
          <div className="mt-4 flex min-h-8 items-center justify-center text-lg font-medium text-white/90 md:text-xl">
            <span>{typed}</span>
            <span className="ml-1 h-6 w-[2px] animate-pulse bg-[#4ade80]" />
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/80 md:text-base">
            {config?.bio || 'Java 后端开发 / AI Agent 探索者 / 秋招求职中'}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/80 backdrop-blur-md">{config?.targetRole || 'Java 后端开发工程师'}</span>
            {config?.github && <a href={config.github} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/15 bg-white/10 p-2 text-white/80 transition-colors hover:text-[#4ade80]" aria-label="GitHub"><Github className="h-4 w-4" /></a>}
            {config?.email && <a href={`mailto:${config.email}`} className="rounded-xl border border-white/15 bg-white/10 p-2 text-white/80 transition-colors hover:text-[#4ade80]" aria-label="Email"><Mail className="h-4 w-4" /></a>}
          </div>
        </div>
      </div>
    </section>
  );
}

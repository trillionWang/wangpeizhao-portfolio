import { useEffect, useRef } from 'react';

interface HeroProps {
  config?: {
    author?: string;
    subtitle?: string;
  };
}

const defaultTexts = [
  "Java后端开发工程师",
  "AI Agent 探索者",
  "「吃个面皮」",
];

export default function Hero({ config }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const typedTextRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  // 3D Geometric background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;

    const shapes: Array<{
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      size: number; color: string;
      type: 'circle' | 'rect' | 'triangle';
      rot: number; vrot: number;
    }> = [];

    const colors = [
      'rgba(74, 222, 128, 0.15)',
      'rgba(34, 197, 94, 0.12)',
      'rgba(16, 185, 129, 0.10)',
      'rgba(52, 211, 153, 0.13)',
      'rgba(20, 184, 166, 0.11)',
    ];

    for (let i = 0; i < 25; i++) {
      shapes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 500,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 2,
        size: 20 + Math.random() * 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: ['circle', 'rect', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'rect' | 'triangle',
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.01,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw gradient background
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        grad.addColorStop(0, '#0f2e18');
        grad.addColorStop(0.5, '#0a1f12');
        grad.addColorStop(1, '#0a0a0a');
      } else {
        grad.addColorStop(0, '#dcfce7');
        grad.addColorStop(0.5, '#bbf7d0');
        grad.addColorStop(1, '#86efac');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      shapes.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.z += s.vz;
        s.rot += s.vrot;

        if (s.x < -100) s.x = w + 100;
        if (s.x > w + 100) s.x = -100;
        if (s.y < -100) s.y = h + 100;
        if (s.y > h + 100) s.y = -100;
        if (s.z < 50) s.vz = Math.abs(s.vz);
        if (s.z > 500) s.vz = -Math.abs(s.vz);

        const scale = 1 - s.z / 600;
        const alpha = 1 - s.z / 550;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = s.color;

        if (s.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (s.type === 'rect') {
          ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -s.size / 2);
          ctx.lineTo(s.size / 2, s.size / 2);
          ctx.lineTo(-s.size / 2, s.size / 2);
          ctx.closePath();
          ctx.fill();
        }

        // Glow effect
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Typewriter effect - fixed to prevent text truncation
  useEffect(() => {
    const texts = config?.subtitle ? [config.subtitle, "Java后端开发工程师", "AI Agent 探索者"] : defaultTexts;
    let cancelled = false;

    const type = () => {
      if (cancelled) return;
      const currentText = texts[textIndexRef.current];
      const el = typedTextRef.current;
      if (!el) {
        rafRef.current = requestAnimationFrame(type);
        return;
      }

      if (isDeletingRef.current) {
        charIndexRef.current--;
        el.textContent = currentText.substring(0, charIndexRef.current);

        if (charIndexRef.current === 0) {
          isDeletingRef.current = false;
          textIndexRef.current = (textIndexRef.current + 1) % texts.length;
          setTimeout(type, 500);
          return;
        }
        setTimeout(type, 50);
      } else {
        charIndexRef.current++;
        el.textContent = currentText.substring(0, charIndexRef.current);

        if (charIndexRef.current === currentText.length) {
          isDeletingRef.current = true;
          setTimeout(type, 2000);
          return;
        }
        setTimeout(type, 120);
      }
    };

    const timer = setTimeout(type, 1000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] tracking-tight">
          {config?.author || 'ruaruarua coder'}
        </h1>
        <div className="mt-4 h-8 flex items-center">
          <span
            ref={typedTextRef}
            className="text-lg md:text-xl text-white/90 font-medium drop-shadow-[0_1px_5px_rgba(0,0,0,0.3)]"
          />
          <span className="w-[2px] h-5 bg-[#4ade80] ml-0.5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

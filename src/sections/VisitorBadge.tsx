import { useEffect, useState } from 'react';
import { Cpu, Globe2, MapPin, Monitor, Smartphone } from 'lucide-react';
import { getVisitorInfo } from '../lib/api';

interface VisitorState {
  os: string;
  browser: string;
  device: string;
  screen: string;
  time: string;
  location: string;
  isp: string;
}

export default function VisitorBadge() {
  const [info, setInfo] = useState<VisitorState>({
    os: 'Unknown',
    browser: 'Unknown',
    device: 'Desktop',
    screen: '',
    time: '',
    location: '定位中',
    isp: '',
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    let os = 'Unknown';
    let browser = 'Unknown';
    const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop';

    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Android')) os = 'Android';
    else if (/iPhone|iPad/.test(ua)) os = 'iOS';
    else if (ua.includes('Linux')) os = 'Linux';

    if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';

    setInfo(prev => ({
      ...prev,
      os,
      browser,
      device,
      screen: `${window.screen.width}x${window.screen.height}`,
      time: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    getVisitorInfo()
      .then(data => {
        setInfo(prev => ({
          ...prev,
          location: data?.location || '未知地区',
          isp: data?.isp || '',
        }));
      })
      .catch(() => {
        setInfo(prev => ({ ...prev, location: '未知地区' }));
      });
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-30 hidden w-64 rounded-2xl border border-white/12 bg-[#07110d]/88 p-3 text-white shadow-2xl shadow-black/30 backdrop-blur-xl lg:block">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#4ade80]">
        <Globe2 className="h-4 w-4" />
        Visitor Info
      </div>
      <div className="space-y-2 text-xs text-gray-300">
        <InfoRow icon={MapPin} label="位置" value={info.location} />
        <InfoRow icon={Monitor} label="系统" value={info.os} />
        <InfoRow icon={Globe2} label="浏览器" value={info.browser} />
        <InfoRow icon={Smartphone} label="设备" value={info.device} />
        <InfoRow icon={Cpu} label="屏幕" value={info.screen} />
        {info.isp && <div className="truncate border-t border-white/10 pt-2 text-gray-500">{info.isp}</div>}
        <div className="border-t border-white/10 pt-2 text-gray-500">本地访问时间 {info.time}</div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Monitor; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="truncate text-right">{value}</span>
    </div>
  );
}

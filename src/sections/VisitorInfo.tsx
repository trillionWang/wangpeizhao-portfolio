import { useState, useEffect } from 'react';
import { Globe, Monitor, Cpu } from 'lucide-react';

export default function VisitorInfo() {
  const [info, setInfo] = useState({
    os: 'Unknown',
    browser: 'Unknown',
    device: 'Desktop',
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';
    let device = 'Desktop';

    // OS detection
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) { os = 'Android'; device = 'Mobile'; }
    else if (ua.includes('iPhone') || ua.includes('iPad')) { os = 'iOS'; device = 'Mobile'; }

    // Browser detection
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';

    setInfo({ os, browser, device });
  }, []);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-[#4ade80]" />
        <h3 className="font-semibold text-gray-900 dark:text-white">访客信息</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500">操作系统</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{info.os}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500">设备类型</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{info.device}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500">浏览器</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{info.browser}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

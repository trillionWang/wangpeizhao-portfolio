import { Router } from 'express';

const router = Router();

interface CachedGeo {
  expiresAt: number;
  payload: VisitorPayload;
}

interface VisitorPayload {
  ip: string;
  location: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  source: 'ipapi' | 'local' | 'unknown';
}

const cache = new Map<string, CachedGeo>();
const CACHE_TTL = 1000 * 60 * 60 * 12;

function getClientIp(req: any) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const cf = String(req.headers['cf-connecting-ip'] || '').trim();
  const real = String(req.headers['x-real-ip'] || '').trim();
  const raw = cf || forwarded || real || req.socket?.remoteAddress || '';
  return raw.replace(/^::ffff:/, '');
}

function isPrivateIp(ip: string) {
  return !ip ||
    ip === '::1' ||
    ip === '127.0.0.1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
    /^fc|^fd/i.test(ip);
}

function maskIp(ip: string) {
  if (!ip) return '';
  if (ip.includes(':')) {
    const parts = ip.split(':').filter(Boolean);
    return parts.length > 2 ? `${parts.slice(0, 2).join(':')}:****` : ip;
  }
  const parts = ip.split('.');
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.*` : ip;
}

async function lookupGeo(ip: string): Promise<VisitorPayload> {
  if (isPrivateIp(ip)) {
    return {
      ip: maskIp(ip),
      location: '本地网络',
      source: 'local',
    };
  }

  const cached = cache.get(ip);
  if (cached && cached.expiresAt > Date.now()) return cached.payload;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: { 'User-Agent': 'rua-portfolio/1.0' },
      signal: controller.signal,
    });
    const data: any = await response.json();
    const city = data.city || '';
    const region = data.region || '';
    const country = data.country_name || '';
    const location = [country, region, city].filter(Boolean).join(' / ') || '未知地区';
    const payload: VisitorPayload = {
      ip: maskIp(ip),
      location,
      country,
      region,
      city,
      isp: data.org || '',
      source: 'ipapi',
    };
    cache.set(ip, { expiresAt: Date.now() + CACHE_TTL, payload });
    return payload;
  } catch {
    return {
      ip: maskIp(ip),
      location: '未知地区',
      source: 'unknown',
    };
  } finally {
    clearTimeout(timer);
  }
}

router.get('/', async (req, res) => {
  const ip = getClientIp(req);
  const geo = await lookupGeo(ip);
  res.json({
    ...geo,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
  });
});

export default router;

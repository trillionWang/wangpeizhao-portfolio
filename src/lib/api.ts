// API Base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper: get token
function getToken() {
  return localStorage.getItem('admin_token');
}

// Helper: fetch with auth
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    return null;
  }
  return res;
}

// ==================== Auth ====================
export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('admin_token', data.token);
  }
  return data;
}

export async function getMe() {
  const res = await fetchWithAuth(`${API_BASE}/auth/me`);
  if (!res) return null;
  return res.json();
}

export function logout() {
  localStorage.removeItem('admin_token');
  window.location.href = '/admin/login';
}

// ==================== Posts ====================
export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return res.json();
}

export async function getPost(slug: string) {
  const res = await fetch(`${API_BASE}/posts/${slug}`);
  return res.json();
}

export async function createPost(post: any) {
  const res = await fetchWithAuth(`${API_BASE}/posts`, {
    method: 'POST',
    body: JSON.stringify(post),
  });
  if (!res) throw new Error('Unauthorized');
  return res.json();
}

export async function updatePost(id: number, post: any) {
  const res = await fetchWithAuth(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  });
  if (!res) throw new Error('Unauthorized');
  return res.json();
}

export async function deletePost(id: number) {
  const res = await fetchWithAuth(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!res) throw new Error('Unauthorized');
  return res.json();
}

// ==================== Config ====================
export async function getConfig() {
  const res = await fetch(`${API_BASE}/config`);
  return res.json();
}

export async function updateConfig(config: any) {
  const res = await fetchWithAuth(`${API_BASE}/config`, {
    method: 'PUT',
    body: JSON.stringify(config),
  });
  if (!res) throw new Error('Unauthorized');
  return res.json();
}

export async function getAIKeyStatus() {
  const res = await fetchWithAuth(`${API_BASE}/config/ai-key`);
  if (!res) return { hasKey: false };
  return res.json();
}

export async function updateAIKey(key: string) {
  const res = await fetchWithAuth(`${API_BASE}/config/ai-key`, {
    method: 'PUT',
    body: JSON.stringify({ deepseek_key: key }),
  });
  if (!res) throw new Error('Unauthorized');
  return res.json();
}

// ==================== Songs ====================
export async function getSongs() {
  const res = await fetch(`${API_BASE}/songs`);
  return res.json();
}

export async function createSong(song: any) {
  const res = await fetchWithAuth(`${API_BASE}/songs`, {
    method: 'POST',
    body: JSON.stringify(song),
  });
  if (!res) throw new Error('Unauthorized');
  return res.json();
}

export async function deleteSong(id: number) {
  const res = await fetchWithAuth(`${API_BASE}/songs/${id}`, {
    method: 'DELETE',
  });
  if (!res) throw new Error('Unauthorized');
  return res.json();
}

// ==================== Messages ====================
export async function getMessages() {
  const res = await fetch(`${API_BASE}/messages`);
  return res.json();
}

export async function createMessage(name: string, content: string) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, content }),
  });
  return res.json();
}

export async function deleteMessage(id: number) {
  const res = await fetchWithAuth(`${API_BASE}/messages/${id}`, {
    method: 'DELETE',
  });
  if (!res) throw new Error('Unauthorized');
  return res.json();
}

// ==================== AI ====================
export async function chatWithAI(message: string) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return res.json();
}

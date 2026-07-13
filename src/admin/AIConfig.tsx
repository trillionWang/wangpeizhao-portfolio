import { useEffect, useState } from 'react';
import { Bot, Check, KeyRound, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import {
  chatWithAI,
  createKnowledge,
  createPortfolioProject,
  deleteKnowledge,
  deletePortfolioProject,
  getAIKeyStatus,
  getKnowledge,
  getPortfolioProjects,
  updateAIKey,
  updateKnowledge,
  updatePortfolioProject,
} from '../lib/api';

type Tab = 'key' | 'knowledge' | 'projects' | 'test';

interface Knowledge {
  id: number;
  title: string;
  category: string;
  content: string;
  tags: string[];
  public: number;
}

interface Project {
  id: number;
  title: string;
  role: string;
  summary: string;
  description: string;
  techStack: string[];
  highlights: string[];
  challenges: string[];
  outcomes: string[];
  repoUrl: string;
  demoUrl: string;
  sort: number;
  public: number;
  featured: number;
  status: 'completed' | 'in-progress';
}

const emptyKnowledge = { title: '', category: 'profile', content: '', tags: '', public: 1 };
const emptyProject = {
  title: '',
  role: '负责人',
  summary: '',
  description: '',
  techStack: '',
  highlights: '',
  challenges: '',
  outcomes: '',
  repoUrl: '',
  demoUrl: '',
  sort: 0,
  public: 1,
  featured: 1,
  status: 'completed',
};

export default function AIConfig() {
  const [tab, setTab] = useState<Tab>('key');
  const [key, setKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [knowledgeForm, setKnowledgeForm] = useState<any>(emptyKnowledge);
  const [projectForm, setProjectForm] = useState<any>(emptyProject);
  const [editingKnowledgeId, setEditingKnowledgeId] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [question, setQuestion] = useState('介绍一下王沛钊的项目和技术栈');
  const [answer, setAnswer] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    refresh();
    getAIKeyStatus().then(data => setHasKey(!!data?.hasKey));
  }, []);

  async function refresh() {
    const [knowledgeData, projectData] = await Promise.all([getKnowledge(), getPortfolioProjects()]);
    setKnowledge(Array.isArray(knowledgeData) ? knowledgeData : []);
    setProjects(Array.isArray(projectData) ? projectData : []);
  }

  async function handleSaveKey() {
    if (!key.trim()) return;
    await updateAIKey(key.trim());
    setHasKey(true);
    setSaved(true);
    setKey('');
    setTimeout(() => setSaved(false), 2000);
  }

  async function saveKnowledge() {
    const payload = {
      ...knowledgeForm,
      tags: splitComma(knowledgeForm.tags),
      public: Number(knowledgeForm.public),
    };
    if (editingKnowledgeId) await updateKnowledge(editingKnowledgeId, payload);
    else await createKnowledge(payload);
    setKnowledgeForm(emptyKnowledge);
    setEditingKnowledgeId(null);
    refresh();
  }

  async function saveProject() {
    const payload = {
      ...projectForm,
      techStack: splitLines(projectForm.techStack),
      highlights: splitLines(projectForm.highlights),
      challenges: splitLines(projectForm.challenges),
      outcomes: splitLines(projectForm.outcomes),
      sort: Number(projectForm.sort) || 0,
      public: Number(projectForm.public),
      featured: Number(projectForm.featured),
    };
    if (editingProjectId) await updatePortfolioProject(editingProjectId, payload);
    else await createPortfolioProject(payload);
    setProjectForm(emptyProject);
    setEditingProjectId(null);
    refresh();
  }

  async function runTest() {
    setTesting(true);
    setAnswer('');
    try {
      const data = await chatWithAI(question);
      setAnswer(data.content || data.error || '没有返回内容');
    } finally {
      setTesting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI 工作台</h1>
        <div className="flex rounded-xl bg-white/5 p-1 text-sm">
          {[
            ['key', 'API Key'],
            ['knowledge', '知识库'],
            ['projects', '项目资料'],
            ['test', '调试'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as Tab)} className={`px-3 py-1.5 rounded-lg ${tab === id ? 'bg-[#4ade80] text-black' : 'text-gray-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'key' && (
        <Panel>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-[#4ade80]" />
            <div>
              <h2 className="font-semibold">DeepSeek API</h2>
              <p className="text-xs text-gray-500">配置后 AI 助手会使用 DeepSeek，并启用工具调用。</p>
            </div>
          </div>
          <div className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm ${hasKey ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <Check className="w-4 h-4" />
            {hasKey ? 'API Key 已配置' : '未配置 API Key，当前使用本地 RAG 降级回答'}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="password" value={key} onChange={event => setKey(event.target.value)} placeholder="sk-xxxxxxxx" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm font-mono" />
            </div>
            <button onClick={handleSaveKey} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4ade80] text-black text-sm font-medium hover:bg-[#22c55e]">
              <Save className="w-4 h-4" />
              {saved ? '已保存' : '保存'}
            </button>
          </div>
        </Panel>
      )}

      {tab === 'knowledge' && (
        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <Panel>
            <h2 className="font-semibold mb-4">{editingKnowledgeId ? '编辑知识' : '新增知识'}</h2>
            <FormInput label="标题" value={knowledgeForm.title} onChange={value => setKnowledgeForm({ ...knowledgeForm, title: value })} />
            <FormInput label="分类" value={knowledgeForm.category} onChange={value => setKnowledgeForm({ ...knowledgeForm, category: value })} />
            <FormInput label="标签，逗号分隔" value={knowledgeForm.tags} onChange={value => setKnowledgeForm({ ...knowledgeForm, tags: value })} />
            <FormTextarea label="内容" value={knowledgeForm.content} rows={8} onChange={value => setKnowledgeForm({ ...knowledgeForm, content: value })} />
            <button onClick={saveKnowledge} className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4ade80] text-black text-sm font-medium">
              <Plus className="w-4 h-4" />
              保存知识
            </button>
          </Panel>
          <div className="space-y-3">
            {knowledge.map(item => (
              <Panel key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#4ade80]">{item.category} · {item.tags.join(', ')}</div>
                    <h3 className="font-semibold mt-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-3">{item.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingKnowledgeId(item.id); setKnowledgeForm({ ...item, tags: item.tags.join(', ') }); }} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm">编辑</button>
                    <button onClick={async () => { await deleteKnowledge(item.id); refresh(); }} className="p-2 rounded-lg text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      )}

      {tab === 'projects' && (
        <div className="grid grid-cols-1 xl:grid-cols-[460px_1fr] gap-6">
          <Panel>
            <h2 className="font-semibold mb-4">{editingProjectId ? '编辑项目' : '新增项目'}</h2>
            <FormInput label="项目名称" value={projectForm.title} onChange={value => setProjectForm({ ...projectForm, title: value })} />
            <FormInput label="角色" value={projectForm.role} onChange={value => setProjectForm({ ...projectForm, role: value })} />
            <FormInput label="一句话摘要" value={projectForm.summary} onChange={value => setProjectForm({ ...projectForm, summary: value })} />
            <FormTextarea label="项目描述" value={projectForm.description} rows={4} onChange={value => setProjectForm({ ...projectForm, description: value })} />
            <FormTextarea label="技术栈，每行一个" value={projectForm.techStack} rows={3} onChange={value => setProjectForm({ ...projectForm, techStack: value })} />
            <FormTextarea label="亮点，每行一个" value={projectForm.highlights} rows={3} onChange={value => setProjectForm({ ...projectForm, highlights: value })} />
            <FormTextarea label="难点，每行一个" value={projectForm.challenges} rows={3} onChange={value => setProjectForm({ ...projectForm, challenges: value })} />
            <FormTextarea label="成果，每行一个" value={projectForm.outcomes} rows={3} onChange={value => setProjectForm({ ...projectForm, outcomes: value })} />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="仓库链接" value={projectForm.repoUrl} onChange={value => setProjectForm({ ...projectForm, repoUrl: value })} />
              <FormInput label="演示链接" value={projectForm.demoUrl} onChange={value => setProjectForm({ ...projectForm, demoUrl: value })} />
            </div>
            <button onClick={saveProject} className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4ade80] text-black text-sm font-medium">
              <Plus className="w-4 h-4" />
              保存项目
            </button>
          </Panel>
          <div className="space-y-3">
            {projects.map(project => (
              <Panel key={project.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#4ade80]">{project.role} · {project.techStack.join(', ')}</div>
                    <h3 className="font-semibold mt-1">{project.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">{project.summary}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingProjectId(project.id); setProjectForm(projectToForm(project)); }} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm">编辑</button>
                    <button onClick={async () => { await deletePortfolioProject(project.id); refresh(); }} className="p-2 rounded-lg text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      )}

      {tab === 'test' && (
        <Panel>
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-5 h-5 text-[#4ade80]" />
            <h2 className="font-semibold">AI 助手调试</h2>
          </div>
          <FormTextarea label="测试问题" value={question} rows={3} onChange={setQuestion} />
          <button onClick={runTest} disabled={testing} className="mt-3 px-4 py-2.5 rounded-xl bg-[#4ade80] text-black text-sm font-medium disabled:opacity-50">
            {testing ? '生成中...' : '发送测试'}
          </button>
          {answer && <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-white/5 p-4 text-sm text-gray-300 leading-7">{answer}</pre>}
        </Panel>
      )}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-[#151515] border border-white/5 p-6">{children}</div>;
}

function FormInput({ label, value, onChange }: { label: string; value: string | number; onChange: (value: string) => void }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm text-gray-400 mb-1.5">{label}</span>
      <input value={value} onChange={event => onChange(event.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm" />
    </label>
  );
}

function FormTextarea({ label, value, rows, onChange }: { label: string; value: string; rows: number; onChange: (value: string) => void }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm text-gray-400 mb-1.5">{label}</span>
      <textarea value={value} rows={rows} onChange={event => onChange(event.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#4ade80]/50 text-sm resize-y" />
    </label>
  );
}

function splitComma(value: string) {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

function splitLines(value: string) {
  return value.split('\n').map(item => item.trim()).filter(Boolean);
}

function projectToForm(project: Project) {
  return {
    ...project,
    techStack: project.techStack.join('\n'),
    highlights: project.highlights.join('\n'),
    challenges: project.challenges.join('\n'),
    outcomes: project.outcomes.join('\n'),
  };
}

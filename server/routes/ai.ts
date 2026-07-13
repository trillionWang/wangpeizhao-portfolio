import { Router } from 'express';
import axios from 'axios';
import {
  findAll,
  getConfig,
  getPublicProfile,
  KnowledgeRecord,
  PortfolioProjectRecord,
  PostRecord,
  SkillRecord,
} from '../database';

const router = Router();

const tools = [
  {
    type: 'function',
    function: {
      name: 'get_profile',
      description: '查询王沛钊的公开个人简介、求职方向和联系方式。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_projects',
      description: '查询王沛钊的公开项目经历、技术栈、亮点和成果。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_skills',
      description: '查询王沛钊的技术栈、技能分类和掌握程度。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_recent_posts',
      description: '查询最近公开文章和生活记录摘要。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
];

router.post('/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();
    if (!message) {
      res.status(400).json({ error: '请输入消息' });
      return;
    }

    const config = getConfig();
    const context = buildContext(message);

    if (!config.deepseek_key) {
      res.json({ content: localAnswer(message, context) });
      return;
    }

    const baseMessages: any[] = [
      { role: 'system', content: systemPrompt(context) },
      { role: 'user', content: message },
    ];

    const first = await callDeepSeek(config.deepseek_key, baseMessages, true);
    const firstMessage = first.data.choices?.[0]?.message;

    if (firstMessage?.tool_calls?.length) {
      const toolMessages = firstMessage.tool_calls.map((call: any) => ({
        role: 'tool',
        tool_call_id: call.id,
        content: JSON.stringify(runTool(call.function?.name), null, 2),
      }));
      const second = await callDeepSeek(config.deepseek_key, [...baseMessages, firstMessage, ...toolMessages], false);
      res.json({ content: second.data.choices?.[0]?.message?.content || '暂时没有生成回复。' });
      return;
    }

    res.json({ content: firstMessage?.content || '暂时没有生成回复。' });
  } catch (err: any) {
    console.error('AI API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI 服务调用失败，请检查 API Key 或稍后再试。' });
  }
});

function callDeepSeek(apiKey: string, messages: any[], useTools: boolean) {
  return axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: 'deepseek-chat',
      messages,
      stream: false,
      ...(useTools ? { tools, tool_choice: 'auto' } : {}),
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    },
  );
}

function systemPrompt(context: string) {
  return [
    '你是王沛钊个人主页上的 AI 助手，面向 HR、面试官、同学和访客。',
    '你的任务是介绍他的项目、技术能力、经历和生活记录，回答要真实、克制、具体。',
    '只使用公开信息和检索到的上下文，不要编造学校、公司、奖项、联系方式或隐私。',
    '如果问题涉及后台、密钥、未公开信息或隐私，礼貌拒绝。',
    '可通过工具查询公开资料、项目、技能和文章摘要。',
    `检索上下文：\n${context || '暂无额外上下文。'}`,
  ].join('\n');
}

function buildContext(query: string) {
  const searchable = [
    ...findAll<KnowledgeRecord>('knowledge').filter(item => item.public !== 0).map(item => ({
      title: item.title,
      body: `${item.category} ${item.tags.join(' ')} ${item.content}`,
    })),
    ...findAll<PortfolioProjectRecord>('projects').filter(item => item.public !== 0).map(item => ({
      title: item.title,
      body: `${item.summary} ${item.description} ${item.techStack.join(' ')} ${item.highlights.join(' ')}`,
    })),
    ...findAll<SkillRecord>('skills').filter(item => item.public !== 0).map(item => ({
      title: item.name,
      body: `${item.category} ${item.description} ${item.keywords.join(' ')}`,
    })),
    ...findAll<PostRecord>('posts').filter(item => item.published !== 0).map(item => ({
      title: item.title,
      body: `${item.summary} ${item.tags.join(' ')} ${item.content}`,
    })),
  ];

  const terms = query.toLowerCase().split(/\s+|，|,|。|\?|？/).filter(Boolean);
  return searchable
    .map(item => ({
      ...item,
      score: terms.reduce((sum, term) => sum + (`${item.title} ${item.body}`.toLowerCase().includes(term) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => `### ${item.title}\n${item.body.slice(0, 900)}`)
    .join('\n\n');
}

function runTool(name: string) {
  const publicProfile = getPublicProfile();
  if (name === 'get_profile') return publicProfile.config;
  if (name === 'get_projects') return publicProfile.projects;
  if (name === 'get_skills') return publicProfile.skills;
  if (name === 'get_recent_posts') return publicProfile.posts;
  return { error: 'Unknown tool' };
}

function localAnswer(message: string, context: string) {
  const profile = getPublicProfile();
  const text = message.toLowerCase();

  if (/项目|project|经历/.test(text)) {
    const projects = profile.projects.slice(0, 3).map(project => `- ${project.title}：${project.summary}`).join('\n');
    return `我可以介绍王沛钊的重点项目：\n${projects}\n\n如果你想看某个项目的技术栈、难点或成果，可以继续追问。`;
  }

  if (/技能|技术|tech|java|agent|rag/.test(text)) {
    const skills = profile.skills.map(skill => `- ${skill.name}：${skill.description}`).join('\n');
    return `他的主要技术能力包括：\n${skills}`;
  }

  if (/联系|邮箱|github/.test(text)) {
    return `可以通过 GitHub ${profile.config.github || '暂未配置'} ${profile.config.email ? `或邮箱 ${profile.config.email}` : ''} 了解更多。`;
  }

  return [
    `你好，我是王沛钊个人主页的 AI 助手。当前未配置 DeepSeek API Key，所以我会基于本地公开资料回答。`,
    `他的目标方向是：${profile.config.targetRole}。`,
    context ? `我检索到的相关资料：\n${context.slice(0, 1200)}` : '你可以问我他的项目、技术栈、文章记录或联系方式。',
  ].join('\n\n');
}

export default router;

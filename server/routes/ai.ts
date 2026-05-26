import { Router } from 'express';
import axios from 'axios';
import { get } from '../database';

const router = Router();

// POST /api/ai/chat - 公开接口（DeepSeek代理）
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: '请输入消息' });
      return;
    }

    // Get DeepSeek API Key from database
    const config = await get('SELECT deepseek_key FROM site_config WHERE id = 1');
    const apiKey = config?.deepseek_key;

    if (!apiKey) {
      // Fallback to mock response if no API key
      const mockResponses: Record<string, string> = {
        '帮我写一篇关于Spring Boot的入门教程': '好的！以下是Spring Boot入门教程大纲：\n\n## 1. 什么是Spring Boot\nSpring Boot是一个简化Spring应用开发的框架...\n\n## 2. 快速开始\n使用Spring Initializr创建项目...\n\n## 3. 自动配置原理\n@SpringBootApplication注解解析...\n\n## 4. 常用 Starter\n- spring-boot-starter-web\n- spring-boot-starter-data-jpa\n- spring-boot-starter-redis',
        '解释一下Redis缓存穿透、击穿、雪崩的区别': '## 缓存穿透\n查询不存在的数据，每次都直达数据库。\n**解决方案**：布隆过滤器 + 缓存空值\n\n## 缓存击穿\n热点key突然失效，大量请求打到数据库。\n**解决方案**：互斥锁 + 逻辑过期\n\n## 缓存雪崩\n大量key同时过期，数据库压力骤增。\n**解决方案**：随机过期时间 + 多级缓存',
        '什么是DDD领域驱动设计？': 'DDD（Domain-Driven Design）核心思想：\n\n- **实体（Entity）**：有唯一标识的对象\n- **值对象（Value Object）**：无标识，通过属性判断相等\n- **聚合（Aggregate）**：一组相关对象的集合\n- **领域服务（Domain Service）**：处理跨实体业务逻辑\n- **仓储（Repository）**：数据访问抽象',
        '给我制定一个Java后端学习路线': '## Java后端学习路线\n\n### 阶段一：基础（1-2个月）\n- JavaSE核心语法、面向对象、集合框架\n- IO/NIO、多线程与并发\n\n### 阶段二：数据库（1个月）\n- MySQL基础与进阶、SQL优化\n- Redis缓存\n\n### 阶段三：框架（2-3个月）\n- Spring Framework、Spring Boot\n- MyBatis-Plus、Spring Security\n\n### 阶段四：进阶\n- 消息队列（Kafka/RocketMQ）\n- 微服务（Spring Cloud）\n- Docker/K8s、DDD架构',
      };
      const response = mockResponses[message] || `关于"${message}"，我可以帮你查找相关技术文档、提供代码示例、分析最佳实践。请在后台配置DeepSeek API Key以获得更智能的回复！`;
      res.json({ content: response });
      return;
    }

    // Call DeepSeek API
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个专业的技术助手，擅长Java后端开发、AI Agent、数据结构和系统设计。请用中文回答。' },
          { role: 'user', content: message },
        ],
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices?.[0]?.message?.content || '暂无回复';
    res.json({ content });
  } catch (err: any) {
    console.error('AI API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI服务调用失败，请检查API Key是否正确' });
  }
});

export default router;

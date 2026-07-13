# 静态部署流程

当前站点已经改为静态站点：内容保存在仓库文件中，部署平台只负责构建 `dist`。这种方式和 OverThinker / X-Plore 的更新逻辑更接近，不需要数据库、后台服务、JWT、Render 磁盘或在线上传接口。

## Render Blueprint 填写

- Blueprint Name: `rua`
- Branch: `main`
- Blueprint Path: 留空，或填写 `render.yaml`

Render 会读取仓库根目录的 `render.yaml`：

```yaml
services:
  - type: web
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
```

不需要填写这些环境变量：

- `PORT`
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `DEEPSEEK_API_KEY`
- `PERSISTENT_DIR`

## 手动创建 Static Site

如果不用 Blueprint，也可以在 Render 手动创建：

- Service Type: Static Site
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Auto Deploy: Yes
- Branch: `main`
- Rewrite Rule: `/*` -> `/index.html`

## 内容更新方式

以后更新文章、项目、相册、音乐和 AI 知识，不在网页后台操作，而是在本地改仓库文件：

- 文章：`src/data/posts.ts`
- 项目、技能、AI 知识：`src/data/portfolio.ts`
- 相册、日记、音乐：`src/data/content.ts`
- 图片资源：建议放在 `public/images/`
- 音乐资源：建议放在 `public/music/`

更新后执行：

```bash
npm run build
git add .
git commit -m "content: update portfolio"
git push origin main
```

推送到 GitHub 后，Render 会自动重新部署。

## 本地验证

```bash
npm run dev
npm run build
```

本地开发地址通常是 `http://localhost:5173/`。

## 当前静态模式的功能边界

- 留言板：可以提交，但只保存在当前访客浏览器的 `localStorage`，不会公开写入服务器。
- AI 助手：使用站内静态资料做本地检索回答，不连接 DeepSeek，避免前端暴露 API Key。
- 访客地理位置：浏览器端调用公开 IP 归属地服务，失败时会降级为“未知地区”。
- 在线后台：已从运行路由中移除，内容通过 Git 更新和持久化。

# 部署流程

当前项目是一个 React + Vite 前端和 Express 后端合在一起的 Node Web Service。生产环境由后端同时托管 `dist` 静态文件和 `/api/*` 接口。

## 1. 本地确认

```bash
npm install
npm run lint
npm run build
npm start
```

本地检查：

- 首页：`http://localhost:3001`
- 健康检查：`http://localhost:3001/api/health`
- 后台私密路径：默认 `http://localhost:3001/rua-studio/login`

开发时也可以分开启动：

```bash
npm run server
npx vite --host 0.0.0.0
```

开发首页：`http://localhost:3000`

## 2. 推送到 GitHub

```bash
git status
git add .
git commit -m "feat: update portfolio homepage and admin backend"
git push origin main
```

## 3. Render 部署

在 Render 创建或更新 Web Service：

- Runtime: `Node`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Branch: `main`

环境变量至少配置：

```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=换成一个足够长的随机字符串
ADMIN_USER=admin
ADMIN_PASSWORD=换成你的后台登录密码
VITE_ADMIN_BASE=/rua-studio
```

`JWT_SECRET` 和 `ADMIN_PASSWORD` 在生产环境不能使用默认值，否则服务会拒绝启动。

## 4. 持久化数据

当前第一版持久化使用本地文件：

- 结构化数据：`data/db.json`
- 上传文件：`uploads/`

如果部署到 Render，建议在服务里挂载 Persistent Disk，并把磁盘挂载到项目根目录下的数据目录，至少要覆盖：

- `/opt/render/project/src/data`
- `/opt/render/project/src/uploads`

没有持久化磁盘时，文章、后台配置、RAG 知识库、上传图片和音乐在服务重建后可能丢失。

## 5. 部署后验证

打开以下地址：

- `https://你的域名/api/health`
- `https://你的域名/`
- `https://你的域名/rua-studio/login`

后台登录后验证：

- 发布文章
- 编辑项目
- 上传图片或音乐
- 新增 AI 知识库条目

公开页面验证：

- 导航栏不出现后台入口
- 左上角品牌显示 `rua`
- 左下角访客信息展示系统、浏览器、设备、屏幕和粗略地理位置
- `/api/config` 和 `/api/profile` 不返回 `deepseek_key`

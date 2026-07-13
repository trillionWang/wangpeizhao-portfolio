# Render 部署流程

本项目是 React + Vite 前端和 Express 后端合并部署的 Node Web Service。生产环境由 Express 同时托管：

- 前端静态文件：`dist/`
- 后端接口：`/api/*`
- 上传文件：`/uploads/*`

仓库已提供 `render.yaml`，可以用 Render Blueprint 自动创建服务、磁盘和环境变量占位。

## 1. 本地验证

```bash
npm install
npm run lint
npm run build
npm start
```

本地访问：

- 首页：`http://localhost:3001`
- 健康检查：`http://localhost:3001/api/health`
- 后台登录：`http://localhost:3001/rua-studio/login`

## 2. 推送代码

```bash
git add .
git commit -m "chore: configure render deployment"
git push origin main
```

## 3. 用 Blueprint 配置 Render

1. 打开 Render Dashboard。
2. 点击 **New +**。
3. 选择 **Blueprint**。
4. 连接 GitHub 仓库：`trillionWang/wangpeizhao-portfolio`。
5. Render 会读取仓库根目录的 `render.yaml`。
6. 按提示填写 `sync: false` 的敏感环境变量。

`render.yaml` 已配置：

- Runtime: `node`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Persistent Disk: `/var/data`
- Auto Deploy: `true`

## 4. 必填环境变量

Render 创建 Blueprint 时会要求填写以下敏感变量：

```bash
ADMIN_PASSWORD=你的后台登录密码
JWT_SECRET=一个足够长的随机字符串
DEEPSEEK_API_KEY=你的 DeepSeek Key，可先留空
```

其他变量已在 `render.yaml` 中给默认值：

```bash
NODE_ENV=production
PORT=10000
PERSISTENT_DIR=/var/data
VITE_ADMIN_BASE=/rua-studio
ADMIN_USER=admin
```

生产环境必须配置 `ADMIN_PASSWORD` 和 `JWT_SECRET`，否则服务会拒绝启动。

## 5. 持久化说明

Render 的免费实例重建时，本地普通目录会丢失。项目已经改为通过 `PERSISTENT_DIR=/var/data` 使用 Persistent Disk：

- 数据库文件：`/var/data/data/db.json`
- 上传文件：`/var/data/uploads`

这会保存后台发布的文章、站点配置、项目资料、RAG 知识库、图片和音乐。

## 6. 部署后验证

部署完成后访问：

- `https://你的域名/api/health`
- `https://你的域名/`
- `https://你的域名/rua-studio/login`

验证重点：

- 首页能打开。
- `/api/health` 返回 `{"status":"ok"}`。
- 后台登录可用。
- 发布文章后刷新仍存在。
- 上传图片后刷新仍存在。
- `/api/config` 和 `/api/profile` 不返回 `deepseek_key`。

## 7. 绑定自定义域名

在 Render 服务里进入 **Settings > Custom Domains**：

1. 添加 `wangpeizhao.top`。
2. 按 Render 给出的 DNS 记录去域名服务商配置。
3. 等 DNS 生效和 SSL 证书签发完成。

如果域名访问超时，优先检查：

- Render 服务是否 Live。
- Deploy Logs 是否有启动错误。
- `ADMIN_PASSWORD` 和 `JWT_SECRET` 是否已配置。
- 域名 DNS 是否指向 Render。

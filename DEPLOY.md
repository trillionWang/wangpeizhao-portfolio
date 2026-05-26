# 博客系统部署指南（超详细版）

## 你的部署架构

```
GitHub 仓库
    │
    ├── 推送到 GitHub
    │
    ▼
Render.com (免费托管后端+前端)
    │
    ├── 自动拉取代码
    ├── 自动构建 (npm run build)
    ├── 自动启动 (npm start)
    │
    ▼
https://你的项目名.onrender.com
    ├── /          → 博客首页
    ├── /admin     → 管理后台
    └── /api/*     → 后端API
```

---

## 第一步：准备工作

### 1.1 安装 Git（如果还没装）

```bash
# Windows: 下载安装 https://git-scm.com/download/win
# Mac:     brew install git
# 检查是否安装成功
git --version
```

### 1.2 配置 Git 用户信息（首次使用需要）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

---

## 第二步：把新项目推送到 GitHub

### 2.1 备份你的旧仓库（可选但推荐）

先把原来的仓库改个名，留作备份：

1. 打开 https://github.com/trillionWang/wangpeizhao-portfolio
2. 点击右上角的 **Settings**
3. 在 **Repository name** 处改名为 `wangpeizhao-portfolio-old`
4. 点击 **Rename**

### 2.2 在 GitHub 创建新仓库

1. 打开 https://github.com/new
2. **Repository name**: `wangpeizhao-portfolio`（和原来一样）
3. 选择 **Public**（公开）
4. 不要勾选 "Add a README file"
5. 点击 **Create repository**

创建后你会看到类似这样的页面：

```
https://github.com/trillionWang/wangpeizhao-portfolio
```

### 2.3 解压项目代码并推送

```bash
# 1. 解压 blog-project.zip 到你电脑上的某个文件夹
# 比如解压到桌面：C:\Users\你的用户名\Desktop\wangpeizhao-portfolio

# 2. 打开终端，进入项目文件夹
cd wangpeizhao-portfolio

# 3. 初始化 Git 仓库
git init

# 4. 添加所有文件到暂存区
git add .

# 5. 提交代码
git commit -m "feat: 全栈博客系统 - React前端 + Express后端 + 管理后台"

# 6. 连接到远程仓库（把下面的 URL 换成你的）
git remote add origin https://github.com/trillionWang/wangpeizhao-portfolio.git

# 7. 推送到 GitHub
git branch -M main
git push -u origin main
```

推送成功后，刷新 GitHub 页面，应该能看到所有代码文件。

---

## 第三步：注册 Render.com 并部署

### 3.1 注册 Render

1. 打开 https://dashboard.render.com
2. 点击 **Sign Up**（注册）
3. 选择 **Sign up with GitHub**（用 GitHub 账号直接登录，最方便）
4. 授权 Render 访问你的 GitHub 仓库

### 3.2 创建 Web Service

1. 登录后点击 Dashboard 右上角的 **New +**
2. 选择 **Web Service**（新的 Web 服务）
3. 在列表中找到你的仓库 `wangpeizhao-portfolio`
4. 点击 **Connect**

### 3.3 配置部署参数

填写以下信息：

| 配置项 | 填写内容 | 说明 |
|--------|---------|------|
| **Name** | `wangpeizhao-portfolio` | 服务名称，会作为域名的一部分 |
| **Region** | `Singapore` 或 `Oregon (US West)` | 服务器位置，选离你近的 |
| **Runtime** | `Node` | 运行环境 |
| **Build Command** | `npm install && npm run build` | 构建命令 |
| **Start Command** | `npm start` | 启动命令 |
| **Plan** | `Free` | 免费套餐 |

### 3.4 添加环境变量

往下滑到 **Environment Variables** 区域，点击 **Add Environment Variable** 添加：

| Key | Value | 说明 |
|-----|-------|------|
| `NODE_ENV` | `production` | 生产环境模式 |
| `JWT_SECRET` | 自己随便写一个长字符串，比如 `MySuperSecretKey123456789!@#$` | JWT 签名密钥，用于登录认证 |
| `PORT` | `10000` | Render 默认端口 |

> **重要**：JWT_SECRET 一定要改成一个你自己记得但别人猜不到的字符串！这是你的后台登录安全密钥。

### 3.5 开始部署

1. 点击页面最下方的 **Create Web Service**
2. Render 会自动开始构建和部署
3. 在 **Events** 标签页可以看到构建日志
4. 等待 2-5 分钟，直到看到状态变成 **Live**

部署成功后，你会得到一个域名：

```
https://wangpeizhao-portfolio.onrender.com
```

---

## 第四步：验证部署是否成功

### 4.1 测试博客首页

在浏览器打开：
```
https://wangpeizhao-portfolio.onrender.com
```

应该能看到你的博客首页。

### 4.2 测试 API 接口

在浏览器打开：
```
https://wangpeizhao-portfolio.onrender.com/api/health
```

如果返回：
```json
{"status":"ok","timestamp":"..."}
```

说明后端运行正常。

### 4.3 测试文章 API

```
https://wangpeizhao-portfolio.onrender.com/api/posts
```

应该返回文章列表的 JSON 数据。

### 4.4 进入管理后台

```
https://wangpeizhao-portfolio.onrender.com/admin
```

输入账号密码：
- 用户名：`admin`
- 密码：`admin123`

登录后应该能看到仪表盘。

---

## 第五步：绑定你自己的域名（可选）

如果你有自己的域名 `wangpeizhao.top`，可以绑定到 Render：

### 5.1 在 Render 添加自定义域名

1. 打开 Render Dashboard，进入你的服务
2. 点击左侧 **Settings**
3. 往下找到 **Custom Domains**，点击 **Add Custom Domain**
4. 输入你的域名：`wangpeizhao.top`
5. 点击 **Add Domain**
6. Render 会给你一个 CNAME 记录，比如 `wangpeizhao-portfolio.onrender.com`

### 5.2 在域名服务商添加 DNS 解析

登录你买域名的平台（阿里云、腾讯云、Cloudflare 等），添加 DNS 记录：

| 类型 | 主机记录 | 记录值 |
|------|---------|--------|
| CNAME | @ | wangpeizhao-portfolio.onrender.com |

等待 DNS 生效（通常 10 分钟到 24 小时）。

---

## 第六步：后续更新代码

以后你修改了代码，只需要：

```bash
cd wangpeizhao-portfolio

# 修改代码...

# 提交修改
git add .
git commit -m "修改内容描述"

# 推送到 GitHub
git push origin main
```

Render 会自动检测代码推送并重新部署！

---

## 常见问题

### Q1: Render 部署失败，日志显示 "Build failed"

**排查步骤：**
1. 在 Render Dashboard → Events 里看具体错误信息
2. 常见原因：
   - `npm install` 失败 → 检查 package.json 是否上传完整
   - `npm run build` 失败 → 检查 TypeScript 是否有错误
   - `npm start` 失败 → 检查 server/index.ts 是否存在

**解决方法：**
```bash
# 在本地先测试构建是否成功
npm run build
# 如果没有报错再推送
```

### Q2: 打开页面显示空白或 404

1. 检查 API 是否正常：`/api/health`
2. 检查 dist 文件夹是否存在（应该在项目根目录）
3. 检查 Render 的 Build Command 是否正确执行了 `npm run build`

### Q3: API 请求返回 401 Unauthorized

这是正常的！401 表示需要登录。前台页面不需要登录就能访问，只有管理后台和修改操作需要登录。

### Q4: 管理后台登录后还是跳转回登录页

可能是 JWT_SECRET 没有设置，或者浏览器禁用了 localStorage。

**检查：**
1. 确认 Render 的 Environment Variables 里有 `JWT_SECRET`
2. 清除浏览器缓存，重新登录

### Q5: SQLite 报错，显示找不到模块

不用慌！代码会自动回退到 JSON 文件存储。

数据会保存在 `data/db.json` 文件中。

### Q6: 免费版 Render 有什么限制？

- 15 分钟后无人访问会自动休眠（sleep）
- 首次访问需要等待 30 秒左右唤醒
- 每月 750 小时免费
- 对于个人博客完全够用

**解决方法**：如果嫌唤醒慢，可以写一个定时任务每 10 分钟 ping 一次你的服务。

### Q7: 如何修改管理员密码？

目前需要在后端手动修改。后续你可以在后台加一个"修改密码"功能。

临时方法：在 Render 的 Shell 中运行：
```bash
# 进入项目目录
cd /opt/render/project/src

# 启动 Node 交互式环境
node

# 然后执行：
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('你的新密码', 10);
console.log(hash);
// 复制输出的哈希值

# 然后修改 data/db.json 中 users 表的 password 字段
# 或者修改 SQLite 数据库
```

---

## 技术栈总结

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React 19 + TypeScript | 组件化开发 |
| 前端构建 | Vite | 快速构建 |
| 前端样式 | Tailwind CSS | 原子化CSS |
| UI组件 | shadcn/ui | 40+组件 |
| 路由 | React Router v7 | 页面路由 |
| 状态管理 | localStorage + API | 简单够用 |
| 后端框架 | Express.js | Node.js Web框架 |
| 数据库 | SQLite3 + JSON fallback | 文件型数据库 |
| 认证 | JWT (jsonwebtoken) | Token认证 |
| 密码加密 | bcryptjs | 安全加密 |
| AI代理 | DeepSeek API | 大语言模型 |
| 部署平台 | Render.com | 免费托管 |

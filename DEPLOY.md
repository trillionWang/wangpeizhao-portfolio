# Render 免费部署流程

当前仓库已经提供 `render.yaml`，用于 Render Blueprint 免费部署。

## 1. 在 Render 页面怎么填

- Blueprint Name: `rua`
- Branch: `main`
- Blueprint Path: 留空，或者填 `render.yaml`

现在的 `render.yaml` 使用 `plan: free`，并且已经移除了 Persistent Disk，所以不会再出现 `disks are not supported for free tier services`。

## 2. Render 会自动读取的配置

- Runtime: `node`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Auto Deploy: `true`
- Admin Path: `/rua-studio`

## 3. 需要手动填写的环境变量

Render 页面会提示填写这些 `sync: false` 变量：

```bash
ADMIN_PASSWORD=你的后台登录密码
JWT_SECRET=一个足够长的随机字符串
DEEPSEEK_API_KEY=你的 DeepSeek Key，可以先留空
```

建议：

- `ADMIN_PASSWORD` 不要用简单密码。
- `JWT_SECRET` 至少 32 位，可以用随机字母数字符号。
- `DEEPSEEK_API_KEY` 没有也可以先空着，AI 助手会走降级回答。

## 4. 免费方案的数据限制

Render 免费服务不能挂 Persistent Disk，所以当前免费部署下：

- 后台发布的文章可能在服务重建后丢失。
- 上传的图片、音乐可能在服务重建后丢失。
- 后台配置和 RAG 知识库可能在服务重建后丢失。

这不影响你先把网站跑起来。等你确认长期使用，再升级 Render 套餐并重新开启磁盘持久化。

## 5. 部署后验证

部署完成后访问：

- `https://你的域名/api/health`
- `https://你的域名/`
- `https://你的域名/rua-studio/login`

如果 `/api/health` 返回：

```json
{"status":"ok"}
```

说明后端启动成功。

## 6. 自定义域名

在 Render 服务页面进入 **Settings > Custom Domains**：

1. 添加 `wangpeizhao.top`。
2. 按 Render 给出的 DNS 记录去域名服务商配置。
3. 等 DNS 生效和 SSL 证书签发完成。

如果域名访问超时，优先检查：

- Render 服务是否为 Live。
- Deploy Logs 是否报错。
- `ADMIN_PASSWORD` 和 `JWT_SECRET` 是否已填写。
- 域名 DNS 是否已经指向 Render。

## 7. 后续升级持久化

如果以后要保存后台数据，需要升级 Render 套餐，然后在 `render.yaml` 里加回：

```yaml
      - key: PERSISTENT_DIR
        value: /var/data
    disk:
      name: portfolio-data
      mountPath: /var/data
      sizeGB: 1
```

代码已经支持 `PERSISTENT_DIR`，后续只需要改 Render 配置即可。

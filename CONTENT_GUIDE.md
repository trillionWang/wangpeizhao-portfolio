# 内容更新指南

这个站点现在采用“静态文件 + GitHub + 自动部署”的内容管理方式。

## 更新文章

编辑 `src/data/posts.ts`，在 `posts` 数组中新增一项：

```ts
{
  id: '7',
  title: '新的文章标题',
  date: '2026-07-13',
  category: '项目复盘',
  tags: ['Java', '复盘'],
  summary: '一句话摘要。',
  content: `## 小标题

正文内容支持简单 Markdown 风格。`,
  wordCount: 300,
  readTime: 2,
  slug: 'new-post',
  cover: '/images/new-post-cover.jpg',
}
```

## 更新项目和技能

编辑 `src/data/portfolio.ts`：

- `projects`：主页和项目页展示的项目。
- `skills`：技能矩阵。
- `knowledge`：AI 助手检索用的个人资料。
- `profileConfig`：站点品牌、邮箱、GitHub、求职方向等。

## 更新照片和音乐

编辑 `src/data/content.ts`：

- `albums`：相册。
- `diaryEntries`：日记。
- `songs`：音乐播放器。

本地文件建议放在：

- 图片：`public/images/xxx.jpg`，页面中写 `/images/xxx.jpg`
- 音乐：`public/music/xxx.mp3`，页面中写 `/music/xxx.mp3`

## 发布

```bash
npm run build
git add .
git commit -m "content: update site"
git push origin main
```

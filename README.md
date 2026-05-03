# Miao's World

个人综合性网站。首期实现博客板块，预留项目展示、简历、旅行等板块扩展接口。

## 技术栈

| 层 | 选型 | 版本 |
|---|---|---|
| 框架 | Astro (SSG) | ^6.2 |
| 样式 | Tailwind CSS + `@tailwindcss/typography` | ^4.1 |
| 内容 | Astro Content Collections (legacy compat) | — |
| 部署 | GitHub Pages (GitHub Actions) | — |
| 包管理 | pnpm | ^10 |

## 目录结构

```
miao-world/
├── astro.config.mjs            # Astro 配置 (集成、legacy flag、site URL)
├── tsconfig.json               # TypeScript 配置 (extends astro/tsconfigs/strict)
├── package.json                # 依赖与脚本
├── public/                     # 静态资源 (favicon 等)
├── src/
│   ├── content.config.ts       # Content Collections 集合定义
│   ├── content/                # 内容目录 (每板块一个子目录)
│   │   └── blog/               # 博客文章 (.md / .mdx)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BaseLayout.astro # 全局布局壳 (<html> + <head> + slot)
│   │   │   ├── Header.astro     # 顶部导航栏 (固定顶部, 数据驱动)
│   │   │   └── Footer.astro     # 页脚
│   │   ├── blog/
│   │   │   ├── PostCard.astro   # 博客列表卡片
│   │   │   └── PostContent.astro # 文章详情容器 (render + prose)
│   │   └── ui/
│   │       ├── SEO.astro        # SEO meta / OG 标签
│   │       └── TagBadge.astro   # 标签徽章
│   ├── pages/
│   │   ├── index.astro          # 主页 "/" (Hero + 最新文章)
│   │   └── blog/
│   │       ├── index.astro      # 博客列表 "/blog"
│   │       └── [...slug].astro  # 文章详情 "/blog/:slug"
│   ├── data/
│   │   └── navigation.ts       # 导航配置 (数据驱动，加板块在此追加)
│   ├── styles/
│   │   └── global.css           # Tailwind CSS 4 入口 + 主题变量 + prose 定制
│   └── utils/
│       └── date.ts              # 日期格式化 (zh-CN)
└── .github/workflows/
    └── deploy.yml               # push main → 构建 → 部署到 GitHub Pages
```

## 架构约定

### 导航系统 (数据驱动)

导航项定义在 `src/data/navigation.ts`。Header 组件遍历此数组渲染，自动高亮当前路由。

```ts
export const navigation = [
  { label: "首页", path: "/" },
  { label: "博客", path: "/blog" },
  // 加板块 = 在此追加一行 + 创建对应 page 文件
];
```

### 内容集合 (Content Collections)

- 集合定义在 `src/content.config.ts`，使用 `defineCollection` + `zod` schema
- 文章内容放在 `src/content/<collection-name>/` 下
- 列表页用 `getCollection("blog")` 查询，支持 `filter` 过滤
- 详情页用 `import { render } from "astro:content"` 渲染 Markdown 正文
- **注意**: 已启用 `legacy.collectionsBackwardsCompat`，支持 `render()` 函数

### 样式系统

- **引擎**: Tailwind CSS 4 (CSS-first 配置, 无 `tailwind.config.*` 文件)
- **入口**: `src/styles/global.css` — 通过 `@import "tailwindcss"` 和 `@plugin` 加载
- **主题变量**: 用 `@theme` 块定义项目色板 (`--color-bg`, `--color-accent` 等)
- **文章排版**: 通过 `@tailwindcss/typography` 的 prose 类 + CSS 自定义属性覆盖
- **暗色主题**: 默认暗色背景 (`oklch` 色彩空间)，青色强调色
- **动画**: 纯 CSS `@keyframes fade-up` + `animation-delay` 实现入场效果

### 路径别名

当前未配置路径别名。组件导入使用相对路径 (如 `../../utils/date`)。如需添加别名，在 `tsconfig.json` 和 `astro.config.mjs` 中配置。

## 扩展指南

### 添加新板块 (以「项目展示」为例)

**Step 1** — 在 `navigation.ts` 追加导航项：
```ts
{ label: "项目", path: "/projects" },
```

**Step 2** — 在 `content.config.ts` 定义集合 (可选，如果板块有内容)：
```ts
const projects = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
    techStack: z.array(z.string()),
  }),
});
// 加到 collections export 里
```

**Step 3** — 创建内容目录 `src/content/projects/` 和相应的 `.md` 文件

**Step 4** — 创建页面 `src/pages/projects/index.astro`

**Step 5** — Header 自动渲染新增的导航标签

### 写新文章

在 `src/content/blog/` 下创建 `.md` 文件，文件名建议格式 `YYYY-MM-DD-slug.md`：

```md
---
title: "文章标题"
description: "列表摘要 & SEO description"
publishedAt: 2026-05-10
updatedAt: 2026-05-15    # 可选
tags: ["技术", "前端"]
draft: false             # true 则构建时跳过
cover: "/og-image.png"   # 可选，OG 分享图
---

正文 (Markdown / MDX)...
```

push 到 main 分支后 GitHub Actions 自动部署。

### 添加交互组件

项目已预装 React 19 + `@astrojs/react`。需要客户端交互时：

```astro
---
// .astro 文件中
import Counter from "../components/Counter";
---
<Counter client:load />  <!-- 或 client:idle, client:visible -->
```

纯展示组件用 `.astro` 文件。需要 state/effect 时再用 React。

## 设计系统

| 色板角色 | 值 | 用途 |
|---|---|---|
| `--color-bg` | `oklch(0.145 0.008 260)` | 页面背景 (深蓝黑) |
| `--color-surface` | `oklch(0.18 0.01 260)` | 卡片背景 |
| `--color-text-primary` | `oklch(0.92 0.004 260)` | 主文字 |
| `--color-text-secondary` | `oklch(0.6 0.015 260)` | 次要文字 |
| `--color-accent` | `oklch(0.75 0.12 195)` | 强调色 (青) |
| `--color-border` | `oklch(0.22 0.015 260)` | 分割线 |

## 命令

| 命令 | 用途 |
|---|---|
| `pnpm dev` | 启动开发服务器 (localhost:4321) |
| `pnpm build` | 构建到 `dist/` |
| `pnpm preview` | 本地预览构建结果 |

## 部署

- **触发**: push 到 `main` 分支
- **流程**: GitHub Actions 执行 `pnpm install && pnpm build`，产物部署到 GitHub Pages
- **配置**: 仓库 Settings → Pages → Source = GitHub Actions
- **域名**: 生产 URL 在 `astro.config.mjs` 的 `site` 字段配置

## 注意事项

1. 本项目使用 pnpm，CI 中 `pnpm/action-setup` 指定了 v10
2. Astro 6 Content Layer 是新的默认 API，当前通过 `legacy.collectionsBackwardsCompat` 保持旧 API 兼容。迁移到新 API 时，需将 `defineCollection` 添加 `loader`，并将 `post.render()` 改为 `import { render } from "astro:content"; render(post)`
3. 文章 `[...slug].astro` 中 ID 包含 `.md` 扩展名，已做 strip 处理；换用新 API 后需重新验证

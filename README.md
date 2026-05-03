# Miao's World

个人综合性网站。包含博客、项目展示、关于页、全站搜索，预留旅行等板块扩展接口。

在线地址: **https://patronum711.github.io/miao-world/**

## 技术栈

| 层 | 选型 | 版本 |
|---|---|---|
| 框架 | Astro (SSG) | ^6.2 |
| 样式 | Tailwind CSS + `@tailwindcss/typography` | ^4.1 |
| 内容 | Astro Content Collections (legacy compat) | — |
| 搜索 | Pagefind | ^1.5 |
| 部署 | GitHub Pages (GitHub Actions) | — |
| 包管理 | pnpm | ^10 |

## 目录结构

```
miao-world/
├── astro.config.mjs            # site + base + sitemap + legacy flag + tailwindcss
├── tsconfig.json               # extends astro/tsconfigs/strict
├── package.json                # 依赖与脚本 (build = astro build + pagefind)
├── public/
├── src/
│   ├── content.config.ts       # Content Collections 集合 schema (blog + projects)
│   ├── content/
│   │   ├── blog/               # 博客文章 .md/.mdx
│   │   └── projects/           # 项目展示 .md
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BaseLayout.astro # <html>壳 + 防闪烁 + 滚动渐显脚本 + SEO + slot
│   │   │   ├── Header.astro     # 导航 + 主题切换 + 搜索图标
│   │   │   └── Footer.astro
│   │   ├── blog/
│   │   │   ├── PostCard.astro        # 列表卡片
│   │   │   ├── PostContent.astro     # 详情容器 (meta/TOC/正文/JSON-LD)
│   │   │   ├── PostNav.astro         # 上一篇/下一篇
│   │   │   ├── TableOfContents.astro # 右侧悬浮大纲
│   │   │   └── TagBar.astro          # 标签快捷筛选条
│   │   ├── project/
│   │   │   └── ProjectCard.astro     # 项目卡片 (封面/技术栈/链接)
│   │   └── ui/
│   │       ├── SEO.astro        # meta / OG 标签
│   │       ├── TagBadge.astro   # 标签徽章 (可选 href)
│   │       └── BackToTop.astro  # 回到顶部 (左侧内容区边缘)
│   ├── pages/
│   │   ├── index.astro          # "/" 主页 (打字动画 + 数据条 + 文章列表)
│   │   ├── about.astro          # "/about" 关于页 (卡片式)
│   │   ├── search.astro         # "/search" 全站搜索 (Pagefind)
│   │   ├── rss.xml.ts           # RSS feed
│   │   ├── blog/
│   │   │   ├── index.astro      # "/blog" 列表 (第1页 + TagBar)
│   │   │   ├── [...slug].astro  # "/blog/:slug" 文章详情
│   │   │   ├── tags/
│   │   │   │   ├── index.astro  # "/blog/tags" 标签云
│   │   │   │   └── [tag].astro  # "/blog/tags/:tag" 标签筛选
│   │   │   └── page/
│   │   │       └── [page].astro # "/blog/page/2" 分页
│   │   └── projects/
│   │       └── index.astro      # "/projects" 项目展示 (双列网格)
│   ├── data/navigation.ts       # 导航配置: 首页/博客/项目/关于
│   ├── styles/global.css        # Tailwind 4 + 亮/暗主题 + 噪声纹理 + 所有组件样式
│   └── utils/
│       ├── date.ts              # formatDate (zh-CN)
│       ├── path.ts              # href() — 所有 <a> 链接必须使用
│       └── reading-time.ts      # 中英文混合阅读时长
└── .github/workflows/deploy.yml # push main → 构建 + Pagefind → 部署
```

## 架构约定

### 导航 (数据驱动)

```ts
// src/data/navigation.ts
export const navigation = [
  { label: "首页", path: "/" },
  { label: "博客", path: "/blog" },
];
// 加板块 = 追加一行 + 创建对应 page 文件
```

Header 组件遍历渲染 + 自动高亮当前路由。搜索作为图标独立放在导航右侧，不走 navigation 数组。

### 路径系统

```ts
// src/utils/path.ts
import { href } from "../../utils/path";
href("/blog")  // → "/miao-world/blog" (自动根据 base 前缀)
```

**所有页面 `<a href>` 必须通过 `href()` 包装。** CSS/JS/图片等资源路径由 Astro + Vite 自动处理 base 前缀，`<a>` 标签不会。

### 内容集合

- `src/content.config.ts` 使用 `defineCollection` + `zod` schema
- 列表页用 `getCollection("blog")` 查询，支持 `filter` 过滤
- 详情页用 `import { render } from "astro:content"` 渲染 Markdown
- **注意**: 启用 `legacy.collectionsBackwardsCompat`（见下方陷阱章节）

### 主题切换

- 默认跟随系统 `prefers-color-scheme`
- 导航栏按钮循环: 系统 → 暗色 → 亮色
- 持久化到 `localStorage("theme")`
- `<head>` 内联脚本防闪烁 (渲染前读取 localStorage)
- CSS: `@media (prefers-color-scheme: dark)` + `[data-theme]` 属性选择器，`not([data-theme="light"])` 防止手动选择被系统覆盖

### 搜索 (Pagefind)

- `pnpm build` 后 Pagefind 自动扫描 `dist/` 建索引
- **只在生产构建后可用**，`pnpm dev` 不行
- 搜索页面通过 fetch + Blob URL 加载 Pagefind 模块（原因见陷阱章节）
- Pagefind 必须用 `createInstance({ basePath })` 指定索引位置
- 全站覆盖，未来新板块自动纳入

## 设计系统

### 亮色 (默认)

| 变量 | 值 | 用途 |
|---|---|---|
| `--color-bg` | `oklch(0.98 0.003 95)` | 暖白背景 |
| `--color-text-primary` | `oklch(0.16 0.005 260)` | 主文字 |
| `--color-text-secondary` | `oklch(0.46 0.01 260)` | 次要文字 |
| `--color-accent` | `oklch(0.48 0.14 195)` | 深青强调 |
| `--color-border` | `oklch(0.88 0.006 95)` | 分割线 |

### 暗色

| 变量 | 值 | 用途 |
|---|---|---|
| `--color-bg` | `oklch(0.22 0.01 260)` | 柔和深灰蓝 (非死黑) |
| `--color-text-primary` | `oklch(0.90 0.004 260)` | 主文字 |
| `--color-text-secondary` | `oklch(0.58 0.015 260)` | 次要文字 |
| `--color-accent` | `oklch(0.68 0.13 195)` | 亮青强调 |
| `--color-border` | `oklch(0.28 0.015 260)` | 分割线 |

## 扩展指南

### 添加板块

1. `navigation.ts` 追加 `{ label: "新板块", path: "/new" }`
2. `content.config.ts` 定义集合 (可选)
3. 创建 `src/pages/new/index.astro`，链接用 `href()`
4. 如有内容，创建 `src/content/new/` 目录

### 写新文章

在 `src/content/blog/` 下创建 `YYYY-MM-DD-slug.md`：

```md
---
title: "标题"
description: "摘要"
publishedAt: 2026-05-10
updatedAt: 2026-05-15    # 可选
tags: ["技术", "前端"]
draft: false             # true 则构建跳过
cover: "/og-image.png"   # 可选
---

正文
```

### 添加交互组件

项目已预装 React 19。纯展示用 `.astro`，需要 state/effect 时用 React:

```astro
<Counter client:load />  <!-- 或 client:idle / client:visible -->
```

## 命令

| 命令 | 用途 |
|---|---|
| `pnpm dev` | 开发 (热更新, 不含搜索) |
| `pnpm build` | 构建 + Pagefind 建索引 |
| `pnpm preview` | 预览生产构建 (含搜索) |

## 部署

- 仓库 `miao-world` → `base: "/miao-world"` in `astro.config.mjs`
- push `main` → GitHub Actions 自动部署
- Settings → Pages → Source = GitHub Actions

---

## 给后续 Agent 的踩坑指南

以下记录了本项目实现过程中遇到的实质性技术陷阱和解决路径。**修改相关代码前务必阅读**，避免重蹈覆辙。

### 1. Astro 6 Content Collections: legacy compat 是必需的

**问题**: Astro 6 默认使用 Content Layer API，旧式 `defineCollection` (不含 `loader`) 无法工作，集合为空。

**解决**: `astro.config.mjs` 必须设置 `legacy: { collectionsBackwardsCompat: true }`。这让:
- 无需手动配置 `loader`，自动以 glob loader 包装
- `entry.render()` 恢复为 `astro:content` 的 `render()` 函数
- 入口的 `.slug` 和 `.render()` API 可用

**注意**: 此模式下 `post.id` 包含文件扩展名 (如 `2026-05-03-hello-world.md`)。构建 URL 时必须 strip `.md`/`.mdx`:
```ts
post.id.replace(/\.mdx?$/, "")
```

### 2. Astro 6 的 base 路径: 链接不自动前缀

**问题**: 设置 `base: "/miao-world"` 后，CSS/JS/图片的 `<link>` 和 `<script>` 标签会自动加前缀，但 `<a href>` **不会**。直接写 `/blog` 会 404。

**解决**: 所有页面链接必须通过 `src/utils/path.ts` 的 `href()` 函数:
```ts
export function href(path: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
}
```

**双重前缀陷阱**: Pagefind 搜索结果返回的 `item.url` 已包含 `/miao-world/` 前缀(因为扫描的是 dist/ 中的 HTML)。对它再用 `href()` 会导致 `/miao-world/miao-world/...`。
→ 对 Pagefind 结果直接清理后缀 (`.html`, `/index.html`) 即可，不准用 `href()`。

### 3. Pagefind: 三大连续陷阱

#### 3a. `pnpm dev` 不可用

`pagefind --site dist` 只在 `pnpm build` 时运行。`pnpm dev` 从 src/ 提供服务，没有 Pagefind 索引文件。

→ 开发样式/页面用 `pnpm dev`，测试搜索必须 `pnpm build && pnpm preview`。

#### 3b. Vite 的 `P()` 预加载包装会破坏 `import().createInstance()`

**问题**: Vite 在编译时检测到 `import()` 中的模块路径，自动包装为 `P(() => import(...), __VITE_PRELOAD__)` (预加载辅助函数)。如果直接写:
```js
const pf = await import(`${baseUrl}/pagefind/pagefind.js`);
pagefind = pf.createInstance({ basePath: "..." });
```

Vite 编译后变成:
```js
m = await P(() => import(...), __VITE_PRELOAD__).createInstance(...)
```

`.createInstance()` 被错误地调用在 Promise 上 (`P()` 的返回值)，而非模块上。

**解决**: 用 fetch + Blob URL 彻底绕过 Vite 的静态分析:
```js
const pfUrl = baseUrl + "/pagefind/pagefind.js";
const text = await fetch(pfUrl).then(r => r.text());
const blob = new Blob([text], { type: "text/javascript" });
const blobUrl = URL.createObjectURL(blob);
const pf = await import(blobUrl);
URL.revokeObjectURL(blobUrl);
pagefind = pf.createInstance({ basePath: baseUrl + "/pagefind/" });
```

`import(blobUrl)` 的 URL 在运行时生成，Vite 无法静态分析，不会注入 `P()`。

#### 3c. Pagefind 必须用 `createInstance({ basePath })`

Pagefind 默认从 `/pagefind/` 加载索引和 WASM 文件。在子路径部署时，实际路径是 `/miao-world/pagefind/`。使用模块级别的 `pf.init()` 会走默认路径导致 404。

**解决**: 必须创建自定义实例并显式传入 basePath:
```js
pagefind = pf.createInstance({ basePath: "/miao-world/pagefind/" });
await pagefind.init();  // 现在会从正确路径加载
```

### 4. Tailwind CSS 4: 插件语法和 prose 变量完整性

#### 4a. 插件用 `@plugin` 不是 `@import`

Tailwind CSS 4 中加载第三方插件 (如 typography) 使用:
```css
@plugin "@tailwindcss/typography";
```
`@import` 会导致模块解析错误。

#### 4b. prose 变量必须完整覆盖

在亮/暗双模式下，只设几个 `--tw-prose-*` 变量是不够的。**缺失的变量会 fallback 到 Tailwind 默认值**，导致暗色背景下文字融入背景(如 `--tw-prose-bold` 默认是 `oklch(0.21)`——暗色底上几乎看不见)。

→ 显式设置全部 17 个 prose 变量: body, headings, links, bold, code, lead, bullets, counters, quotes, quote-borders, hr, pre-bg, pre-border, pre-code, captions, th-borders, td-borders。

### 5. 标签 URL: 不要手动 encodeURIComponent

在 `getStaticPaths` 的 `params` 中使用 `encodeURIComponent(tag)` 会导致路由匹配失败。Astro 会自动处理 URL 编码。

```ts
// 错误
params: { tag: encodeURIComponent(tag) }
// 正确
params: { tag }  // Astro 自动编码 URL
```

链接中的 tag 也用原始值，浏览器自动处理编码。

### 6. 分页: Astro `paginate()` 与 legacy content 不兼容

在 `index.astro` 中使用 `getStaticPaths` + `paginate()` 会因内容条目序列化问题导致 `Cannot read properties of undefined (reading 'data')`。需要改用手动分页:

- `/blog` → `index.astro` (无 getStaticPaths，取前 N 篇)
- `/blog/page/2` → `page/[page].astro` (有 getStaticPaths，按页码切片)

两个文件共享相似的模板逻辑（可抽出公共组件优化）。

### 7. 暗色模式: `data-theme` 与 `prefers-color-scheme` 的交互

手动切换和系统检测同时存在时，需要防止双向覆盖:

```css
/* 系统暗色 → 应用，除非用户强制亮色 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { ... }
}
/* 用户强制暗色 → 始终应用 */
:root[data-theme="dark"] { ... }
```

`not([data-theme="light"])` 是关键——用户选择亮色时，系统暗色规则不生效。

### 8. 导航链接的 "活跃" 状态判断

使用 `Astro.url.pathname` 匹配导航路径时，子路径需要 `startsWith`。但要特别注意根路径 "/":
```ts
const isActive = item.path === "/"
  ? currentPath === "/"
  : currentPath.startsWith(item.path);
```

如果 "/" 也用了 `startsWith`，所有页面都会高亮首页。

### 9. 页面入场动画无 JS 依赖

`fade-up` 动画 + `stagger-N` 延迟全部用纯 CSS 实现，无 JS 开销:
```css
.animate-enter { animation: fade-up 0.5s ease both; }
.stagger-1 { animation-delay: 0.08s; }
```

### 10. 配色使用 oklch 色彩空间

整个项目颜色统一使用 `oklch(L C H)` 格式而非 `#hex` 或 `rgb()`，因为:
- 亮度(L)和色相(H)直观解耦，调整暗色模式只需改 L
- 在不同显示器上感知一致性好
- 修改配色只需调整 `global.css` 中的 `@theme` 和暗色 `:root` 覆盖块，组件零改动

### 11. 滚动渐显动画 (IntersectionObserver)

页面用 `reveal` 类 + IntersectionObserver 实现滚动触发渐显。脚本在 `BaseLayout.astro` 末尾。

**注意**: 页面加载时立即可见的元素（如文章详情正文）**不要加 `reveal` 类**，否则会有短暂的 opacity:0 闪烁。只给首屏以下或列表类内容加。

### 12. 背景噪声纹理在亮/暗模式下的差异

SVG `feTurbulence` 噪声在白底上几乎不可见。解决方案:
- 亮色模式: `mix-blend-mode: multiply` + 较高 opacity (0.18)
- 暗色模式: `mix-blend-mode: normal` + 低 opacity (0.04)

`mix-blend-mode` 是让噪声在亮底上生效的关键。

### 13. 打字动画

主页打字轮播是纯 vanilla JS，无框架依赖。修改短语只需编辑 `index.astro` 中的 `phrases` 数组。前缀文字在 HTML 中硬编码。

### 快速对照表

| 问题 | 症状 | 解决 |
|---|---|---|
| Content 集合为空 | 构建警告 "collection does not exist" | `legacy.collectionsBackwardsCompat: true` |
| 页面链接 404 | 子路径部署链接断裂 | 所有 `<a href>` 用 `href()` |
| Pagefind 搜索不可用 | dev 模式无索引 | `pnpm build && pnpm preview` |
| Pagefind 搜索结果 404 | 点击结果链接 404 | 不对 Pagefind URL 用 `href()` |
| Vite 编译破坏 import | `.createInstance is not a function` | fetch + Blob URL |
| Pagefind 索引加载失败 | 搜索 "加载失败" | `createInstance({ basePath })` |
| 暗色加粗文字看不清 | 阅读体验差 | 补全全部 17 个 `--tw-prose-*` |
| 标签路由匹配失败 | 404 NoMatchingStaticPathFound | params 中不用 `encodeURIComponent` |

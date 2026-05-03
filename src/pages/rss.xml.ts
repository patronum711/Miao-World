import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { href } from "../utils/path";

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  return rss({
    title: "Miao's World",
    description: "Miao 的个人博客 — 技术分享与随笔",
    site: "https://patronum711.github.io",
    customData: `<language>zh-CN</language>`,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: href(`/blog/${post.id.replace(/\.mdx?$/, "")}`),
    })),
  });
}

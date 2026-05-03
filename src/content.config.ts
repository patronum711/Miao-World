import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()).default([]),
    github: z.string().optional(),
    demo: z.string().optional(),
    cover: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

// Future: const travels = defineCollection({ ... });

export const collections = { blog, projects };

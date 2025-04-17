import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep the existing users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define SEO analysis schema

export const metaTagsSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  canonical: z.string().url().optional(),
  viewport: z.string().optional(),
  robots: z.string().optional(),
  charset: z.string().optional(),
  language: z.string().optional(),
  author: z.string().optional(),
  ogTags: z.record(z.string(), z.string()).optional(),
  twitterTags: z.record(z.string(), z.string()).optional(),
  otherTags: z.array(
    z.object({
      name: z.string(),
      content: z.string()
    })
  ).optional(),
});

export const seoAnalysisSchema = z.object({
  url: z.string().url(),
  metaTags: metaTagsSchema,
  score: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      type: z.enum(["error", "warning", "info"]),
      message: z.string(),
      code: z.string()
    })
  ),
  recommendations: z.array(z.string()),
  tagSummary: z.array(
    z.object({
      name: z.string(),
      status: z.enum(["optimal", "present", "partial", "missing"]),
    })
  ),
});

export type MetaTags = z.infer<typeof metaTagsSchema>;
export type SEOAnalysis = z.infer<typeof seoAnalysisSchema>;

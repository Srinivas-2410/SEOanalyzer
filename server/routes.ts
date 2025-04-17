import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { seoAnalysisSchema, SEOAnalysis, MetaTags } from "@shared/schema";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

// URL validation schema
const urlSchema = z.object({
  url: z.string().url()
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Endpoint to analyze a website's SEO meta tags
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const { url } = urlSchema.parse(req.body);

      // Check if analysis already exists
      const existingAnalysis = await storage.getAnalysisByUrl(url);
      if (existingAnalysis) {
        return res.json(existingAnalysis);
      }

      // Fetch the HTML from the URL
      const response = await fetch(url, {
        headers: {
          "User-Agent": "SEO Meta Tag Analyzer Bot"
        }
      });

      if (!response.ok) {
        return res.status(400).json({
          message: `Failed to fetch the website: ${response.statusText}`
        });
      }

      const html = await response.text();
      
      // Parse meta tags
      const metaTags = extractMetaTags(html, url);
      
      // Analyze the meta tags
      const analysis = analyzeSEO(metaTags);
      
      // Save the analysis
      await storage.saveAnalysis(analysis);
      
      // Return the analysis
      return res.json(analysis);
    } catch (error) {
      console.error("Error analyzing website:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid URL format",
          errors: error.errors 
        });
      }
      
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "An unknown error occurred" 
      });
    }
  });

  return httpServer;
}

// Function to extract meta tags from HTML
function extractMetaTags(html: string, url: string): MetaTags {
  const $ = cheerio.load(html);
  const result: MetaTags = { url };
  
  // Extract basic meta tags
  result.title = $('title').text().trim() || undefined;
  
  // Extract meta description
  const description = $('meta[name="description"]').attr('content');
  if (description) {
    result.description = description.trim();
  }
  
  // Extract canonical URL
  const canonical = $('link[rel="canonical"]').attr('href');
  if (canonical) {
    result.canonical = canonical.trim();
  }
  
  // Extract viewport
  const viewport = $('meta[name="viewport"]').attr('content');
  if (viewport) {
    result.viewport = viewport.trim();
  }
  
  // Extract robots
  const robots = $('meta[name="robots"]').attr('content');
  if (robots) {
    result.robots = robots.trim();
  }
  
  // Extract charset
  const charset = $('meta[charset]').attr('charset');
  if (charset) {
    result.charset = charset.trim();
  }
  
  // Extract language
  const language = $('meta[name="language"]').attr('content');
  if (language) {
    result.language = language.trim();
  }
  
  // Extract author
  const author = $('meta[name="author"]').attr('content');
  if (author) {
    result.author = author.trim();
  }
  
  // Extract Open Graph tags
  const ogTags: Record<string, string> = {};
  $('meta[property^="og:"]').each((i, el) => {
    const property = $(el).attr('property')?.replace('og:', '');
    const content = $(el).attr('content');
    if (property && content) {
      ogTags[property] = content.trim();
    }
  });
  
  if (Object.keys(ogTags).length > 0) {
    result.ogTags = ogTags;
  }
  
  // Extract Twitter Card tags
  const twitterTags: Record<string, string> = {};
  $('meta[name^="twitter:"]').each((i, el) => {
    const name = $(el).attr('name')?.replace('twitter:', '');
    const content = $(el).attr('content');
    if (name && content) {
      twitterTags[name] = content.trim();
    }
  });
  
  if (Object.keys(twitterTags).length > 0) {
    result.twitterTags = twitterTags;
  }
  
  // Extract other meta tags
  const otherTags: { name: string; content: string }[] = [];
  $('meta').each((i, el) => {
    const name = $(el).attr('name');
    const content = $(el).attr('content');
    const property = $(el).attr('property');
    
    if (name && content && 
        !name.startsWith('twitter:') && 
        name !== 'description' &&
        name !== 'viewport' &&
        name !== 'robots' &&
        name !== 'language' &&
        name !== 'author') {
      otherTags.push({ name, content: content.trim() });
    } else if (property && content && !property.startsWith('og:')) {
      otherTags.push({ name: property, content: content.trim() });
    }
  });
  
  if (otherTags.length > 0) {
    result.otherTags = otherTags;
  }
  
  return result;
}

// Function to analyze SEO and generate score and recommendations
function analyzeSEO(metaTags: MetaTags): SEOAnalysis {
  const issues: {type: "error" | "warning" | "info"; message: string; code: string}[] = [];
  const recommendations: string[] = [];
  const tagSummary: {name: string; status: "optimal" | "present" | "partial" | "missing"}[] = [];
  let score = 100; // Start with a perfect score and subtract for issues
  
  // Analyze title
  if (!metaTags.title) {
    issues.push({
      type: "error",
      message: "Missing title tag",
      code: "missing_title"
    });
    tagSummary.push({
      name: "Title",
      status: "missing"
    });
    score -= 15;
    recommendations.push("Add a descriptive title tag to your page.");
  } else {
    const titleLength = metaTags.title.length;
    if (titleLength < 10) {
      issues.push({
        type: "warning",
        message: `Title tag is too short (${titleLength} chars)`,
        code: "title_too_short"
      });
      tagSummary.push({
        name: "Title",
        status: "partial"
      });
      score -= 5;
      recommendations.push("Make your title tag more descriptive (at least 10 characters).");
    } else if (titleLength > 60) {
      issues.push({
        type: "warning",
        message: `Title tag length (${titleLength} chars) exceeds optimal 60 character limit`,
        code: "title_too_long"
      });
      tagSummary.push({
        name: "Title",
        status: "partial"
      });
      score -= 3;
      recommendations.push("Shorten your title tag to 60 characters or less for better display in search results.");
    } else {
      tagSummary.push({
        name: "Title",
        status: "optimal"
      });
    }
  }
  
  // Analyze description
  if (!metaTags.description) {
    issues.push({
      type: "error",
      message: "Missing meta description",
      code: "missing_description"
    });
    tagSummary.push({
      name: "Description",
      status: "missing"
    });
    score -= 10;
    recommendations.push("Add a meta description to improve click-through rates from search results.");
  } else {
    const descriptionLength = metaTags.description.length;
    if (descriptionLength < 50) {
      issues.push({
        type: "warning",
        message: `Meta description is too short (${descriptionLength} chars)`,
        code: "description_too_short"
      });
      tagSummary.push({
        name: "Description",
        status: "partial"
      });
      score -= 5;
      recommendations.push("Make your meta description more descriptive (at least 50 characters).");
    } else if (descriptionLength > 160) {
      issues.push({
        type: "warning",
        message: `Meta description length (${descriptionLength} chars) exceeds optimal 160 character limit`,
        code: "description_too_long"
      });
      tagSummary.push({
        name: "Description",
        status: "partial"
      });
      score -= 3;
      recommendations.push("Shorten your meta description to 160 characters or less for better display in search results.");
    } else {
      tagSummary.push({
        name: "Description",
        status: "optimal"
      });
    }
  }
  
  // Analyze Open Graph tags
  const essentialOgTags = ["title", "description", "image", "url", "type"];
  if (!metaTags.ogTags || Object.keys(metaTags.ogTags).length === 0) {
    issues.push({
      type: "error",
      message: "Missing Open Graph meta tags for social sharing",
      code: "missing_og_tags"
    });
    tagSummary.push({
      name: "Open Graph",
      status: "missing"
    });
    score -= 10;
    recommendations.push("Add Open Graph meta tags to improve sharing on social media platforms like Facebook.");
  } else {
    const missingOgTags = essentialOgTags.filter(tag => !metaTags.ogTags?.[tag]);
    if (missingOgTags.length > 0) {
      issues.push({
        type: "warning",
        message: `Missing essential Open Graph tags: ${missingOgTags.join(", ")}`,
        code: "incomplete_og_tags"
      });
      tagSummary.push({
        name: "Open Graph",
        status: "partial"
      });
      score -= 5;
      recommendations.push(`Add missing Open Graph tags: ${missingOgTags.join(", ")}.`);
    } else {
      tagSummary.push({
        name: "Open Graph",
        status: "optimal"
      });
    }
  }
  
  // Analyze Twitter Card tags
  if (!metaTags.twitterTags || Object.keys(metaTags.twitterTags).length === 0) {
    issues.push({
      type: "error",
      message: "Missing Twitter Card meta tags for social sharing",
      code: "missing_twitter_tags"
    });
    tagSummary.push({
      name: "Twitter Cards",
      status: "missing"
    });
    score -= 10;
    recommendations.push("Add Twitter Card meta tags to improve sharing on Twitter.");
  } else {
    const essentialTwitterTags = ["card", "title", "description", "image"];
    const missingTwitterTags = essentialTwitterTags.filter(tag => !metaTags.twitterTags?.[tag]);
    if (missingTwitterTags.length > 0) {
      issues.push({
        type: "warning",
        message: `Missing essential Twitter Card tags: ${missingTwitterTags.join(", ")}`,
        code: "incomplete_twitter_tags"
      });
      tagSummary.push({
        name: "Twitter Cards",
        status: "partial"
      });
      score -= 5;
      recommendations.push(`Add missing Twitter Card tags: ${missingTwitterTags.join(", ")}.`);
    } else {
      tagSummary.push({
        name: "Twitter Cards",
        status: "optimal"
      });
    }
  }
  
  // Analyze canonical URL
  if (!metaTags.canonical) {
    issues.push({
      type: "warning",
      message: "Missing canonical URL",
      code: "missing_canonical"
    });
    tagSummary.push({
      name: "Canonical",
      status: "missing"
    });
    score -= 5;
    recommendations.push("Add a canonical URL tag to prevent duplicate content issues.");
  } else {
    tagSummary.push({
      name: "Canonical",
      status: "present"
    });
  }
  
  // Analyze viewport
  if (!metaTags.viewport) {
    issues.push({
      type: "warning",
      message: "Missing viewport meta tag for responsive design",
      code: "missing_viewport"
    });
    tagSummary.push({
      name: "Viewport",
      status: "missing"
    });
    score -= 5;
    recommendations.push("Add a viewport meta tag for better mobile rendering.");
  } else {
    tagSummary.push({
      name: "Viewport",
      status: "present"
    });
  }
  
  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  return {
    url: metaTags.url,
    metaTags,
    score,
    issues,
    recommendations,
    tagSummary
  };
}

import { metaTagsSchema, seoAnalysisSchema, type MetaTags, type SEOAnalysis } from "@shared/schema";

// Storage interface for SEO analysis
export interface IStorage {
  // Store a completed SEO analysis
  saveAnalysis(analysis: SEOAnalysis): Promise<SEOAnalysis>;
  
  // Get an analysis by URL
  getAnalysisByUrl(url: string): Promise<SEOAnalysis | undefined>;
  
  // Get analyses history (for potential future feature)
  getRecentAnalyses(limit?: number): Promise<SEOAnalysis[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private analyses: Map<string, SEOAnalysis>;

  constructor() {
    this.analyses = new Map();
  }

  async saveAnalysis(analysis: SEOAnalysis): Promise<SEOAnalysis> {
    // Normalize URL as the key
    const normalizedUrl = new URL(analysis.url).toString();
    this.analyses.set(normalizedUrl, analysis);
    return analysis;
  }

  async getAnalysisByUrl(url: string): Promise<SEOAnalysis | undefined> {
    // Normalize URL as the key
    const normalizedUrl = new URL(url).toString();
    return this.analyses.get(normalizedUrl);
  }

  async getRecentAnalyses(limit: number = 10): Promise<SEOAnalysis[]> {
    // Get most recent analyses (for future use)
    return Array.from(this.analyses.values())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();

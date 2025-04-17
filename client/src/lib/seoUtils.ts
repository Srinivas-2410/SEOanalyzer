import { MetaTags, SEOAnalysis } from "@shared/schema";

/**
 * Calculates the SEO score based on the presence and quality of meta tags
 */
export function calculateSeoScore(metaTags: MetaTags): number {
  let score = 0;
  
  // Title tag (max 25 points)
  if (metaTags.title) {
    score += 15;
    
    const titleLength = metaTags.title.length;
    if (titleLength >= 10 && titleLength <= 60) {
      score += 10;
    } else if (titleLength > 60 && titleLength <= 70) {
      score += 5;
    }
  }
  
  // Description tag (max 20 points)
  if (metaTags.description) {
    score += 10;
    
    const descLength = metaTags.description.length;
    if (descLength >= 50 && descLength <= 160) {
      score += 10;
    } else if (descLength > 160 && descLength <= 200) {
      score += 5;
    }
  }
  
  // Open Graph tags (max 20 points)
  if (metaTags.ogTags) {
    const ogTags = metaTags.ogTags;
    const essentialOgTags = ["title", "description", "image", "url", "type"];
    
    // 4 points for each essential tag present
    essentialOgTags.forEach(tag => {
      if (ogTags[tag]) {
        score += 4;
      }
    });
  }
  
  // Twitter Card tags (max 20 points)
  if (metaTags.twitterTags) {
    const twitterTags = metaTags.twitterTags;
    const essentialTwitterTags = ["card", "title", "description", "image"];
    
    // 5 points for each essential tag present
    essentialTwitterTags.forEach(tag => {
      if (twitterTags[tag]) {
        score += 5;
      }
    });
  }
  
  // Canonical URL (5 points)
  if (metaTags.canonical) {
    score += 5;
  }
  
  // Viewport (5 points)
  if (metaTags.viewport) {
    score += 5;
  }
  
  // Robots (5 points)
  if (metaTags.robots) {
    score += 5;
  }
  
  // Ensure score stays within 0-100 range
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Checks if a URL has the required format (includes protocol)
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Truncates text with ellipsis if it exceeds the maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * Formats the display URL (removes protocol and trailing slash)
 */
export function formatDisplayUrl(url: string): string {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

import { SEOAnalysis } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Copy } from "lucide-react";

interface RecommendationsPanelProps {
  analysis: SEOAnalysis;
}

export default function RecommendationsPanel({ analysis }: RecommendationsPanelProps) {
  // Group issues by severity
  const criticalIssues = analysis.issues.filter(issue => issue.type === "error");
  const warningIssues = analysis.issues.filter(issue => issue.type === "warning");
  
  // Determine good practices implemented
  const goodPractices = determineGoodPractices(analysis);

  // Generate example implementations based on issues
  const implementationGuide = generateImplementationGuide(analysis);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-6">SEO Recommendations</h3>
      
      <div className="space-y-4 sm:space-y-6">
        {/* Critical Issues */}
        {criticalIssues.length > 0 && (
          <div className="rounded-md bg-red-50 p-3 sm:p-4">
            <div className="flex">
              <div className="flex-shrink-0 mt-0.5">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              </div>
              <div className="ml-2 sm:ml-3">
                <h4 className="text-xs sm:text-sm font-medium text-red-800">Critical Issues</h4>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-700">
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    {criticalIssues.map((issue, index) => (
                      <li key={index}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Improvement Opportunities */}
        {warningIssues.length > 0 && (
          <div className="rounded-md bg-amber-50 p-3 sm:p-4">
            <div className="flex">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              </div>
              <div className="ml-2 sm:ml-3">
                <h4 className="text-xs sm:text-sm font-medium text-amber-800">Improvement Opportunities</h4>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-amber-700">
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    {warningIssues.map((issue, index) => (
                      <li key={index}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Good Practices */}
        {goodPractices.length > 0 && (
          <div className="rounded-md bg-green-50 p-3 sm:p-4">
            <div className="flex">
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <div className="ml-2 sm:ml-3">
                <h4 className="text-xs sm:text-sm font-medium text-green-800">Good Practices Implemented</h4>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-700">
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                    {goodPractices.map((practice, index) => (
                      <li key={index}>{practice}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Implementation Guide */}
        {implementationGuide.length > 0 && (
          <Card className="mt-6 sm:mt-8">
            <CardContent className="p-4 sm:p-6">
              <h4 className="text-base font-medium text-gray-900 mb-3 sm:mb-4">Implementation Guide</h4>
              
              <div className="space-y-4 sm:space-y-6">
                {implementationGuide.map((guide, index) => (
                  <div key={index}>
                    <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">{`${index + 1}. ${guide.title}`}</h5>
                    {guide.code && (
                      <div className="bg-gray-50 rounded-md p-2 sm:p-3">
                        <pre className="text-2xs sm:text-xs font-mono whitespace-pre-wrap break-all">{guide.code}</pre>
                      </div>
                    )}
                    {guide.explanation && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2">{guide.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Helper functions

// Define types for implementation guide
interface GuideItem {
  title: string;
  code?: string;
  explanation?: string;
}

function determineGoodPractices(analysis: SEOAnalysis): string[] {
  const goodPractices: string[] = [];
  const { metaTags, tagSummary } = analysis;
  
  // Check for good practices based on the tag summary
  tagSummary.forEach(tag => {
    if (tag.status === "optimal" || tag.status === "present") {
      switch (tag.name.toLowerCase()) {
        case "title":
          goodPractices.push("Title tag is well-formatted and within optimal length range.");
          break;
        case "description":
          goodPractices.push("Meta description is well-written and within optimal length range.");
          break;
        case "canonical":
          goodPractices.push("Canonical URL is properly implemented.");
          break;
        case "open graph":
          goodPractices.push("Basic Open Graph tags are present for social sharing.");
          break;
        case "twitter cards":
          goodPractices.push("Twitter Card tags are implemented for better Twitter sharing.");
          break;
        case "viewport":
          goodPractices.push("Viewport meta tag ensures proper mobile rendering.");
          break;
      }
    }
  });
  
  // Add specific good practices based on metadata
  if (metaTags.robots && metaTags.robots.includes("index")) {
    goodPractices.push("Page is properly set to be indexed by search engines.");
  }
  
  return goodPractices;
}

function generateImplementationGuide(analysis: SEOAnalysis): GuideItem[] {
  const guide: GuideItem[] = [];
  const { issues, metaTags } = analysis;
  
  // Add implementations based on issues
  issues.forEach(issue => {
    switch (issue.code) {
      case "missing_title":
        guide.push({
          title: "Add a Title Tag",
          code: `<title>Your Website Name | Primary Keyword - Secondary Keyword</title>`,
          explanation: "Keep your title under 60 characters for optimal display in search results."
        });
        break;
        
      case "missing_description":
        guide.push({
          title: "Add a Meta Description",
          code: `<meta name="description" content="A compelling description of your page that includes your main keywords and a call to action. Keep it under 160 characters for search engines.">`,
          explanation: "A good description improves click-through rates from search results."
        });
        break;
        
      case "missing_twitter_tags":
        guide.push({
          title: "Add Twitter Card Meta Tags",
          code: `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${metaTags.title || 'Your Website Title'}">
<meta name="twitter:description" content="${metaTags.description || 'A compelling description of your page'}">
<meta name="twitter:image" content="https://your-website.com/path/to/image.jpg">`,
          explanation: "Twitter Cards help your content stand out when shared on Twitter."
        });
        break;
        
      case "missing_og_tags":
        guide.push({
          title: "Add Open Graph Meta Tags",
          code: `<meta property="og:title" content="${metaTags.title || 'Your Website Title'}">
<meta property="og:description" content="${metaTags.description || 'A compelling description of your page'}">
<meta property="og:image" content="https://your-website.com/path/to/image.jpg">
<meta property="og:url" content="${metaTags.url || 'https://your-website.com/page-url'}">
<meta property="og:type" content="website">`,
          explanation: "Open Graph tags improve how your content appears when shared on social platforms like Facebook."
        });
        break;
        
      case "missing_canonical":
        guide.push({
          title: "Add a Canonical URL",
          code: `<link rel="canonical" href="${metaTags.url || 'https://your-website.com/current-page-url'}">`,
          explanation: "Canonical tags help prevent duplicate content issues by specifying the preferred URL for a page."
        });
        break;
        
      case "title_too_long":
        guide.push({
          title: "Shorten Title Tag",
          code: `<title>${metaTags.title?.substring(0, 55)}...</title>`,
          explanation: "Reduced from " + (metaTags.title?.length || 0) + " to under 60 characters while maintaining key information."
        });
        break;
        
      case "description_too_long":
        guide.push({
          title: "Shorten Meta Description",
          code: `<meta name="description" content="${metaTags.description?.substring(0, 155)}...">`,
          explanation: "Reduced from " + (metaTags.description?.length || 0) + " to under 160 characters while maintaining key information."
        });
        break;
    }
  });
  
  return guide;
}

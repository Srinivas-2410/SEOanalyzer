import { SEOAnalysis } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface SearchPreviewProps {
  analysis: SEOAnalysis;
}

export default function SearchPreview({ analysis }: SearchPreviewProps) {
  const { title, description, url } = analysis.metaTags;
  
  // Calculate length status for SEO elements
  const getTitleStatus = () => {
    if (!title) return "Missing";
    const length = title.length;
    
    if (length < 10) return `Too short (${length} characters)`;
    if (length > 60) return `Too long (${length} characters)`;
    return `Good (${length} characters)`;
  };
  
  const getDescriptionStatus = () => {
    if (!description) return "Missing";
    const length = description.length;
    
    if (length < 50) return `Too short (${length} characters)`;
    if (length > 160) return `Too long (${length} characters)`;
    return `Good (${length} characters)`;
  };
  
  const getCanonicalStatus = () => {
    return analysis.metaTags.canonical ? "Present" : "Missing";
  };
  
  // Format title tag as HTML
  const getTitleTag = () => {
    return title ? `<title>${title}</title>` : "";
  };
  
  // Format description tag as HTML
  const getDescriptionTag = () => {
    return description 
      ? `<meta name="description" content="${description}">` 
      : "";
  };
  
  // Format canonical tag as HTML
  const getCanonicalTag = () => {
    return analysis.metaTags.canonical 
      ? `<link rel="canonical" href="${analysis.metaTags.canonical}">` 
      : "";
  };
  
  // Get status class for text
  const getStatusClass = (status: string) => {
    if (status.includes("Good")) return "text-green-600";
    if (status.includes("Present")) return "text-green-600";
    if (status.includes("Too long") || status.includes("Too short")) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      <div className="w-full md:w-7/12">
        <h3 className="text-lg font-medium text-gray-900 mb-3 md:mb-4">Google Search Preview</h3>
        
        {/* Desktop Search Preview */}
        <Card className="mb-4 md:mb-6">
          <CardContent className="p-3 pt-4 md:p-4 md:pt-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2 md:mb-3">Desktop Preview</h4>
            <div className="max-w-2xl">
              <div className="text-lg md:text-xl text-blue-800 font-medium mb-1 truncate">
                {title || "No title available"}
              </div>
              <div className="text-green-700 text-xs md:text-sm mb-1 truncate">
                {url || "https://example.com/"}
              </div>
              <div className="text-xs md:text-sm text-gray-600 line-clamp-2">
                {description || "No description available"}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Mobile Search Preview */}
        <Card>
          <CardContent className="p-3 pt-4 md:p-4 md:pt-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2 md:mb-3">Mobile Preview</h4>
            <div className="max-w-sm">
              <div className="text-sm md:text-base text-blue-800 font-medium mb-1 truncate">
                {title || "No title available"}
              </div>
              <div className="text-green-700 text-xs mb-1 truncate">
                {url || "https://example.com/"}
              </div>
              <div className="text-xs text-gray-600 line-clamp-2">
                {description || "No description available"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="w-full md:w-5/12 mt-4 md:mt-0">
        <h3 className="text-lg font-medium text-gray-900 mb-3 md:mb-4">Search Engine Metadata</h3>
        
        <div className="space-y-3 md:space-y-4">
          <div>
            <div className="flex flex-wrap justify-between items-center mb-1">
              <h4 className="text-sm font-medium text-gray-700">Title Tag</h4>
              <span className={`text-xs ${getStatusClass(getTitleStatus())}`}>
                {getTitleStatus()}
              </span>
            </div>
            <div className="rounded-md bg-gray-50 px-2 md:px-3 py-2 text-xs md:text-sm font-mono break-all">
              {getTitleTag() || "No title tag found"}
            </div>
          </div>
          
          <div>
            <div className="flex flex-wrap justify-between items-center mb-1">
              <h4 className="text-sm font-medium text-gray-700">Meta Description</h4>
              <span className={`text-xs ${getStatusClass(getDescriptionStatus())}`}>
                {getDescriptionStatus()}
              </span>
            </div>
            <div className="rounded-md bg-gray-50 px-2 md:px-3 py-2 text-xs md:text-sm font-mono break-all">
              {getDescriptionTag() || "No meta description found"}
            </div>
          </div>
          
          <div>
            <div className="flex flex-wrap justify-between items-center mb-1">
              <h4 className="text-sm font-medium text-gray-700">Canonical URL</h4>
              <span className={`text-xs ${getStatusClass(getCanonicalStatus())}`}>
                {getCanonicalStatus()}
              </span>
            </div>
            <div className="rounded-md bg-gray-50 px-2 md:px-3 py-2 text-xs md:text-sm font-mono break-all">
              {getCanonicalTag() || "No canonical URL found"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

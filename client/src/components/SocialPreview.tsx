import { SEOAnalysis } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, X, CheckCircle, Copy } from "lucide-react";

interface SocialPreviewProps {
  analysis: SEOAnalysis;
}

export default function SocialPreview({ analysis }: SocialPreviewProps) {
  const { ogTags, twitterTags } = analysis.metaTags;
  
  // Default placeholder image for social previews
  const placeholderImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  
  // Get Open Graph image if available
  const ogImage = ogTags?.image || placeholderImage;
  
  // Get Twitter image if available
  const twitterImage = twitterTags?.image || placeholderImage;
  
  // Check if Twitter Card tags are missing
  const hasTwitterTags = twitterTags && Object.keys(twitterTags).length > 0;
  
  // Format Open Graph tags as HTML
  const formatOgTags = () => {
    if (!ogTags) return [];
    
    return Object.entries(ogTags).map(([key, value]) => (
      `<meta property="og:${key}" content="${value}">`
    ));
  };
  
  // Format Twitter Card tags as HTML
  const formatTwitterTags = () => {
    if (!twitterTags) return [];
    
    return Object.entries(twitterTags).map(([key, value]) => (
      `<meta name="twitter:${key}" content="${value}">`
    ));
  };
  
  // Example Twitter Card tags if missing
  const exampleTwitterTags = [
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${analysis.metaTags.title || 'Page Title'}">`,
    `<meta name="twitter:description" content="${analysis.metaTags.description || 'Page description'}">`,
    '<meta name="twitter:image" content="https://example.com/images/twitter-image.jpg">'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {/* Facebook Preview */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3 md:mb-4">Facebook Preview</h3>
        <Card className="overflow-hidden">
          <div className="bg-gray-100 h-44 sm:h-52 relative">
            <img 
              className="w-full h-full object-cover" 
              src={ogImage} 
              alt="Facebook preview image"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = placeholderImage;
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
              {analysis.metaTags.url?.replace(/^https?:\/\//, '') || 'example.com'}
            </div>
          </div>
          <CardContent className="p-3">
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
              {ogTags?.title || analysis.metaTags.title || "No title available"}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {ogTags?.description || analysis.metaTags.description || "No description available"}
            </p>
          </CardContent>
        </Card>
        
        {/* Open Graph Tags */}
        <div className="mt-3 md:mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Open Graph Tags</h4>
          <div className="space-y-2">
            {ogTags && Object.keys(ogTags).length > 0 ? (
              formatOgTags().map((tag, index) => (
                <div key={index} className="text-xs font-mono rounded-md bg-gray-50 px-2 sm:px-3 py-2 break-all">
                  {tag}
                </div>
              ))
            ) : (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <p className="text-xs sm:text-sm text-red-700">
                      Missing Open Graph tags. Add them to improve sharing on social media platforms.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Twitter Preview */}
      <div className="mt-6 lg:mt-0">
        <h3 className="text-lg font-medium text-gray-900 mb-3 md:mb-4">Twitter Preview</h3>
        
        {!hasTwitterTags ? (
          <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-red-50 flex items-start mb-4 sm:mb-6">
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mr-2" />
            <div>
              <h4 className="font-medium text-red-700 text-sm sm:text-base">Missing Twitter Card Metadata</h4>
              <p className="text-xs sm:text-sm text-gray-700 mt-1">
                This website does not include Twitter Card meta tags. Adding these tags would improve 
                how links appear when shared on Twitter.
              </p>
              <div className="mt-2 sm:mt-3">
                <h5 className="text-xs sm:text-sm font-medium text-gray-700">Recommended Tags:</h5>
                <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 mt-1">
                  <li>twitter:card</li>
                  <li>twitter:title</li>
                  <li>twitter:description</li>
                  <li>twitter:image</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <Card className="overflow-hidden mb-4 sm:mb-6">
            <div className="bg-gray-100 h-44 sm:h-52 relative">
              <img 
                className="w-full h-full object-cover" 
                src={twitterImage} 
                alt="Twitter preview image"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = placeholderImage;
                }}
              />
            </div>
            <CardContent className="p-3">
              <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                {twitterTags?.title || analysis.metaTags.title || "No title available"}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {twitterTags?.description || analysis.metaTags.description || "No description available"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {analysis.metaTags.url?.replace(/^https?:\/\//, '') || 'example.com'}
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Twitter Card Tags or Example */}
        <div className="mt-3 md:mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {hasTwitterTags ? "Twitter Card Tags" : "Example Twitter Card Tags"}
          </h4>
          <div className="space-y-2">
            {hasTwitterTags ? (
              formatTwitterTags().map((tag, index) => (
                <div key={index} className="text-xs font-mono rounded-md bg-gray-50 px-2 sm:px-3 py-2 break-all">
                  {tag}
                </div>
              ))
            ) : (
              exampleTwitterTags.map((tag, index) => (
                <div key={index} className="text-xs font-mono rounded-md bg-gray-50 px-2 sm:px-3 py-2 break-all">
                  {tag}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

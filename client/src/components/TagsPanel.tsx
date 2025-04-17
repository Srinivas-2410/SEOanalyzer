import { useState } from "react";
import { SEOAnalysis } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, Check, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TagsPanelProps {
  analysis: SEOAnalysis;
}

export default function TagsPanel({ analysis }: TagsPanelProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Format all meta tags for display and copying
  const getAllMetaTags = () => {
    const tags: string[] = [];
    const { metaTags } = analysis;
    
    // Title tag
    if (metaTags.title) {
      tags.push(`<title>${metaTags.title}</title>`);
    }
    
    // Basic meta tags
    if (metaTags.description) {
      tags.push(`<meta name="description" content="${metaTags.description}">`);
    }
    
    if (metaTags.viewport) {
      tags.push(`<meta name="viewport" content="${metaTags.viewport}">`);
    }
    
    if (metaTags.robots) {
      tags.push(`<meta name="robots" content="${metaTags.robots}">`);
    }
    
    if (metaTags.charset) {
      tags.push(`<meta charset="${metaTags.charset}">`);
    }
    
    if (metaTags.language) {
      tags.push(`<meta name="language" content="${metaTags.language}">`);
    }
    
    if (metaTags.author) {
      tags.push(`<meta name="author" content="${metaTags.author}">`);
    }
    
    // Canonical
    if (metaTags.canonical) {
      tags.push(`<link rel="canonical" href="${metaTags.canonical}">`);
    }
    
    // Open Graph tags
    if (metaTags.ogTags) {
      Object.entries(metaTags.ogTags).forEach(([key, value]) => {
        tags.push(`<meta property="og:${key}" content="${value}">`);
      });
    }
    
    // Twitter Card tags
    if (metaTags.twitterTags) {
      Object.entries(metaTags.twitterTags).forEach(([key, value]) => {
        tags.push(`<meta name="twitter:${key}" content="${value}">`);
      });
    }
    
    // Other tags
    if (metaTags.otherTags) {
      metaTags.otherTags.forEach(tag => {
        tags.push(`<meta name="${tag.name}" content="${tag.content}">`);
      });
    }
    
    return tags.join('\n');
  };
  
  // Define tag interfaces
  interface BasicTag {
    name: string;
    content: string;
  }

  interface SocialTag {
    name: string;
    content: string;
    present: boolean;
  }

  // Group tags by category for easier organization in the UI
  const getBasicTags = (): BasicTag[] => {
    const tags: BasicTag[] = [];
    const { metaTags } = analysis;
    
    if (metaTags.title) {
      tags.push({ name: 'title', content: metaTags.title });
    }
    
    if (metaTags.description) {
      tags.push({ name: 'description', content: metaTags.description });
    }
    
    if (metaTags.viewport) {
      tags.push({ name: 'viewport', content: metaTags.viewport });
    }
    
    if (metaTags.robots) {
      tags.push({ name: 'robots', content: metaTags.robots });
    }
    
    if (metaTags.canonical) {
      tags.push({ name: 'canonical', content: metaTags.canonical });
    }
    
    return tags;
  };
  
  const getSocialTags = (): SocialTag[] => {
    const tags: SocialTag[] = [];
    const { metaTags } = analysis;
    
    // Open Graph tags
    if (metaTags.ogTags) {
      Object.entries(metaTags.ogTags).forEach(([key, value]) => {
        tags.push({ name: `og:${key}`, content: value, present: true });
      });
    }
    
    // Twitter Card tags
    if (metaTags.twitterTags) {
      Object.entries(metaTags.twitterTags).forEach(([key, value]) => {
        tags.push({ name: `twitter:${key}`, content: value, present: true });
      });
    }
    
    // Add missing essential Twitter tags
    const essentialTwitterTags = ['card', 'title', 'description', 'image'];
    if (!metaTags.twitterTags) {
      essentialTwitterTags.forEach(tag => {
        tags.push({ name: `twitter:${tag}`, content: 'Missing', present: false });
      });
    } else {
      essentialTwitterTags.forEach(tag => {
        if (metaTags.twitterTags[tag] === undefined) {
          tags.push({ name: `twitter:${tag}`, content: 'Missing', present: false });
        }
      });
    }
    
    return tags;
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(getAllMetaTags())
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied!",
          description: "All meta tags copied to clipboard",
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "There was an error copying to clipboard",
        });
      });
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">All Meta Tags</h3>
      
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="bg-gray-100 py-2 px-3 sm:px-4 flex-row justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-sm sm:text-base font-medium text-gray-700">Meta Tags Found</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-blue-800 font-medium text-xs sm:text-sm h-8"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Clipboard className="h-4 w-4 mr-1" />}
            {copied ? "Copied" : "Copy All"}
          </Button>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 max-h-64 sm:max-h-96 overflow-y-auto bg-gray-50">
          <pre className="text-xs font-mono whitespace-pre-wrap break-all">
            {getAllMetaTags() || "No meta tags found"}
          </pre>
        </CardContent>
      </Card>
      
      <div className="mt-6 sm:mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3 sm:mb-4">Tags by Category</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Basic Meta Tags */}
          <Card>
            <CardHeader className="bg-gray-100 py-2 px-3 sm:px-4">
              <CardTitle className="text-sm sm:text-base font-medium text-gray-700">Basic Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <ul className="space-y-2 sm:space-y-3">
                {getBasicTags().map((tag, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-2xs sm:text-xs">&lt;{tag.name === 'canonical' ? 'link rel="canonical"' : (tag.name === 'title' ? 'title' : `meta name="${tag.name}"`)}&gt;</span>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 break-all">{tag.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Social Media Tags */}
          <Card>
            <CardHeader className="bg-gray-100 py-2 px-3 sm:px-4">
              <CardTitle className="text-sm sm:text-base font-medium text-gray-700">Social Media Tags</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <ul className="space-y-2 sm:space-y-3">
                {getSocialTags().map((tag, index) => (
                  <li key={index} className="flex items-start">
                    {tag.present ? (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-mono text-2xs sm:text-xs">&lt;meta {tag.name.startsWith('og:') ? `property="${tag.name}"` : `name="${tag.name}"`}&gt;</span>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 break-all">{tag.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

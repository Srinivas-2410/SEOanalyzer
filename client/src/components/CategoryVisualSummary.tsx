import { SEOAnalysis } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, X, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryVisualSummaryProps {
  analysis: SEOAnalysis;
  category: "general" | "social" | "technical";
  onViewDetails?: () => void;
}

// Define the status type to be used throughout the component
type StatusType = "optimal" | "present" | "partial" | "missing";

// Define the item type for the returned data structure
interface CategoryItem {
  name: string;
  status: StatusType;
}

interface CategoryData {
  title: string;
  icon: React.ReactNode;
  items: CategoryItem[];
}

export default function CategoryVisualSummary({ 
  analysis, 
  category,
  onViewDetails 
}: CategoryVisualSummaryProps) {
  const { title, icon, items } = getCategoryData(analysis, category);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                {getStatusIcon(item.status)}
                <span className="ml-2">{item.name}</span>
              </div>
              <Badge 
                variant={item.status === "optimal" ? "default" : 
                        item.status === "present" ? "outline" : 
                        item.status === "partial" ? "secondary" : "destructive"}
                className="text-2xs font-normal"
              >
                {getStatusText(item.status)}
              </Badge>
            </li>
          ))}
        </ul>
        
        {onViewDetails && (
          <div className="mt-4 text-right">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onViewDetails}
              className="text-xs"
            >
              View Details
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getCategoryData(analysis: SEOAnalysis, category: "general" | "social" | "technical"): CategoryData {
  switch (category) {
    case "general":
      return {
        title: "Core SEO Elements",
        icon: <CheckCircle className="h-4 w-4 text-blue-500" />,
        items: [
          {
            name: "Title Tag",
            status: getTagStatus(analysis, "Title")
          },
          {
            name: "Meta Description",
            status: getTagStatus(analysis, "Description")
          },
          {
            name: "Canonical URL",
            status: getTagStatus(analysis, "Canonical")
          },
          {
            name: "Robots Directive",
            status: analysis.metaTags.robots ? ("present" as StatusType) : ("missing" as StatusType)
          }
        ]
      };
      
    case "social":
      return {
        title: "Social Media Optimization",
        icon: <CheckCircle className="h-4 w-4 text-pink-500" />,
        items: [
          {
            name: "Open Graph Tags",
            status: getTagStatus(analysis, "Open Graph")
          },
          {
            name: "Twitter Cards",
            status: getTagStatus(analysis, "Twitter Cards")
          },
          {
            name: "OG Image",
            status: analysis.metaTags.ogTags?.image ? ("present" as StatusType) : ("missing" as StatusType)
          },
          {
            name: "Social Title & Description",
            status: (analysis.metaTags.ogTags?.title && analysis.metaTags.ogTags?.description) ? 
              ("present" as StatusType) : ((analysis.metaTags.ogTags?.title || analysis.metaTags.ogTags?.description) ? 
              ("partial" as StatusType) : ("missing" as StatusType))
          }
        ]
      };
      
    case "technical":
      return {
        title: "Technical SEO",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        items: [
          {
            name: "Viewport Meta Tag",
            status: analysis.metaTags.viewport ? ("optimal" as StatusType) : ("missing" as StatusType)
          },
          {
            name: "Character Encoding",
            status: analysis.metaTags.charset ? ("present" as StatusType) : ("missing" as StatusType)
          },
          {
            name: "Language",
            status: analysis.metaTags.language ? ("present" as StatusType) : ("missing" as StatusType)
          },
          {
            name: "Author Metadata",
            status: analysis.metaTags.author ? ("present" as StatusType) : ("missing" as StatusType)
          }
        ]
      };
  }
}

function getTagStatus(analysis: SEOAnalysis, tagName: string): StatusType {
  const tag = analysis.tagSummary.find(t => t.name.toLowerCase() === tagName.toLowerCase());
  const status = tag ? tag.status : "missing";
  // Type assertion to ensure it's one of the accepted types
  return status as StatusType;
}

function getStatusIcon(status: StatusType) {
  switch (status) {
    case "optimal":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "present":
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case "partial":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "missing":
      return <X className="h-4 w-4 text-red-500" />;
  }
}

function getStatusText(status: StatusType) {
  switch (status) {
    case "optimal":
      return "Optimal";
    case "present":
      return "Present";
    case "partial":
      return "Needs Improvement";
    case "missing":
      return "Missing";
  }
}
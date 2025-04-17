import { SEOAnalysis } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopRecommendationsProps {
  analysis: SEOAnalysis;
  onViewAll?: () => void;
}

export default function TopRecommendations({ analysis, onViewAll }: TopRecommendationsProps) {
  // Get top 3 recommendations (or fewer if there aren't enough)
  const topRecommendations = analysis.recommendations.slice(0, 3);
  
  // If there are no recommendations, show a success message
  if (topRecommendations.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center">
            <Lightbulb className="h-4 w-4 text-blue-500 mr-2" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 rounded-md text-center">
            <p className="text-green-700 text-sm">
              All SEO checks passed! Your page is well-optimized.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Lightbulb className="h-4 w-4 text-blue-500 mr-2" />
          Top Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {topRecommendations.map((recommendation, index) => (
            <li key={index} className="bg-blue-50 rounded-md p-3">
              <div className="flex items-start">
                <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <span className="text-xs font-medium text-blue-700">{index + 1}</span>
                </div>
                <p className="text-sm text-blue-800">{recommendation}</p>
              </div>
            </li>
          ))}
        </ul>
        
        {analysis.recommendations.length > 3 && onViewAll && (
          <div className="mt-3 text-right">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onViewAll}
              className="text-xs"
            >
              View All ({analysis.recommendations.length})
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
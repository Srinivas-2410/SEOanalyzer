import { SEOAnalysis } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";

import VisualSummary from "./VisualSummary";
import CategoryVisualSummary from "./CategoryVisualSummary";
import IssuesSummary from "./IssuesSummary";
import TopRecommendations from "./TopRecommendations";
import SEOScorecard from "./SEOScorecard";
import PreviewTabs from "./PreviewTabs";

interface SEODashboardProps {
  analysis: SEOAnalysis;
}

export default function SEODashboard({ analysis }: SEODashboardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-6">
      {/* Visual Dashboard */}
      <VisualSummary analysis={analysis} />
      
      {/* Visual Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CategoryVisualSummary
          analysis={analysis}
          category="general"
        />
        <CategoryVisualSummary
          analysis={analysis}
          category="social"
        />
        <CategoryVisualSummary
          analysis={analysis}
          category="technical"
        />
      </div>
      
      {/* Issues and Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IssuesSummary analysis={analysis} />
        <TopRecommendations 
          analysis={analysis}
          onViewAll={() => {
            setShowDetails(true);
            // Scroll to the recommendations tab
            const recommendationsTab = document.getElementById("recommendationsTab");
            if (recommendationsTab) {
              setTimeout(() => {
                recommendationsTab.click();
                // Scroll to view it
                document.getElementById("detailedTabs")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }
          }}
        />
      </div>
      
      {/* Website URL */}
      <div className="bg-white shadow rounded-lg p-4 overflow-hidden">
        <div className="flex items-center">
          <div className="flex-grow overflow-hidden">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Analyzed URL</h3>
            <div className="flex items-center overflow-hidden">
              <p className="text-sm font-mono truncate">{analysis.url}</p>
              <a
                href={analysis.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="outline"
            size="sm"
            className="ml-4"
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Details
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Detailed Analysis */}
      {showDetails && (
        <div id="detailedTabs">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Analysis</h2>
          <Tabs defaultValue="scorecard">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scorecard">
                SEO Scorecard
              </TabsTrigger>
              <TabsTrigger value="previews">
                Previews
              </TabsTrigger>
              <TabsTrigger value="recommendations" id="recommendationsTab">
                Recommendations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="scorecard">
              <SEOScorecard analysis={analysis} />
            </TabsContent>
            <TabsContent value="previews">
              <PreviewTabs analysis={analysis} />
            </TabsContent>
            <TabsContent value="recommendations">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">All Recommendations</h3>
                
                {analysis.recommendations.length === 0 ? (
                  <div className="p-4 bg-green-50 rounded-md text-center">
                    <p className="text-green-700">
                      All SEO checks passed! Your page is well-optimized.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="bg-blue-50 rounded-md p-4">
                        <div className="flex items-start">
                          <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                            <span className="text-sm font-medium text-blue-700">{index + 1}</span>
                          </div>
                          <p className="text-sm text-blue-800">{recommendation}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
import { SEOAnalysis } from "@shared/schema";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SEOScorecardProps {
  analysis: SEOAnalysis;
}

export default function SEOScorecard({ analysis }: SEOScorecardProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">SEO Analysis Summary</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Score Card */}
          <div className="flex-1 rounded-lg border border-gray-200 p-6 text-center">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4 mx-auto">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Overall Score</h3>
            <div className="mt-2 text-4xl font-semibold text-primary bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">{analysis.score}</div>
            <p className="mt-1 text-sm text-gray-500">Based on best practices</p>
          </div>
          
          {/* Meta Tags Summary */}
          <div className="flex-1 rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Meta Tags Summary</h3>
            <ul className="space-y-3">
              {analysis.tagSummary.map((tag, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{tag.name}</span>
                  <StatusBadge status={tag.status} />
                </li>
              ))}
            </ul>
          </div>
          
          {/* Issues & Recommendations */}
          <div className="flex-1 rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Issues & Recommendations</h3>
            <ul className="space-y-2">
              {analysis.issues.map((issue, index) => (
                <li key={index} className="text-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {issue.type === "error" ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <p className="ml-2 text-gray-700">{issue.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatusBadgeProps {
  status: "optimal" | "present" | "partial" | "missing";
}

function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "optimal":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle className="-ml-0.5 mr-1.5 h-3 w-3" />,
          label: "Optimal"
        };
      case "present":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle className="-ml-0.5 mr-1.5 h-3 w-3" />,
          label: "Present"
        };
      case "partial":
        return {
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          icon: <AlertTriangle className="-ml-0.5 mr-1.5 h-3 w-3" />,
          label: "Partial"
        };
      case "missing":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: <XCircle className="-ml-0.5 mr-1.5 h-3 w-3" />,
          label: "Missing"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      config.bgColor,
      config.textColor
    )}>
      {config.icon}
      {config.label}
    </span>
  );
}

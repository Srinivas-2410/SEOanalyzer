import { SEOAnalysis } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, XOctagon, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface IssuesSummaryProps {
  analysis: SEOAnalysis;
}

export default function IssuesSummary({ analysis }: IssuesSummaryProps) {
  const criticalIssues = analysis.issues.filter(issue => issue.type === "error");
  const warningIssues = analysis.issues.filter(issue => issue.type === "warning");
  
  // Calculate a health score based on issues
  const totalIssues = criticalIssues.length * 2 + warningIssues.length;
  const maxIssues = 10; // Arbitrary max for scaling
  const healthPercentage = Math.max(0, Math.min(100, 100 - (totalIssues / maxIssues * 100)));
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Issues Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="mb-1 flex justify-between items-center">
            <span className="text-sm font-medium">SEO Health</span>
            <span className="text-sm">{Math.round(healthPercentage)}%</span>
          </div>
          <Progress value={healthPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-red-50 rounded-md flex items-center">
            <XOctagon className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <div className="text-lg font-semibold text-red-700">{criticalIssues.length}</div>
              <div className="text-xs text-red-600">Critical Issues</div>
            </div>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <div>
              <div className="text-lg font-semibold text-amber-700">{warningIssues.length}</div>
              <div className="text-xs text-amber-600">Warnings</div>
            </div>
          </div>
        </div>
        
        {criticalIssues.length === 0 && warningIssues.length === 0 ? (
          <div className="mt-3 p-3 bg-green-50 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <div className="text-sm text-green-700">No issues detected!</div>
          </div>
        ) : (
          <div className="mt-3">
            {criticalIssues.length > 0 && (
              <div className="mb-2">
                <h4 className="text-xs font-medium text-red-700 mb-1">Critical Issues:</h4>
                <ul className="text-xs space-y-1 text-gray-700">
                  {criticalIssues.slice(0, 2).map((issue, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500 mt-1.5 mr-1.5"></span>
                      {issue.message}
                    </li>
                  ))}
                  {criticalIssues.length > 2 && (
                    <li className="text-xs text-red-600">+{criticalIssues.length - 2} more</li>
                  )}
                </ul>
              </div>
            )}
            
            {warningIssues.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-amber-700 mb-1">Warnings:</h4>
                <ul className="text-xs space-y-1 text-gray-700">
                  {warningIssues.slice(0, 2).map((issue, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-1 h-1 rounded-full bg-amber-500 mt-1.5 mr-1.5"></span>
                      {issue.message}
                    </li>
                  ))}
                  {warningIssues.length > 2 && (
                    <li className="text-xs text-amber-600">+{warningIssues.length - 2} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
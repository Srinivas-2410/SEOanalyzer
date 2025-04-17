import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CategoryScoreCardProps {
  name: string;
  status: "optimal" | "present" | "partial" | "missing";
  icon?: React.ReactNode;
  description?: string;
}

export default function CategoryScoreCard({ name, status, icon, description }: CategoryScoreCardProps) {
  const { color, bgColor, progress, statusText, statusIcon } = getCategoryStyle(status);

  return (
    <Card className={cn("overflow-hidden border-t-4", bgColor)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            {icon && <div className="mr-2">{icon}</div>}
            <h3 className="text-base font-semibold">{name}</h3>
          </div>
          <div className={cn("text-xs font-medium px-2 py-1 rounded-full flex items-center", color, bgColor)}>
            {statusIcon}
            <span className="ml-1">{statusText}</span>
          </div>
        </div>
        
        {description && (
          <p className="text-xs text-gray-600 mb-2">{description}</p>
        )}
        
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}

function getCategoryStyle(status: "optimal" | "present" | "partial" | "missing") {
  switch (status) {
    case "optimal":
      return {
        color: "text-green-700",
        bgColor: "border-green-500 bg-green-50",
        progress: 100,
        statusText: "Excellent",
        statusIcon: <CheckCircle className="h-3 w-3" />
      };
    case "present":
      return {
        color: "text-blue-700",
        bgColor: "border-blue-500 bg-blue-50",
        progress: 80,
        statusText: "Good",
        statusIcon: <CheckCircle className="h-3 w-3" />
      };
    case "partial":
      return {
        color: "text-amber-700",
        bgColor: "border-amber-500 bg-amber-50",
        progress: 50,
        statusText: "Improve",
        statusIcon: <AlertTriangle className="h-3 w-3" />
      };
    case "missing":
      return {
        color: "text-red-700",
        bgColor: "border-red-500 bg-red-50",
        progress: 0,
        statusText: "Missing",
        statusIcon: <XCircle className="h-3 w-3" />
      };
  }
}
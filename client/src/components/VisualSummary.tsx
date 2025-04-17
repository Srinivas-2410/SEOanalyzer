import { SEOAnalysis } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Globe, Share2, Book, Tag, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CategoryScoreCard from "./CategoryScoreCard";

interface VisualSummaryProps {
  analysis: SEOAnalysis;
}

export default function VisualSummary({ analysis }: VisualSummaryProps) {
  // Calculate category statistics
  const stats = getCategoryStats(analysis);
  
  // Find status for each important category
  const getTagStatus = (name: string) => {
    const tag = analysis.tagSummary.find(t => t.name.toLowerCase() === name.toLowerCase());
    return tag ? tag.status : "missing";
  }

  const titleStatus = getTagStatus("title");
  const descriptionStatus = getTagStatus("description");
  const openGraphStatus = getTagStatus("open graph");
  const twitterStatus = getTagStatus("twitter cards");
  const canonicalStatus = getTagStatus("canonical");
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Visual Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Column */}
        <div className="md:col-span-2 lg:col-span-1">
          <Card className="p-4 flex flex-col h-full">
            <h3 className="text-lg font-medium mb-4">SEO Status</h3>
            
            <div className="flex items-center mb-5">
              <div className="relative w-24 h-24 mr-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {analysis.score}
                  </div>
                </div>
                <svg className="absolute top-0 left-0" width="100" height="100" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e6e6e6" 
                    strokeWidth="6" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="6" 
                    strokeDasharray={`${2 * Math.PI * 45 * analysis.score / 100} ${2 * Math.PI * 45 * (1 - analysis.score / 100)}`}
                    strokeDashoffset="0" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Overall Score</h3>
                <p className="text-sm text-gray-500">Based on best practices</p>
                <div className="flex items-center mt-1 text-sm">
                  {getScoreIndicator(analysis.score)}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 flex-grow">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Core SEO</span>
                  <span className="font-medium">{stats.core.percentage}%</span>
                </div>
                <Progress value={stats.core.percentage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Social Media</span>
                  <span className="font-medium">{stats.social.percentage}%</span>
                </div>
                <Progress value={stats.social.percentage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Technical</span>
                  <span className="font-medium">{stats.technical.percentage}%</span>
                </div>
                <Progress value={stats.technical.percentage} className="h-2" />
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-md bg-blue-50 text-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-blue-700">
                    {getScoreSummaryMessage(analysis.score)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Categories Column */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            <CategoryScoreCard
              name="Page Title"
              status={titleStatus}
              icon={<Book className="h-4 w-4 text-blue-500" />}
              description={getTitleDescription(analysis)}
            />
            
            <CategoryScoreCard
              name="Meta Description"
              status={descriptionStatus}
              icon={<Tag className="h-4 w-4 text-indigo-500" />}
              description={getDescriptionDescription(analysis)}
            />
            
            <CategoryScoreCard
              name="Social Sharing"
              status={openGraphStatus}
              icon={<Share2 className="h-4 w-4 text-pink-500" />}
              description={getSocialDescription(analysis, "og")}
            />
            
            <CategoryScoreCard
              name="Twitter Cards"
              status={twitterStatus}
              icon={<Share2 className="h-4 w-4 text-blue-400" />}
              description={getSocialDescription(analysis, "twitter")}
            />
            
            <CategoryScoreCard
              name="Canonical URL"
              status={canonicalStatus}
              icon={<ExternalLink className="h-4 w-4 text-green-500" />}
              description="A canonical URL helps prevent duplicate content issues"
            />
            
            <CategoryScoreCard
              name="Mobile Friendliness"
              status={analysis.metaTags.viewport ? "optimal" : "missing"}
              icon={<Globe className="h-4 w-4 text-purple-500" />}
              description="Viewport meta tag ensures proper mobile rendering"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions

function getCategoryStats(analysis: SEOAnalysis) {
  // Core SEO category: title, description, canonical
  const coreElements = ["title", "description", "canonical"];
  const coreTotal = coreElements.length;
  const corePresent = analysis.tagSummary.filter(
    tag => coreElements.includes(tag.name.toLowerCase()) && (tag.status === "optimal" || tag.status === "present")
  ).length;
  const corePartial = analysis.tagSummary.filter(
    tag => coreElements.includes(tag.name.toLowerCase()) && tag.status === "partial"
  ).length;
  
  // Social Media category: Open Graph, Twitter Cards
  const socialElements = ["open graph", "twitter cards"];
  const socialTotal = socialElements.length;
  const socialPresent = analysis.tagSummary.filter(
    tag => socialElements.includes(tag.name.toLowerCase()) && (tag.status === "optimal" || tag.status === "present")
  ).length;
  const socialPartial = analysis.tagSummary.filter(
    tag => socialElements.includes(tag.name.toLowerCase()) && tag.status === "partial"
  ).length;
  
  // Technical category: viewport, robots, charset, etc.
  const technicalElements = ["viewport", "robots", "charset", "language"];
  const technicalCount = technicalElements.reduce((count, element) => 
    analysis.metaTags[element as keyof typeof analysis.metaTags] ? count + 1 : count, 0
  );
  
  return {
    core: {
      present: corePresent,
      partial: corePartial,
      total: coreTotal,
      percentage: Math.round((corePresent + corePartial * 0.5) / coreTotal * 100)
    },
    social: {
      present: socialPresent,
      partial: socialPartial,
      total: socialTotal,
      percentage: Math.round((socialPresent + socialPartial * 0.5) / socialTotal * 100)
    },
    technical: {
      present: technicalCount,
      total: technicalElements.length,
      percentage: Math.round(technicalCount / technicalElements.length * 100)
    }
  };
}

function getScoreIndicator(score: number) {
  if (score >= 80) {
    return (
      <>
        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
        <span className="text-green-700">Excellent</span>
      </>
    );
  } else if (score >= 60) {
    return (
      <>
        <CheckCircle className="h-4 w-4 text-blue-500 mr-1" />
        <span className="text-blue-700">Good</span>
      </>
    );
  } else if (score >= 40) {
    return (
      <>
        <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
        <span className="text-amber-700">Needs Improvement</span>
      </>
    );
  } else {
    return (
      <>
        <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
        <span className="text-red-700">Poor</span>
      </>
    );
  }
}

function getScoreSummaryMessage(score: number) {
  if (score >= 80) {
    return "Your website has excellent SEO optimization. Keep up the good work!";
  } else if (score >= 60) {
    return "Your SEO is good, but there's still room for improvement.";
  } else if (score >= 40) {
    return "Your SEO needs improvement. Check recommendations to boost your score.";
  } else {
    return "Your SEO is poor. Implementing the recommended changes is highly advised.";
  }
}

function getTitleDescription(analysis: SEOAnalysis) {
  if (!analysis.metaTags.title) {
    return "Missing title tag. This is critical for SEO.";
  }
  
  const length = analysis.metaTags.title.length;
  if (length < 10) {
    return `Title is too short (${length} chars). Aim for 50-60 chars.`;
  } else if (length > 60) {
    return `Title is too long (${length} chars). Keep it under 60 chars.`;
  } else {
    return `Good title length (${length} chars).`;
  }
}

function getDescriptionDescription(analysis: SEOAnalysis) {
  if (!analysis.metaTags.description) {
    return "Missing meta description. This is important for SEO.";
  }
  
  const length = analysis.metaTags.description.length;
  if (length < 50) {
    return `Description is too short (${length} chars). Aim for 120-155 chars.`;
  } else if (length > 160) {
    return `Description is too long (${length} chars). Keep it under 160 chars.`;
  } else {
    return `Good description length (${length} chars).`;
  }
}

function getSocialDescription(analysis: SEOAnalysis, type: "og" | "twitter") {
  const tags = type === "og" ? analysis.metaTags.ogTags : analysis.metaTags.twitterTags;
  
  if (!tags || Object.keys(tags).length === 0) {
    return `Missing ${type === "og" ? "Open Graph" : "Twitter Card"} tags.`;
  }
  
  const essentialTags = type === "og" 
    ? ["title", "description", "image", "url", "type"]
    : ["card", "title", "description", "image"];
  
  const missingCount = essentialTags.filter(tag => !tags[tag]).length;
  
  if (missingCount === 0) {
    return `All essential ${type === "og" ? "Open Graph" : "Twitter Card"} tags present.`;
  } else {
    return `Missing ${missingCount} essential ${type === "og" ? "Open Graph" : "Twitter Card"} tags.`;
  }
}